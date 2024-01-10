<template>
    <client-only class="reorderButtom__container">
      <div class="sort-button" v-popover="popoverRef" 
        data-testid="table-sort-button">
        <SvgIcon src="/icons/orderColumn.svg" ></SvgIcon>
      </div>
      <el-popover ref="popoverRef" width="280" trigger="click">
        <div class="listContainer">
          <!-- preList -->
          <TableSortItem v-for="element in preList" :key="element.name" :element="element" />
          <draggable class="list-group"
                    :list="displayList"
                    itemKey="name"
                    group="people"
                    handle=".handle"
                    :animation="200"
                    :disabled="false"
                    ghostClass="ghost"
                    @change="handleSubmit">
            <template #item="{ element, index }">
              <div class="list-group-item" :data-testid="`table-sort-${element.label}`">
                <div v-if="!element.fixed"  class="handle">
                  <SvgIcon src="/icons/move-handle.svg" />
                </div>
                  <div class="label">
                    {{$t(element.label || element.type)}}
                  </div>
                  <div v-if="!element.canNotDelete" class="show">
                    <el-switch v-model="element.show" :disabled="element.defaultColumn" @change="handleSubmit"/>
                  </div>
                </div>
            </template>
          </draggable>
          <!-- postList -->
          <TableSortItem v-for="element in postList" :key="element.name" :element="element" />
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
import { UserSettingSaveApi, defaultTableSetting } from 'dp-api'
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
    sortKey: string,
    sortAll: boolean
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
const preList = computed(() => props.columns.filter(item => item.fixed && item.fixed === 'left'))
const showList = computed(() => [...preList.value, ...displayList.value.filter(item => item.show), ...postList.value] )
const postList = computed(() => props.columns.filter(item => item.fixed && item.fixed === 'right'))
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
  if(props.sortAll) {
    emit('reorderColumn', showList.value, false)
    return
  }
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
  if(props.sortKey) {
    try {
      originalColumns.value = tableColumnSetting.value[props.sortKey].columns;
    } catch (error) {
      originalColumns.value = props.columns
    }
    // normalize user preference

    // set displayList and hideList
    let userColumns = getDefaultColumns()
    if (userPreference.value.tableSettings[props.sortKey]) {
      userColumns = userPreference.value.tableSettings[props.sortKey]
    }
    if(props.sortAll) {
      displayList.value = props.columns.filter((item) => !item.fixed).map( (item,index) => {
        item.show = true
        return item
      })
    } else {
      displayList.value = props.columns.filter((item) => !item.fixed).map( (item,index) => {
        item.rowIndex = index;
        item.show = userColumns.includes(index)
        return item
      })
    }
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
.sort-button {
  position: absolute;
  top: 0%;
  right: 0;
  width: 30px;
  height: 30px;
  background-color: var(--color-grey-200);
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding: calc( var(--app-padding) / 3);
  border-radius: 0 0 0 100%;
  --icon-size: 16px;
  --icon-color: var(--color-grey-700);
  transform: scale(1);
  transition: transform .2s ease-in-out;
  transform-origin: top right;
  z-index: 2;
  &:hover {
    transform: scale(1.1);
  }
}
.list-group {
  max-height: 50vh;
  overflow: auto;
  position: relative;
  .list-group-item {
    display: grid;
    grid-template-columns: 20px 1fr 40px;
    grid-template-areas: 'handle label toggle';
    padding: calc(var(--app-padding)) calc(var(--app-padding) / 2) ;
    background: var(--color-grey-0000);
    align-items: center;
    &:hover {
      background: var(--color-grey-0000);
    }
    & + & {
      border-top: 1px solid var(--color-grey-150);
    }
    .handle{
      grid-area: handle;
    }
    .label{
      grid-area: label;
    }
    .show{
      grid-area: toggle;
      justify-self: end;
    }
  }
  // .list-group-item.sortable-chose {}
  .list-group-item.sortable-ghost {
    background: var(--hover-text-color);
  }
}
</style>


