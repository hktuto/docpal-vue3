<template>
    <div class="detail">

        <div ref="containerEl" class="detail__container">
          <div class="detail__bg">
          </div>
            <div class="detail__tools">
                <div class="actions">
                    <SvgIcon :class="{icon:true, selected: orientation === 'ver'}" :content="$t('Click to switch vertical screen')" src="/icons/ver.svg" @click="changeOrientation('ver')" />
                    <SvgIcon :class="{icon:true, selected: orientation === 'hoz'}" :content="$t('Click to switch to landscape')" src="/icons/hoz.svg" @click="changeOrientation('hoz')" />
                </div>
                <div class="actions">
                  <SvgIcon class="icon tools text" :content="$t('Click to add Text')" src="/icons/newText.svg" @click="newWatermark('text')"/>
                  <SvgIcon class="icon tools image" :content="$t('Click to add Image')" src="/icons/newImage.svg" @click="newWatermark('image')"/>
                </div>
            </div>
            <div class="detail__canvas__container">
                <canvas id="canvas" ref="canvasEl" :class="{'detail__canvas':true, orientation:true}"></canvas>
            </div>
            <div v-if="selectedObject && state.watermarkEditShow" class="detail__property">
                <WatermarkEditText v-if="isTextWatermark(selectedObject.type)" v-model:modelValue="selectedObject" @change="objectUpdated" @fontUpdate="fontUpdate" @fillChange="changeFillColor" @anchorChange="anchorChangeHandler" @delete="removeWatermark" />
                <WatermarkEditImage v-else v-model:modelValue="selectedObject" @change="objectUpdated" @delete="removeWatermark" @anchorChange="anchorChangeHandler" />
                <WatermarkPreset v-model="selectedObject" @change="objectUpdated" />
            </div>
        </div>

        <div class="detail__footer">
          <ElButton type="primary" @click="save">Save</ElButton>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { fabric } from "fabric";
import { useEventListener } from '@vueuse/core'
import {useWatermark, WatermarkTemplateDetail, Watermark} from '../../composables/Watermark'

const emits = defineEmits(['update','change', 'delete', 'anchorChange'])

const props = defineProps<{
    detail: any
}>();
const state = reactive({
  watermarkEditShow: true
})
const {detail} = toRefs(props)
const i18n = useI18n()
const orientation = ref<'ver' | 'hoz'>('ver');
const bgImg = computed(() => orientation.value === 'ver' ? '/images/watermark/ver.png' : '/images/watermark/hoz.png')
const {updateWatermarkTemplateDetail, isTextWatermark, removeWatermarkApi, fontSizeConverter, newTextWatermark, newImageWatermark, watermarkToFabricObject} = useWatermark()
// store watermark fabric object
const fabricStore = ref<any[]>([]);
const fabricCanvas = ref<any>(null);
const canvasEl = ref<any>(null);
const containerEl = ref<any>(null);
const itemToDelete = ref([]);

const selectedObject = ref<any>(null);
const canvasScale = ref(1);
function newWatermark(type: 'text' | 'image') {
  switch (type) {
    case 'text':
      const text = newTextWatermark(fabricCanvas.value);
      fabricCanvas.value.add(text);
      fabricCanvas.value.setActiveObject(text);
      fabricStore.value.push(text);
      break;
    case 'image':
      const url = '/images/copy-stamp.png';
      // create new image and set onload event
      const imgEL = new Image();
      imgEL.id = 'object_' + Date.now();
      imgEL.onload = (img) => {
        // calculate the scale of the image
        const fabricImage = new fabric.Image(imgEL, {
          // @ts-ignore
          id: imgEL.id,
          width: imgEL.width,
          height: imgEL.height,
          opacity: 1,
          position: 'tLeft',
          scaleX: imgEL.width > 300 ? 300 / imgEL.width : 1,
          scaleY: imgEL.width > 300 ? 300 / imgEL.width : 1,
          angle: 0,
          offset:{
            x:0,
            y:0,
          }
        })
        fabricCanvas.value.add(fabricImage);
        fabricCanvas.value.setActiveObject(fabricImage);
        fabricStore.value.push(fabricImage);
      }
      imgEL.src = url;
      break;
    default:
      break;
  }

}

function changeOrientation(newOrientation: "ver" | "hoz") {
  orientation.value = newOrientation
  initFabric();
}

