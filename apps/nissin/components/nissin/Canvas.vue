
<script lang="ts" setup>
import ImageCropper from './cropper'
type Tools = "move" | "scale" | "draw" | "select";

type CanvasProps = {
    image?: File,
    canvasSize: number
}
const emit = defineEmits(['clear'])
const props = withDefaults(defineProps<CanvasProps>(), {
    image: null,
    canvasSize: 600
})
const mainCanvas = ref();
const canvas = ref();
// canvas setting 

const currentTool = ref<Tools>('move')
const cropper = ref<any>();
const {image, canvasSize} = toRefs(props);

function cleanImg() {
    currentTool.value = "move"
        cropper.value = null;
        emit('clear');
}
function changeTool(tool:Tools) {
    console.log("Change tool on vue")
    currentTool.value = tool;
    if(cropper.value) {
        cropper.value.changeTool(tool);
    }
}

function drawBgImage() {

}

function toolChangeCallback(tool:Tools) {
    console.log("toolChangeCallback", tool)
    currentTool.value = tool;
}

async function initCanvas() {
    console.log(image.value);
    cropper.value = new ImageCropper(mainCanvas.value, image.value, canvasSize.value, toolChangeCallback)
}

onMounted(() => initCanvas())
</script>

<template>
    <div class="canvasContaienr">
        <div class="filename">{{image.name}}<el-button icon="el-icon-delete-solid" size="small" circle @click="cleanImg"></el-button></div>
         <div  class="control">
            <div class="tools">
                <div :class="{tool:true, current: currentTool === 'select'}" @click="changeTool('select')">Select</div>
                <div :class="{tool:true, current: currentTool === 'draw'}" @click="changeTool('draw')">Draw</div>
                <div :class="{tool:true, moveTool:true, current: currentTool === 'move'}" @click="changeTool('move')">Move</div>
                <div class="tool zoomIn" @click="cropper.zoomIn()">in</div>
                <div class="tool zoomOut" @click="cropper.zoomOut()">out</div>
            </div>
        </div>
        <div id="cropperContainer" :class="{cropperContainer:true, show: image}" style="--scale:1;--translate:0px, 0px;--origin:0% 0%;">
            <canvas id="mainCanvas" ref="mainCanvas" />
        </div>
    </div>
</template>



<style lang="scss" scoped>

.cropperContainer{
    width:100%;
    height: 100%;
    position: absolute;
    left:0;
    top:0;
    opacity:0;
    z-index: -1;
    transition: opacity 0.2s ease-in-out;
    overflow: hidden;
    &.show{
        opacity:1;
        z-index: 1;
    }
}
#mainCanvas {
}

.control{
    position: absolute;
    bottom: var(--app-padding);
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    z-index: 2;
    .tools{
        display: flex;
        flex-flow: row nowrap;
        gap: var(--app-padding);
        border-radius: var(--app-padding);
        padding: var(--app-padding);
        background: var(--color-grey-000);
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        > * {
            cursor: point;
            user-select: none;
        }
    }
}
.tool{
    &.current {
        color:var(--primary-color);
    }
}
.filename{
    position: absolute;
    left:0;
    top:0;
    width: 100%;
    text-align: center;
    font-size: 1.2rem;
    z-index:2;
}
</style>


<style>
.canvas-container{
    transform: translate(var(--translate)) scale(var(--scale)) ;
    transform-origin: var(--origin);
}

</style>