<template>
    <el-badge :value="unreadCount" :hidden="unreadCount === 0" is-dot  class="actionIcons">
        <SvgIcon src="/icons/notification.svg" @click="dialogOpened = true"></SvgIcon>
    </el-badge>
    <el-dialog v-model="dialogOpened" append-to-body>
        <NotificationTable />
    </el-dialog>
</template>

<script lang="ts" setup>
import { getUnreadNotificationNumberApi } from 'dp-api';
const unreadCount = ref(0);
const dialogOpened = ref(false);
async function getUnreadCount() {
    const {result} = await getUnreadNotificationNumberApi();
    unreadCount.value = result;
}
onMounted(() => {
    getUnreadCount();
})
</script>

<style lang="scss" scoped>
</style>