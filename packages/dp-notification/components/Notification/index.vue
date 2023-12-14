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
    console.log(notiData, notiData.value,'button')
    getUnreadCount()
    NotificationDialogRef.value.initData()
    try {
        const messageJson = notiData.messageJson
        if(messageJson.functionPoint === 'Ai-analysis_UPLOAD_FOLDER') {
            handleAiUpload(JSON.parse(messageJson.content) )
        }
    } catch (error) {
        
    }
}
function handleAiUpload(content) {
    // const data = {"id":"1702545270562-136","targetRecipient":"private:docpal:administrator","messageJson":{"id":249344,"scope":"_private","realm":"docpal","functionPoint":"Ai-analysis_UPLOAD_FOLDER","content":"{\"filesCount\":1,\"uploadId\":\"e0fe9967-00e7-44fe-8721-48ba18c56b7e\",\"templateId\":\"notification.ai.analysis.upload.folder\",\"upload status\":\"SUCCESS\"}","receiveId":"administrator","status":"CREATE","createdBy":"administrator","modifiedBy":"administrator","createdDate":1702545270540,"modifiedDate":1702545270540,"sortBy":null}}
    // content = JSON.parse(data.messageJson.content) 
    if(content.uploadId) {
        ElNotification({
            title: $t('ai.uploadcomplete'),
            message: $t('ai.uploadAndAIComplete'),
            type: 'success',
            duration: 2000,
            onClick: () => {
                router.push(`/AIUpload/${content.uploadId}`)
            }
        });
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