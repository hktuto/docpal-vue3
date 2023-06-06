<template>
    <el-badge :value="unreadCount" :hidden="unreadCount === 0" :max="99" is-dot  class="actionIcons">
        <SvgIcon src="/icons/notification.svg" @click="handleOpen"></SvgIcon>
    </el-badge>
    <NotificationDialog ref="NotificationDialogRef" :unreadCount="unreadCount" @unreadCountChange="handleUnreadCountChange"></NotificationDialog>
</template>

<script lang="ts" setup>
import { getUnreadNotificationNumberApi } from 'dp-api';
const unreadCount = ref(0);
const notificationStore = ref()
const NotificationDialogRef = ref();
const { isLogin, token } = useUser();
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
function messageChange() {
    getUnreadCount()
    NotificationDialogRef.value.initData()
}
onMounted(() => {
    getUnreadCount();
})
watch( () => isLogin.value, (newValue) => {
    Cookies.value = token.value || ''
    if(newValue) {
        if(notificationStore && notificationStore.value){
            console.log("close last notification")
            
            
            notificationStore.value.close();
            notificationStore.value = useNotification(token.value, userId, messageChange)
            return;
        }
        notificationStore.value = useNotification(token.value, userId, messageChange)
    } else if(notificationStore  && notificationStore.value){
        console.log("user logout, close last notification")
        notificationStore.value.close();
            notificationStore.value = null;
        }
}, {
    immediate:true 
})
</script>

<style lang="scss" scoped>
</style>