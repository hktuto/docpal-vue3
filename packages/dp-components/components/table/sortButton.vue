<template>
    <client-only class="reorderButtom__container">
      <el-button type="primary" v-popover="popoverRef">{{ $t('tableHeader_orderColumn') }}</el-button>
      <el-popover ref="popoverRef">
        <div class="listContainer">
          <div v-for="item in " class="listItem">

          </div>
        </div>
      </el-popover>
      <!-- <el-dialog v-model="dialogShow" :title="$t('tableHeader_reorderColumn')" custom-class="reorder__dialog">
        <el-card class="box-card">
          <template #header> <span>{{$t('tableHeader_displayColumn')}}</span> </template>
          <draggable class="list-group" 
                    :list="displayList" 
                    itemKey="name" 
                    group="people"
                    @change="handelDragChange">
            <template #item="{ element, index }">
              <div class="list-group-item">{{index + 1}}.{{ $t(element.label || element.type) }}</div>
            </template>
          </draggable>
        </el-card>
        <el-card class="box-card">
          <template #header> <span>{{$t('tableHeader_hideColumn')}}</span> </template>
          <draggable class="list-group"
                      :list="hideList"
                      group="people"
                      @change="handelDragChange"
                      itemKey="name"
          >
            <template #item="{ element, index }">
              <div class="list-group-item">{{index + 1}}.{{ $t(element.label || element.type) }}</div>
            </template>
          </draggable>
        </el-card>
        <template #footer>
          <el-button @click="handleCancle"> {{ $t('cancelText')}} </el-button>
          <el-button @click="handleRevert"> {{ $t('revert')}} </el-button>
          <el-button type="primary" @click="handleSubmit()"> {{ $t('common_submit') }} </el-button>
        </template>
      </el-dialog> -->
    </client-only>
</template>
<script lang="ts" setup>
import { ref, toRefs } from 'vue'
import draggable from 'vuedraggable'
import { UserSettingSaveApi } from 'dp-api'
const { userPreference } = toRefs(useUser())
const { getUserSetting } = useUser()
const { tableColumnSetting } = toRefs(useSetting())
export type SortParams<T> = {
    column: TableColumnCtx<T | any>
    prop: string
    order: Table.Order
}
interface TableProps {
    columns: Table.Column[] // 每列的配置项
    sortKey: string
}
const props = defineProps<TableProps>()
const emit = defineEmits([
    'selection-change', // 当选择项发生变化时会触发该事件
    'row-click', // 当某一行被点击时会触发该事件
    'cell-click', // 当某个单元格被点击时会触发该事件
    'command', // 按钮组事件
    'size-change', // pageSize事件
    'current-change', // currentPage按钮组事件
    'pagination-change', // currentPage或者pageSize改变触发 
    'sort-change', // 列排序发生改变触发 
])

const popoverRef = ref(); 

const dialogShow = ref(false)
const displayList = ref([
  { label: "John", id: 1 },
  { label: "Joao", id: 2 },
  { label: "Jean", id: 3 },
  { label: "Gerard", id: 4 }
])

const loading = ref(false)
// const hideList =ref([])

function handleCancle () {
  initColumn()
}
// 使用前端默认配置
function handleRevert () {
  const userColumns = getDefaultColumns()
  const { display, hide } = originalColumns.value.reduce( (result, current, index) => {
    userColumns.includes(index) ? result.display.push(current) : result.hide.push(current)
    return result;
  }, {
    display:[],
    hide: []
  })
  displayList.value = display;
  hideList.value = hide;
  handleSubmit()
}
// 保存偏好设置
async function handleSubmit () {
  loading.value = true
  const param = { ...userPreference.value }
  if (!param.tableSettings) {
    param.tableSettings = {}
  }
  const displayOrder = displayList.value.reduce((prev,item,index) => {
    prev.push(item.rowIndex)
    return prev},[])
  param.tableSettings[props.sortKey] = displayOrder
  // param.tableSettings[props.sortKey] = JSON.stringify(param.tableSettings[props.sortKey])
  // param.tableSettings[props.sortKey].defaultDisplayList = [...props.tableColumn]
  // param.tableSettings[props.sortKey] = [...displayList.value],
  await UserSettingSaveApi(param)
  await getUserSetting()
  
  // displayList.value.forEach(item => { item.hide = false })
  emit('reorderColumn', displayList.value)
  loading.value = false
  dialogShow.value = false
}
const originalColumns = ref()
function initColumn () {
  // check store default column setting
  if(props.sortKey && tableColumnSetting) {
    originalColumns.value = tableColumnSetting[props.sortKey] || props.columns;
    // normalize user preference
    
    // set displayList and hideList
    let userColumns = getDefaultColumns()
    if (userPreference.value.tableSettings[props.sortKey]) {
      userColumns = userPreference.value.tableSettings[props.sortKey]
    }

    const { display, hide } = originalColumns.value.reduce( (result, current, index) => {
      current.rowIndex = index
      userColumns.includes(index) ? result.display.push(current) : result.hide.push(current)
      return result;
    }, {
      display:[],
      hide: []
    })

    displayList.value = display;
    
    hideList.value = hide;
  }
}

function getDefaultColumns () {
  return originalColumns.value.reduce((prev, item, index) => {
    if(!item.hide) prev.push(index)
    return prev
  }, [])
}

onMounted(() => {
  initColumn()
  emit('reorderColumn', displayList.value)
})
</script>



<style lang="scss" scoped>
.list-group {
  height: 30vh;
  padding-left: 10px;
  padding-right: 10px;
  overflow: auto;
  position: relative;
  .list-group-item {
    padding: calc(var(--app-padding));
    &:hover {
      background: var(--hover-text-color);
    }
  }
  // .list-group-item.sortable-chose {}
  .list-group-item.sortable-ghost {
    background: var(--hover-text-color);
  }
}
</style>
<style lang="scss">
.reorder__dialog {
  .el-dialog__body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: var(--app-padding);
    column-gap: var(--app-padding);
  }
}
</style>

