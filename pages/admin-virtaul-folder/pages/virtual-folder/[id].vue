<template>
  <NuxtLayout class="fit-height withPadding" backPath="/virtual-folder">
    <div class="pageContainer">
      <VirtualFolderAdminForm v-if="detail" :isNew="!route.params.id" :detail="detail" />
    </div>
  </NuxtLayout>
</template>


<script lang="ts" setup>
import {getVirtualFolderDetail} from 'dp-api'
const route = useRoute()
const detail = ref<any>();
async function getDetail(id:string) {
  detail.value = await getVirtualFolderDetail(id);
}

watch(route, ()=> {
  if(route.params.id){
    getDetail(route.params.id as string)
  }
},{
  immediate: true
})
</script>

<style lang="scss" scoped>
.pageContainer{
  padding: calc( var(--app-padding) * 2);
  height: 100%;
  position: relative;
}
</style>
