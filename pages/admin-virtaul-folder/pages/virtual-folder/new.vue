<template>
  <NuxtLayout class="fit-height withPadding" backPath="/virtual-folder">
    <div class="pageContainer">
      <VirtualFolderAdminForm  :isNew="true" :detail="newForm"  @success="createNewHandler"/>
    </div>
  </NuxtLayout>
</template>


<script lang="ts" setup>

import {VirtualFolderDetail} from "dp-api";

const newForm = ref<VirtualFolderDetail>({
  name: "",
  userList:[],
  groupList:[],
})
function createNewHandler() {

}



</script>

<style lang="scss" scoped>
.pageContainer{
  padding: calc( var(--app-padding) * 2);
  height: 100%;
  position: relative;

}
</style>
