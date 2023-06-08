<template>
    <client-only class="reorderButtom__container">
      <el-button type="primary" v-popover="popoverRef">{{ $t('tableHeader_orderColumn') }}</el-button>
      <el-popover ref="popoverRef" width="280">
        <div class="listContainer">
          <draggable class="list-group" 
                    :list="displayList" 
                    itemKey="name" 
                    group="people"
                    handle=".handle"
                    @change="handleSubmit">
            <template #item="{ element, index }">
              <div class="list-group-item">
                <div class="handle">
                  <SvgIcon src="/icons/move-handle.svg" />
                </div>
                  <div class="label">
                    {{$t(element.label || element.type)}}
                  </div>
                  <div class="show">
                    <el-switch v-model="element.show" @change="handleSubmit"/>
                  </div>
                </div>
            </template>
          </draggable>
          <hr />
          <el-button @click="handleRevert"> {{ $t('revert')}} </el-button>
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
    'reorderColumn', 
])

const popoverRef = ref(); 

const dialogShow = ref(false)
const displayList = ref([
])
const originalColumns = ref()
const showList = computed(() => displayList.value.filter(item => item.show))
const loading = ref(false)
// const hideList =ref([])

function handleCancle () {
  initColumn()
}
// 使用前端默认配置
function handleRevert () {
  const userColumns = getDefaultColumns()
  displayList.value = originalColumns.value.map( (item,index) => {
      item.rowIndex = index;
      item.show = userColumns.includes(index)
      return item
    })
  
  handleSubmit()
}
// 保存偏好设置
async function handleSubmit () {
  loading.value = true
  try {
    const param = { ...userPreference.value }
    if (!param.tableSettings) {
      param.tableSettings = {}
    }
    const displayOrder = displayList.value.reduce((prev,item,index) => {
      if(item.show){
        prev.push(item.rowIndex)
      }
      return prev},[])
    param.tableSettings[props.sortKey] = displayOrder
    await UserSettingSaveApi(param)
    await getUserSetting()
    emit('reorderColumn', showList.value, false)
  } catch (error) {
    
  }
  loading.value = false
}

function initColumn () {
  // check store default column setting
  if(props.sortKey && tableColumnSetting.value) {
    originalColumns.value = tableColumnSetting.value[props.sortKey].columns || props.columns;
    // normalize user preference
    
    // set displayList and hideList
    let userColumns = getDefaultColumns()
    if (userPreference.value.tableSettings[props.sortKey]) {
      userColumns = userPreference.value.tableSettings[props.sortKey]
    }

    displayList.value = originalColumns.value.map( (item,index) => {
      item.rowIndex = index;
      item.show = userColumns.includes(index)
      return item
    })
    // const hideList = []
    // displayList.value = []
    // originalColumns.value.forEach( (item,index) => {
    //   item.rowIndex = index;
    //   item.show = userColumns.includes(index)
    //   if(item.show) displayList.value.push(item)
    //   else hideList.push(item)
    // })
    // displayList.value.push(...hideList)
    emit('reorderColumn', showList.value, false)
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
})
defineExpose({ initColumn })
</script>



<style lang="scss" scoped>
.list-group {
  max-height: 50vh;
  overflow: auto;
  position: relative;
  .list-group-item {
    display: grid;
    grid-template-columns: min-content 1fr min-content;
    padding: calc(var(--app-padding)) calc(var(--app-padding) / 2) ;
    background: var(--color-grey-000);
    align-items: center;
    &:hover {
      background: var(--color-grey-0000);
    }
    & + & {
      border-top: 1px solid var(--color-grey-150);
    }
  }
  // .list-group-item.sortable-chose {}
  .list-group-item.sortable-ghost {
    background: var(--hover-text-color);
  }
}
</style>


