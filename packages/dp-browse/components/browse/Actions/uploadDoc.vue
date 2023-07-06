<template>
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
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { useEventListener } from '@vueuse/core'
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
const { setUploadFiles } = useUploadStore()
const fileUploaderRef = ref(null)
const folderUploaderRef = ref(null)

function uploadHandler (e) {
    const files = Array.from(e.target.files) 
    const result = files.reduce((prev, file, index) => {
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
    setUploadFiles(result, state.doc, props.backPath)
    router.push(`/browse/upload?backPath=${props.backPath}`)
}
function getPath(path: string) {
    if(!path) return ''
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
    useEventListener(document, 'docActionUploadFile', (event) => clickUploadFile(event.detail))  
    useEventListener(document, 'docActionUploadFolder', (event) => clickUploadFolder(event.detail))  
})
</script>
<style lang="scss" scoped>
</style>
