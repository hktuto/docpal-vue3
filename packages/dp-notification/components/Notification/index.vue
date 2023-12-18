<template>
    <el-badge :value="unreadCount" :hidden="unreadCount === 0" :max="99" is-dot  class="actionIcons">
        <SvgIcon src="/icons/notification.svg" @click="handleOpen"></SvgIcon>
    </el-badge>
    <NotificationDialog ref="NotificationDialogRef" :unreadCount="unreadCount" @unreadCountChange="handleUnreadCountChange"></NotificationDialog>
</template>

<script lang="ts" setup>
import { ElNotification } from 'element-plus'
import { getUnreadNotificationNumberApi } from 'dp-api';
const unreadCount = ref(0);
const notificationStore = ref()
const NotificationDialogRef = ref();
const { isLogin, token } = useUser();
const router = useRouter()
const Cookies = useCookie('messageToken')
const { uploadState }  = useUploadAIStore()
const userId:string = useUser().getUserId()
function handleOpen () {
    NotificationDialogRef.value.handleOpen()
}
async function getUnreadCount() {
    const res = await getUnreadNotificationNumberApi();
    unreadCount.value = res;
}
function handleUnreadCountChange (count:number) {
    if (count >= 0) unreadCount.value = count
    else getUnreadCount()
}
function messageChange(notiData) {
    getUnreadCount()
    NotificationDialogRef.value.initData()
    try {
        const messageJson = notiData.messageJson
        const content = JSON.parse(messageJson.content)
        switch (messageJson.functionPoint) {
            case 'Ai-analysis_UPLOAD_FOLDER':
                handleAiUpload(content)
                break;
            case 'Ai-analysis_REPLACE_FILE':
                handleReplaceFileWithAi(content)
                break;
            default:
                break;
        }
    } catch (error) {
        
    }
}
function handleAiUpload(content) {
    if(content.uploadId) {
        const noti = ElNotification({
            title: $t('ai.uploadcomplete'),
            message: $t('ai.uploadAndAIComplete'),
            type: 'success',
            duration: 0,
            onClick: () => {
                router.push(`/AIUpload/${content.uploadId}`)
                noti.close()
            }
        });
        const requetUpload = uploadState.value.uploadRequestList.find(item => item.uploadAiId === content.uploadId)
        if(requetUpload) requetUpload.aiFinish = true
    }
}
function handleReplaceFileWithAi(content) {
    if(content.idOrPath) {
        const noti = ElNotification({
            title: $t('ai.complete'),
            message: $t('ai.confirmAiMetadataExtractionViewDocument'),
            type: 'success',
            duration: 0,
            onClick: () => {
                openFileEdit(content.idOrPath, {
                    showInfo:true,
                    showHeaderAction:true
                })
                noti.close()
            }
        });
        const requetUpload = uploadState.value.uploadRequestList.find(item => item.uploadAiId === content.uploadId)
        if(requetUpload) requetUpload.aiFinish = true
    }
}
onMounted(() => {
    getUnreadCount();
})
watch( () => isLogin.value, (newValue) => {
    Cookies.value = token.value || ''
    if(newValue) {
        notificationStore.value = useNotification(userId, messageChange)
        // notificationStore.value.start()
    }
}, {
    immediate:true 
})
</script>

<style lang="scss" scoped>
</style>