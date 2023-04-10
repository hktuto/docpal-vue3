<template>
<div ref="dragRef" :class="['drag', { 'drag-active': state.active }]" >
    <p class="drag-title">{{$t('common_dragFileHere')}}</p>
    <el-button @click="clickUpload('file')"> {{$t('button.uploadFile')}} </el-button>
    <el-button @click="clickUpload('folder')"> {{$t('button.uploadFolder')}} </el-button>
    <input  v-show="false" ref="fileUploaderRef"
                multiple
                type="file"
                @change="uploadHandler($event, 'fileUploader')"/>
    <input  v-show="false" ref="folderUploaderRef"
            multiple="false"
            type="file"
            webkitdirectory
            @change="uploadHandler($event, 'folderUploader')"
        />
</div>
</template>

<script lang="ts" setup>
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
  // 添加 DataTransfer
  async function addDataTransfer(dataTransfer) {
    // dataTransfer.items 支持
    if (dataTransfer?.items?.length) {
      const entrys: Array<File | FileSystemEntry> = []
      // 遍历出所有 dataTransferVueUploadItem
      for (let i = 0; i < dataTransfer.items.length; i++) {
        const dataTransferTtem = dataTransfer.items[i]
        let entry: File | FileSystemEntry | null
        // @ts-ignore
        if (dataTransferTtem.getAsEntry) {
          // @ts-ignore
          entry = dataTransferTtem.getAsEntry() || dataTransferTtem.getAsFile()
        } else if (dataTransferTtem.webkitGetAsEntry) {
          entry = dataTransferTtem.webkitGetAsEntry() || dataTransferTtem.getAsFile()
        } else {
          entry = dataTransferTtem.getAsFile()
        }
        if (entry) {
          entrys.push(entry)
        }
      }
      
      return await getFileSystemEntry(entrys)
    }
    // dataTransfer.files 支持
    const files = []
    if (dataTransfer.files.length) {
      for (let i = 0; i < dataTransfer.files.length; i++) {
        files.push(dataTransfer.files[i])
      }
      return Promise.resolve(files)
    }
    return Promise.resolve([])
  }
  function getFileSystemEntry (entry: Array<File | FileSystemEntry> | File | FileSystemEntry, path = '') {
    return new Promise((resolve) => {
      if (!entry) {
        resolve([])
        return
      }
      if (entry instanceof Array) {
        // 多个
        const uploadFiles: any[] = []
        const forEach = (i: number) => {
          const v = entry[i]
          if (!v) {
            return resolve(uploadFiles)
          }
          getFileSystemEntry(v, path).then(function (results) {
            uploadFiles.push(...results)
            forEach(i + 1)
          })
        }
        forEach(0)
        return
      }
      if (entry instanceof Blob) {
        resolve([
          {
            id: '',
            size: entry.size,
            // @ts-ignore
            name: entry.name,
            path: path,
            fileType: entry.type,
            file: entry,
          }
        ])
        return
      }
      if (entry.isFile) {
        let fileEntry = entry as FileSystemFileEntry
        fileEntry.file(function (file: File) {
          resolve([
            {
              id: '',
              size: file.size,
              name: file.name,
              path: path,
              fileType: file.type,
              file,
            }
          ])
        })
        return
      }
      if (entry.isDirectory) {
        let directoryEntry = entry as FileSystemDirectoryEntry
        const uploadFiles: any[] = []
        const dirReader = directoryEntry.createReader()
        const readEntries = () => {
          dirReader.readEntries((entries: any) => {
            const forEach = (i: number) => {
              if ((!entries[i] && i === 0)) {
                return resolve(uploadFiles)
              }
              if (!entries[i]) {
                return readEntries()
              }
              getFileSystemEntry(entries[i], path + directoryEntry.name + '/').then(function (results) {
                uploadFiles.push(...results)
                forEach(i + 1)
              })
            }
            forEach(0)
          })
        }
        readEntries()
        return
      }
    })
    resolve([])
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
  emits("change", result)
}
function clickUpload (type) {
  type === 'file' ?
  fileUploaderRef.value.click() :
  folderUploaderRef.value.click()
}
onMounted(() => {
  dragRef.value.addEventListener('drop', handleDrop)
  dragRef.value.addEventListener('dragleave', handleDragLeave)
  dragRef.value.addEventListener('dragenter', handleDragEnter)
  dragRef.value.addEventListener('dragover', handleDragOver)
})

onUnmounted(() => {
  dragRef.value.removeEventListener('drop', handleDrop)
  dragRef.value.removeEventListener('dragleave', handleDragLeave)
  dragRef.value.removeEventListener('dragenter', handleDragEnter)
  dragRef.value.removeEventListener('dragover', handleDragOver)
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
