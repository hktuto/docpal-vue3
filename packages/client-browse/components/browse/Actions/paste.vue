
<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import { ElNotification, ElMessageBox } from 'element-plus'
import { copyDocumentApi, moveDocumentApi } from 'dp-api'

const emits = defineEmits(['success'])
const state = reactive({
    copyItem: {},
    action: ''
})
function copyItem(doc){
    state.copyItem = { idOrPath: doc.path }
    state.action = 'copy'
}
function cutItem(doc){
    state.copyItem = { idOrPath: doc.path }
    state.action = 'cut'
}
async function pasteItem(doc){
    const param = [ state.copyItem, {idOrPath: doc.path}]
    if (state.action === 'copy') {
        await copyDocumentApi(param)
    } else {
        // 删除Document
        await moveDocumentApi(param)
    }
    emits('success', doc.path)
}
onMounted(() => {
    useEventListener(document, 'docActionCopy', (event) => copyItem(event.detail))  
    useEventListener(document, 'docActionCut', (event) => cutItem(event.detail))  
    useEventListener(document, 'docActionPaste', (event) => pasteItem(event.detail))  
})
</script>