<template>
    <div class="userMiniControllerContainer">
        <ElDropdown>
         <UserThumbnail class="thumbnail" />
         <template #dropdown>
             <div class="dropItemContainer">
             <LogoutButton />
             </div>
         </template>
        </ElDropdown>
    </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.thumbnail{
    cursor: pointer;
}
.dropItemContainer{
    padding: var(--app-padding);
}
</style>