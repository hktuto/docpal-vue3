<script setup lang="ts">
import {defaultTableSetting, TABLE} from "dp-api";

const { list, removeItem } = useAdminVirtualFolder()
const filterText = ref("");
const tableKey = TABLE.ADMIN_VIRTUAL
const tableSetting = defaultTableSetting[tableKey]
const props = defineProps<{ currentItem?:object }>()
const router = useRouter()

const filterList = computed(() => list.value.filter((item:any) => filterText.value ? item.name.includes(filterText.value) : true))
function handleSelect(item:any){
  handleEdit(item.id)
}
function handleEdit(id:string){
  router.push({
    path:`/virtual-folder/${id}`
  })
}
async function handleDelete(id:string){
  await removeItem(id)
  
}

</script>

<template>
  <div class="listContainer">
    <div class="foldersContainer">
      <div class="actionsRow">
        
        <div class="filter">
          <el-input v-model="filterText" :placeholder="$t('common_filter')"/>
        </div>
        <el-button type="primary" size="small" round style="--icon-color: #fff;--icon-size: 16px;">
          <SvgIcon src="/icons/add.svg" />
        </el-button>
      </div>
      <Table
          :columns="tableSetting.columns"
          :table-data="filterList"
          @row-dblclick="handleSelect"
      >
        <template #actions="{row, index}">
          <div>
            <el-button  type="primary" @click="handleEdit(row.id)" size="small" round>
              <SvgIcon src="/icons/edit.svg" style="--icon-color:#fff;--icon-size: 16px"/>
            </el-button>
            <el-popconfirm @confirm="handleDelete(row.id)">
              <template #reference>
              <el-button  type="danger"  size="small" round>
                <SvgIcon src="/icons/delete.svg" style="--icon-color:#fff;--icon-size: 16px"/>
              </el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
        <template #users="{ row, index }">
          <div v-if="row.userList">
            <el-tag v-for="item in row.userList" :key="item">{{item}}</el-tag>
          </div>
        </template>
        <template #groups="{ row, index }">
          <div v-if="row.groupList">
            <el-tag v-for="item in row.groupList" :key="item">{{item}}</el-tag>
          </div>
        </template>
        
      </Table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.actionsRow{
  display: grid;
  grid-template-columns: 1fr min-content;
  gap: var(--app-padding);
  justify-content: flex-start;
  align-content: center;
  margin-bottom: var(--app-padding);
}
</style>