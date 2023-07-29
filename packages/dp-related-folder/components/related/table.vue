<script lang="ts" setup>

const props = defineProps<{
    data: any
}>()
const router = useRouter()
function rowClick(row: any) {
  
  if(row.isFolder) {
    const ev = new CustomEvent('closeFilePreview');
    document.dispatchEvent(ev);
    router.push({
      path:'/browse',
      query:{
        path: row.path
      }
    })
    return 
  }
  const newEv = new CustomEvent('openFilePreview', {detail :{pathOrId: row.path, options:{showInfo:true,showHeaderAction:true}}});
  document.dispatchEvent(newEv);
  
}
</script>

<template>
    <div class="relateListContainer">
        <div class="title">
            {{ data.name }}
        </div>
        <div class="table">
            <el-table :data="data.children">
                <el-table-column :label="$t('table_name')">
                  <template #default="{row}">
                    <div class="nameColumn">
                      <BrowseItemIcon :type="row.isFolder ? 'folder' : 'file'" />
                      <div class="label">{{row.name}}</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column >
                    <template #default="{row}">
                        <SvgIcon src="/icons/edit.svg" @click="rowClick(row)"></SvgIcon>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.nameColumn{
  display: flex;
  flex-flow: row nowrap;
  gap: var(--app-padding);
}
</style>