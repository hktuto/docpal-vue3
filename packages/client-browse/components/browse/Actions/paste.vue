
<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import { Loading } from '@element-plus/icons-vue';
import { ElNotification, ElMessageBox } from 'element-plus'
import { copyDocumentApi, moveDocumentApi } from 'dp-api'

const emits = defineEmits(['success'])
const state = reactive({
    copyItem: {},
    action: ''
})
function copyItem(doc){
    state.copyItem = { idOrPath: doc.path, name: doc.name }
    state.action = 'copy'
}
function cutItem(doc){
    state.copyItem = { idOrPath: doc.path, name: doc.name }
    state.action = 'cut'
}
async function pasteItem(doc){
    const param = [ 
        { idOrPath: state.copyItem.path }, 
        {idOrPath: doc.path}
    ]
    const noti = ElNotification({
        title: $i18n.t('paste'),
        icon: Loading,
        dangerouslyUseHTMLString: true,
        message: `<div title="${state.copyItem.name}">${state.copyItem.name}</div>`,
        showClose: true,
        customClass: 'loading-notification',
        duration: 0,
        position: 'bottom-right'
    });
    try {
        if (state.action === 'copy')  await copyDocumentApi(param)
        else await moveDocumentApi(param)
    } catch (error) {}
    noti.close()
    emits('success', doc, state.action)
}
onMounted(() => {
    useEventListener(document, 'docActionCopy', (event) => copyItem(event.detail))  
    useEventListener(document, 'docActionCut', (event) => cutItem(event.detail))  
    useEventListener(document, 'docActionPaste', (event) => pasteItem(event.detail))  
})
</script>