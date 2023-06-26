<template>
    <NuxtLayout class="fit-height withPadding">
        <div class="pageContainer">
          <VirtualFolderAdminList />
        </div>
    </NuxtLayout>
</template>


<script lang="ts" setup>
// get all virtual folder
const { list } = useAdminVirtualFolder()
</script>

<style lang="scss" scoped>
.pageContainer{
  padding: calc(var(--app-padding) * 2 );
}
</style>
