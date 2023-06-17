<template>
    <div class="userMiniControllerContainer">
        <ElDropdown>
         <UserThumbnail class="thumbnail" />
         <template #dropdown>

           <div v-if="feature.multiLanguage" class="dropItemContainer">
            <LanguageSwitch />
           </div>
             <div class="dropItemContainer">
              <LogoutButton />
             </div>
         </template>
        </ElDropdown>
    </div>
</template>

<script lang="ts" setup>
const { feature } = useAppConfig();
</script>

<style lang="scss" scoped>
.thumbnail{
    cursor: pointer;
}
.dropItemContainer{
    padding: var(--app-padding);
}
</style>