function setUpFabric() {
  if (fabricCanvas.value) {
    fabricCanvas.value.dispose();
  }
  const containerSize = containerEl.value.getBoundingClientRect();
  const containerOrientation = containerSize.width > containerSize.height ? 'hoz' : 'ver';
  let width = 0;
  let height = 0;
  if (containerOrientation === 'ver') {
    width = containerSize.width - 120;
    height = width * (orientation.value === 'ver' ? 1.5 : 0.6666)
    if (height > containerSize.height - 40) {
      height = containerSize.height - 40;
      width = height * (orientation.value === 'ver' ? 0.6666 : 1.5);
    }
  } else {
    height = containerSize.height - 40;
    width = height * (orientation.value === 'ver' ? 0.6666 : 1.5);
    if (width > containerSize.width - 120) {
      width = containerSize.width - 120;
      height = width * (orientation.value === 'ver' ? 1.5 : 0.6666);
    }
  }
  canvasEl.value.width = width;
  canvasEl.value.height = height;
  // canvasScale is the ratio of canvas size to the original size
  // use height to calculate because font resize is based on height
  canvasScale.value = height / (orientation.value === 'ver' ? 640 : 960 )
  // init fabric canvas
  fabricCanvas.value = new fabric.Canvas('canvas');

  fabric.Image.fromURL(bgImg.value, (img) => {
    img.set({
      selectable: false,
      width: img.width,
      height: img.height,
      scaleX: fabricCanvas.value.getWidth() / img.width,
      scaleY: fabricCanvas.value.getHeight() / img.height,
    });
    fabricCanvas.value.add(img);
    img.sendToBack();
  });
  // draw watermark

  // setup event select listener
  fabricCanvas.value.on('selection:created', (e) => {
    objectSelected(e);
  })

  // listen to select change event
  fabricCanvas.value.on('selection:updated', (e) => {
    objectSelected(e);
  })

  // fabric deselected event
  fabricCanvas.value.on('selection:cleared', (e) => {
    selectedObject.value = null;
  })

  // fabric object modified event
  fabricCanvas.value.on('object:modified', (e) => {
    objectModified(e);
  })
}
function initFabric() {
  selectedObject.value = null;
  fabricStore.value = [];
  itemToDelete.value = [];
  // set canvas size
  setUpFabric();

  //  loop props.detail and convert to watermark
  renderWatermark();

}

function resizeFabric() {

  setUpFabric();
  fabricStore.value.forEach( item => {
    if(isTextWatermark(item.type)){
      item.set({
        left: item.offset.x * fabricCanvas.value.getWidth(),
        top: item.offset.y * fabricCanvas.value.getHeight(),
        fontSize: fontSizeConverter(item.font.size, fabricCanvas.value.getHeight()),
      })
    }else{

      item.set({
        left: item.offset.x * fabricCanvas.value.getWidth(),
        top: item.offset.y * fabricCanvas.value.getHeight(),
        scaleX: item.scaleX ,
        scaleY: item.scaleY ,
      })
      item.setSrc(item.data);
    }
    fabricCanvas.value.add(item);
  })
}
function renderWatermark() {
  props.detail.watermarkSettings.forEach( (item:any) => {
    if(isTextWatermark(item.type)){

      const obj = watermarkToFabricObject(item, fabricCanvas.value);
      fabricStore.value.push(obj);
      fabricCanvas.value.add(obj);
    } else {
      // set img
      const url = item.content;
      // create new image and set onload event
      const imgEL = new Image();
      imgEL.id = 'object_' + Date.now();
      imgEL.onload = (img) => {
        const fabricImage = new fabric.Image(imgEL, {
          // @ts-ignore
          id: item.id,
          width: imgEL.width,
          height: imgEL.height,
          opacity: item.opacity || 1,
          scaleX: Number(item.scale),
          scaleY: Number(item.scale),
          angle: item.rotate || 0,
          left: item.offset.x * fabricCanvas.value.getWidth() ,
          top: item.offset.y * fabricCanvas.value.getHeight() ,
          offset:item.offset,
          data: item.content,
          position: item.position,
          centerOffset: item.centerOffset,
          snapAngle: 1,
        })
        fabricCanvas.value.add(fabricImage);
        fabricCanvas.value.setActiveObject(fabricImage);
        fabricStore.value.push(fabricImage);
      }
      imgEL.src = url;
    }

  })
}

function changeFillColor(color: string) {
  if (selectedObject.value) {
    selectedObject.value.set('fill', color);
    selectedObject.value.font.color = color;
    fabricCanvas.value.renderAll();
  }
}

function anchorChangeHandler(newAnchor: string) {
  switch (newAnchor) {
    case 'tLeft':
      selectedObject.value.set({
        left: 0,
        top: 0,
      });
      break;
    case 'tRight':
      selectedObject.value.set({
        left: fabricCanvas.value.getWidth() - selectedObject.value.width,
        top: 0,
      });
      break;
    case 'bLeft' :
      selectedObject.value.set({
        left: 0,
        top: fabricCanvas.value.getHeight() - selectedObject.value.height
      });
      break;
    case 'bRight':
      selectedObject.value.set({
        left: fabricCanvas.value.getWidth() - selectedObject.value.width,
        top: fabricCanvas.value.getHeight() - selectedObject.value.height,
      });
      break;
    case 'center':
      selectedObject.value.set({
        left: fabricCanvas.value.getWidth() / 2 - selectedObject.value.width / 2,
        top: fabricCanvas.value.getHeight() / 2 - selectedObject.value.height / 2,
      });
      break;
  }
  selectedObject.value.position = newAnchor;
  selectedObject.value.offset = {
    x : selectedObject.value.left / fabricCanvas.value.getWidth(),
    y : selectedObject.value.top / fabricCanvas.value.getHeight()
  }
  fabricCanvas.value.renderAll()

}
function objectUpdated() {
  fabricCanvas.value.renderAll()
}

