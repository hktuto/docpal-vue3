<template>
    <el-badge :value="unreadCount" :hidden="unreadCount === 0" :max="99" is-dot  class="actionIcons">
        <SvgIcon src="/icons/notification.svg" @click="handleOpen"></SvgIcon>
    </el-badge>
    <NotificationDialog ref="NotificationDialogRef" :unreadCount="unreadCount" @unreadCountChange="handleUnreadCountChange"></NotificationDialog>
</template>

<script lang="ts" setup>
import { getUnreadNotificationNumberApi } from 'dp-api';
const unreadCount = ref(0);
const NotificationDialogRef = ref();
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
onMounted(() => {
    getUnreadCount();
})
</script>

<style lang="scss" scoped>
</style>