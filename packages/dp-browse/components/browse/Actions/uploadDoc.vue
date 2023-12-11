<template>
<input  v-show="false" ref="fileUploaderRef"
            multiple
            type="file"
            :accept="accept"
            @change="uploadHandler($event)"/>
<input  v-show="false" ref="folderUploaderRef"
        multiple="false"
        type="file"
        :accept="accept"
        webkitdirectory
        @change="uploadHandler($event)"
    />
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { useEventListener } from '@vueuse/core'
import { useUploadAIStore } from '../../../composables/uploadAI'
import {  } from 'dp-api'
const props = withDefaults(defineProps<{
    accept: string,
    backPath: string
}>(), {
    accept: '',
    backPath: '/browse'
})
const state = reactive({
    doc: {}
})
const router = useRouter()
const { getUploadFiles, createUploadRequest } = useUploadAIStore()
const fileUploaderRef = ref()
const folderUploaderRef = ref()

function uploadHandler (e: any) {
    const files: File[] = Array.from(e.target?.files) 
    const uploadFiles = files.reduce((prev: any, file, index) => {
        prev.push({
            id: new Date().valueOf().toString() + index,
            size: file.size,
            name: file.name,
            fileType: file.type,
            file,
            path: getPath(file.webkitRelativePath)
        })
        return prev
    }, [])
    e.target.value = '' // 解决不能上传相同文件问题
    const treeData = createUploadRequest(state.doc, uploadFiles)
    // router.push(`/browse/upload?backPath=${props.backPath}`)
}
function getPath(path: string) {
    if(!path) return ''
    path='/'+path
    const pathNames = path.split('/')
    pathNames.pop()
    return pathNames.join('/')
}
function clickUploadFile (doc:any) {
    state.doc = doc
    fileUploaderRef.value.click()
}
function clickUploadFolder(doc:any) {
    state.doc = doc
    folderUploaderRef.value.click()
}
onMounted(() => {
    useEventListener(document, 'docActionUploadFile', (event: any) => clickUploadFile(event.detail))  
    useEventListener(document, 'docActionUploadFolder', (event: any) => clickUploadFolder(event.detail))  
})
</script>
<style lang="scss" scoped>
</style>