function fontUpdate(size) {
  if (selectedObject.value) {
    selectedObject.value.fontSize = fontSizeConverter(size, fabricCanvas.value.getHeight())
    selectedObject.value.font.size = size;
    fabricCanvas.value.renderAll()
  }
}

function objectModified({target}) {
  target.offset = {
    x : target.left / fabricCanvas.value.getWidth(),
    y : target.top / fabricCanvas.value.getHeight()
  }
  target.centerOffset = {
    x : target.getCenterPoint().x / fabricCanvas.value.getWidth(),
    y : target.getCenterPoint().y / fabricCanvas.value.getHeight()
  };
    updateData()
}
function updateData () {
  state.watermarkEditShow = false
  setTimeout(() => {
    state.watermarkEditShow = true
  })
}
function objectSelected({selected}) {
  if (selected.length === 1) {
    selectedObject.value = selected[0];
  }
}

function removeWatermark(){
  if(selectedObject.value){
    // check selected object is in props.detail
    const index = props.detail.watermarkSettings.findIndex( (item:any) => item.id === selectedObject.value.id);
    if(index > -1){
      // if in props.detail, push to itemToDelete
      itemToDelete.value.push(selectedObject.value.id)
    }
    fabricCanvas.value.remove(selectedObject.value);
    selectedObject.value = null;
    fabricCanvas.value.renderAll();
  }
}

async function save() {
  // convert all fabric object to watermark
  const watermarks:Watermark[] = []
  fabricCanvas.value.getObjects().forEach((obj,index) => {
    const { id, type , position ,  text} = obj;
    // if no id skip
    if (!id) return;
    if(isTextWatermark(type)) {
      // convert text and dynamic fabric to watermark
      const textObj:any = {
        order: index - 1, // bgimg is the first one
        id,
        type,
        position,
        offset: obj.offset,
        rotate: obj.angle,
        content: text,
        opacity: obj.opacity,
        font: obj.font,
        centerOffset: obj.centerOffset,
      }
      watermarks.push(textObj)
    }else {
      // load src to new canvas and export as base64
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = obj.width;
      canvas.height = obj.height;
      ctx.drawImage(obj._originalElement, 0, 0);
      const base64 = canvas.toDataURL();
      const imgObj = {
        order: index - 1, // bgimg is the first one
        id,
        type,
        position,
        offset: obj.offset,
        rotate: obj.angle,
        opacity: obj.opacity,
        scale: obj.scaleX,
        data: base64,
        centerOffset: obj.centerOffset,
      }
      watermarks.push(imgObj);
    }

  })

  const data = {
    ...props.detail,
    watermarkSettings: watermarks
  }
  const promise = []
  promise.push(updateWatermarkTemplateDetail(data));
  // loop through itemToDelete and delete them
  itemToDelete.value.forEach( id => {
    promise.push(removeWatermarkApi(id))
  })
  try {
    await Promise.all(promise);
    emits('update');
    ElMessage.success(i18n.t('msg_successfullyModified') as string);
  } catch (error) {
    emits('update');
  }
}

watch(detail, (newVal) => {
  if (newVal) {
    initFabric();
  }
})

onMounted(() => {
  initFabric();
})

useEventListener(window, 'resize', () => {
  resizeFabric();
})

</script>


<style lang="scss" scoped>
.detail{
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-rows: 1fr min-content;
    gap: 0;
  &__footer{
    display: flex;
    justify-content: flex-end;
    padding-block: 12px;
  }
    &__bg{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
        background:
            conic-gradient(from 90deg at 1px 1px,#C9DDF4 90deg,#DEE7EE 0)
            0 0/10px 10px;
    }
    &__container{
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
    }
    &__canvas__container{
        width: 100%;
        height: 100%;
        padding: 20px;
        display: grid;
        place-items: center;
    }
    &__property{
      position: absolute;
      right : 12px;
      top: 12px;
      z-index: 2;
    }
    &__tools {
        position: absolute;
        left: 12px;
        top: 12px;
        z-index: 2;
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
        .actions{
            display: flex;
            flex-flow: column nowrap;
            gap: 12px;
            align-items: center;
            justify-content: flex-start;
            background: #fff;
            border-radius: 4px;
            padding: 8px;
            box-shadow: 0 0 4px rgba(0,0,0,0.1);
            background: var(--color-grey-0000);
        }
    }
}
#canvas {
    width: 100%;
    background: #fff;
}

.icon{
    color: var(--color-grey-400);
    cursor: pointer;
    &.selected {
        color: var(--primary-color);
    }
    &.tools {
      :hover {
        color: var(--primary-color);
      }
    }
}
</style>
