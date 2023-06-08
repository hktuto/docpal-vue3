
<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { useEventListener } from '@vueuse/core'
import { Loading } from '@element-plus/icons-vue';
import { ElNotification, ElMessageBox } from 'element-plus'
import { copyDocumentApi, moveDocumentApi } from 'dp-api'
const { t } = useI18n()
const emits = defineEmits(['success'])
const state = reactive({
    copyItem: {} as any,
    action: ''
})
function copyItem(doc){
    console.log("copyItem", doc)
    state.copyItem = { idOrPath: doc.path, name: doc.name }
    state.action = 'copy'
    ElMessage({
            message: doc.name + " " + t('tip_copy') as string,
            type: 'success'
        })
}
function cutItem(doc){
    state.copyItem = { idOrPath: doc.path, name: doc.name }
    state.action = 'cut'
    ElMessage({
            message: doc.name + " " + t('tip_cut') as string,
            type: 'success'
        })
}
async function pasteItem(doc){
    console.log("pasteItem", state)
    const param = [ 
        { idOrPath: state.copyItem.idOrPath }, 
        {idOrPath: doc.path}
    ]
    const { isDuplicate } = await duplicateNameFilter(doc.path, [state.copyItem]);
    if (isDuplicate) {
        ElMessage({
            message: t('dpTip_duplicateFileName') as string,
            type: 'error'
        })
        return
    }
    const noti = ElNotification({
        title: t('paste'),
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
    console.log("mounted")
    useEventListener(document, 'docActionCopy', (event:any) => copyItem(event.detail))  
    useEventListener(document, 'docActionCut', (event:any) => cutItem(event.detail))  
    useEventListener(document, 'docActionPaste', (event:any) => pasteItem(event.detail))  
})
</script>