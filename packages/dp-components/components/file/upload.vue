<template>
<div ref="dragRef" :class="['drag', { 'drag-active': state.active }]" >
    <p class="drag-title">{{$t('common_dragFileHere')}}
      <SvgIcon v-if="accept" class="el-icon--right" src="/icons/tip.svg" :content="`${$t('onlyAccept')}:${accept}`"></SvgIcon>
    </p>
    <el-button @click="clickUpload('file')"> {{$t('button.uploadFile')}} </el-button>
    <el-button @click="clickUpload('folder')"> {{$t('button.uploadFolder')}} </el-button>
    <input  v-show="false" ref="fileUploaderRef"
                multiple
                type="file"
                :accept="accept"
                @change="uploadHandler($event, 'fileUploader')"/>
    <input  v-show="false" ref="folderUploaderRef"
            multiple="false"
            type="file"
            :accept="accept"
            webkitdirectory
            @change="uploadHandler($event, 'folderUploader')"
        />
</div>
</template>

<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
const props = withDefaults(defineProps<{
    accept: string,
}>(), {
  accept: ''
})
const emits = defineEmits(['change'])
const state = reactive({
    active: false
})
const fileUploaderRef = ref(null)
const folderUploaderRef = ref(null)
const dragRef = ref(null)
// #region module: handleDrop
  const handleDrop = async (e) => {
    e.preventDefault()
    state.active = false
    const files = await addDataTransfer(e.dataTransfer)
    emits("change", files)
  }
  function handleDragLeave (e) {
    state.active = false
    e.preventDefault()
  }
  function handleDragEnter (e) {
    state.active = true
    e.preventDefault()
  }
  function handleDragOver (e) {
    state.active = true
      e.preventDefault()
  }
// #endregion

function uploadHandler (e) {
  const files = Array.from(e.target.files) 
  const result = files.reduce((prev,file) => {
    prev.push({
      id: '',
      size: file.size,
      name: file.name,
      fileType: file.type,
      file,
    })
    return prev
  }, [])
  e.target.value = '' // 解决不能上传相同文件问题
  emits("change", result)
}
function clickUpload (type) {
  type === 'file' ?
  fileUploaderRef.value.click() :
  folderUploaderRef.value.click()
}
onMounted(() => {
  useEventListener(dragRef, 'drop', handleDrop)  
  useEventListener(dragRef, 'dragleave', handleDragLeave)  
  useEventListener(dragRef, 'dragenter', handleDragEnter)  
  useEventListener(dragRef, 'dragover', handleDragOver)  
  // dragRef.value.addEventListener('drop', handleDrop)
  // dragRef.value.addEventListener('dragleave', handleDragLeave)
  // dragRef.value.addEventListener('dragenter', handleDragEnter)
  // dragRef.value.addEventListener('dragover', handleDragOver)
})

</script>
<style lang="scss" scoped>
.drag {
    height: 220px;
    border: 1px dashed #DEDEDE;
    border-radius: 4px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    &-active {
        border: 1px dashed #2260FF;
    }

    &-title {
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &-subtile {
        font-size: 12px;
        color: #999999;
        margin-top: 30px;
        text-align: center;
        line-height: unset;
    }
}
</style>
