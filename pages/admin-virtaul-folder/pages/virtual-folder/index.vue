<template>
    <NuxtLayout class="fit-height withPadding">
        <div class="pageContainer">
          <VirtualFolderAdminList >
            <template #header>
              <el-button type="primary" size="small" round style="--icon-color: #fff;--icon-size: 16px;" @click="$router.push('/virtual-folder/new')">
                <SvgIcon src="/icons/add.svg" />
              </el-button>
            </template>
          </VirtualFolderAdminList>
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
  height: 100%;
  position: relative;
}
</style>
