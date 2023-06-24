

<template>
    <div class="formContainer">
      <template v-if="detail?.setting" >
        <div class="header">
                <div class="itemLabel">
                    <el-input v-model="detail.name" placeholder="Virtual folder label" size="large" />
                </div>
                <div class="actionsContainer">
                    <el-button type="primary"  @click="save">save</el-button>
                </div>
            </div>
        <div class="formItemContainer">
          <VirtualFolderAdminFormItem :item="detail.setting" />
        </div>
      </template>
      <div v-else class="firstLevelCreator">
        <virtual-folder-admin-new-item :isRoot="true" />
      </div>
    </div>

</template>


<script lang="ts" setup>
import { VirtualFolderDetail } from "dp-api"
const props = defineProps<{
    isNew: boolean
    detail?: VirtualFolderDetail
}>()


async function save(){

}
</script>
<style lang="scss" scoped>
.header{
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--color-grey-200);
    padding-block: var(--app-padding);
}
.formContainer{
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-rows: min-content 1fr;
  gap: var(--app-padding);
  
}
.formItemContainer{
  height: 100%;
  overflow: auto;
  display: flex;
  flex-flow: row nowrap;
}
.firstLevelCreator{
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  padding: var(--app-padding);
  display: grid;
  place-items: center;
}
</style>