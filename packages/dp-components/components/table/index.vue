<template>
    <div class="dp-table-container">
        <div :class="['tableHeader', headerClass]">
            <div class="headerLeftExpand">
                <slot name="preSortButton"></slot>
            </div>
            <slot name="suffixSortButton">
            </slot>
        </div>
        <div class="dp-table-container--main">
          <template v-if="!isSmallMobile">
            <el-table
                ref="tableRef"
                :data="tableData"
                :row-class-name="tableRowClassName"
                v-bind="_options"
                :header-cell-style="{'background': 'var(--color-grey-050)'}"
                @row-contextmenu="handleRightClick"
                @selection-change="handleSelectionChange"
                @row-click="handleRowClick"
                @row-dblclick="handleRowDblclick"
                @cell-click="handleCellClick"
                @sort-change="handleSortChange"
                @header-dragend="handleHeaderDragEnd"
                @expand-change="(row, expandedRows) => emit('expand-change', row, expandedRows)">
                <template v-for="(col, index) in columns__sub" :key="index">
                    <template v-if="!col.hide">
                        <!---复选框, 序号 (START)-->
                            <el-table-column
                                v-if="col.type === 'index' || col.type === 'selection' || col.type === 'expand'"
                                :index="indexMethod"
                                v-bind="col"
                                :selectable="_options.selectable">
                                <!-- 当type等于expand时， 配置通过h函数渲染、txs语法或者插槽自定义内容 -->
                                <template #default="slotData">
                                    <!-- render函数 (START) : 使用内置的component组件可以支持h函数渲染和txs语法 -->
                                    <component v-if="col.render" :is="col.render" :row="slotData.row" :index="slotData.$index" />
                                    <!-- render函数 (END) -->
                                    <!-- 自定义slot (START) -->
                                    <slot v-else-if="col.slot" name="expand" :row="slotData.row" :index="slotData.$index"></slot>
                                    <!-- 自定义slot (END) -->
                                </template>
                            </el-table-column>
                        <!---复选框, 序号 (END)-->
                        <TableColumn v-else :col="col" @command="handleAction">
                             <!-- 自定义表头插槽 -->
                                <template #customHeader="{ slotName, column, index }">
                                    <slot :name="slotName" :column="column" :index="index" />
                                </template>
                             <!-- 自定义表头插槽 -->
                            <!-- 自定义列插槽 -->
                                <template #default="{ slotName, row, index }">
                                    <slot :name="slotName" :row="row" :index="index" />
                                </template>
                            <!-- 自定义列插槽 -->
                        </TableColumn>
                    </template>
                </template>
            </el-table>
          </template>
          <template v-else>
            <div v-if="_options.sortKey" class="cardSortContainer">
              <TableSortButton ref="TableSortButtonRef" :sortKey="_options.sortKey" :columns="columns" @reorderColumn="reorderColumn"></TableSortButton>
            </div>
            <div ref="tableCardRef" class="cardList">
              <div v-if="tableData.length === 0" class="noData">
                {{ $t('noData')}}
              </div>
             <TableCard
                v-for="(item, rowIndex) in tableData"
                :key="'card_'+ rowIndex"
                :row="item"
                :column="columns__sub"
                @row-contextmenu="handleRightClick"
                @selection-change="handleSelectionChange"
                @row-click="handleRowClick"
                @row-dblclick="handleRowDblclick"
                @cell-click="handleCellClick"
                @sort-change="handleSortChange"
              >
                <template v-for="(col, index) in columns__sub" :key="index">
                  <template v-if="!col.hide">
                    <template v-if="col.type === 'index' || col.type === 'selection' || col.type === 'expand'" >
                      <input
                        type="checkbox"

                        @change="(val) => cardSelectedChange(rowIndex, val)"
                      />
                    </template>
                    <TableCardItem v-else :col="col" :rowData="item" :rowIndex="index" :class="col.class" @command="handleAction">
                      <template #customHeader="{ slotName, column, index }">
                        <slot :name="slotName" :column="column" :index="index" />
                      </template>
                      <!-- 自定义表头插槽 -->
                      <!-- 自定义列插槽 -->
                      <template #default="{ slotName, row, index }">
                        <slot :name="slotName" :row="row" :index="index" />
                      </template>
                    </TableCardItem>
                  </template>
                </template>
              </TableCard>
            </div>
          </template>
            <TableSortButton v-if="_options.sortKey" ref="TableSortButtonRef" :sortKey="_options.sortKey" :sortAll="_options.sortAll" :columns="columns" @reorderColumn="reorderColumn"></TableSortButton>

        </div>
        <!-- 分页器 -->
        <div v-if="_options.showPagination" class="mt20">
            <slot name="actions"><div></div></slot>
            <el-pagination v-if="_paginationConfig.total > 0"
                v-bind="_paginationConfig"
                @size-change="pageSizeChange"
                @current-change="currentPageChange" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import { onKeyUp, onKeyDown } from '@vueuse/core'
const { isSmallMobile, isMobile } = useLayout()
export type SortParams = {
    column: TableColumnCtx<T | any>,
    prop: string,
    order: Table.Order
}

const props = defineProps<{
    tableData: Array<object>, // table的数据
    columns: Table.Column[], // 每列的配置项
    options?: Table.Options,
    headerClass?: string
}>()
const tableRef = ref();
const tableCardRef = ref();

const clickTimeoutId = ref<NodeJS.Timeout>();
const selectChangeTimeoutId = ref<NodeJS.Timeout>();
// 设置option默认值，如果传入自定义的配置则合并option配置项
const _options = computed<Table.Options>(() => {
    const option = {
        multiSelect: false,
        stripe: false,
        tooltipEffect: 'dark',
        showHeader: true,
        showPagination: false,
        height: '100%',
        scrollbarAlwaysOn: true,
        sortAll: false,
        border: false
    }
    return Object.assign(option, props?.options)
})
// 合并分页配置
const _paginationConfig = computed(() => {
    return {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 40, 50, 100],
        layout: 'total, sizes, prev, pager, next, jumper',
        ..._options.value.paginationConfig
    }
})
const emit = defineEmits([
    'selection-change', // 当选择项发生变化时会触发该事件
    'row-click', // 当某一行被点击时会触发该事件
    'row-dblclick', // 当某一行被双击时会触发该事件
    'row-contextmenu',
    'cell-click', // 当某个单元格被点击时会触发该事件
    'command', // 按钮组事件
    'size-change', // pageSize事件
    'current-change', // currentPage按钮组事件
    'pagination-change', // currentPage或者pageSize改变触发
    'sort-change', // 列排序发生改变触发
    'expand-change'
])
const columns__sub = ref(deepCopy(props.columns))

// 自定义索引
const tableRowClassName = ({ row, rowIndex }) => {
    // if (!row || !row.rowIndex) return
    row.rowIndex = rowIndex
    let rowName = ""
    const index = shiftSelectList.value.findIndex(c => c.rowIndex === row.rowIndex)
    if (index > -1) {
        rowName = "current-row "; // elementUI 默认高亮行的class类 不用再样式了^-^,也可通过css覆盖改变背景颜色
    }
    return rowName; //也可以再加上其他类名 如果有需求的话
}
const rowStyle = (row:any, rowIndex:any) => {

}
const indexMethod = (index: number) => {
        const tabIndex = index + (_paginationConfig.value.currentPage - 1) * _paginationConfig.value.pageSize + 1
        return tabIndex
    }
// #region Event Handling
    // 切换pageSize
    const pageSizeChange = (pageSize: number) => {
        emit('size-change', pageSize)
        emit('pagination-change', 1, pageSize)
    }
    // 切换currentPage
    const currentPageChange = (currentPage: number) => {
        emit('current-change', currentPage)
        emit('pagination-change', currentPage, _paginationConfig.value.pageSize)
    }
    // 按钮组事件
    const handleAction = (command: Table.Command, row: any, index: number, evt: Event) => {
        emit('command', command, row, index, evt)
    }

    // 多选事件
    const handleSelectionChange = (val: any) => {
        clearTimeout(selectChangeTimeoutId.value);
        selectChangeTimeoutId.value = setTimeout(() => {
            shiftSelectList.value = val
            emit('selection-change', val)
        }, 200);
    }
    
    const cardSelection = ref<number[]>([]);
      const cardSelectedChange = (index:any, ev:any) => {
        const val = ev.target.checked as boolean;
        if(val) {
          cardSelection.value.push(index)
        }else{
          // find index from cardSelection
          const e = cardSelection.value.findIndex( it => it === index);
          cardSelection.value.splice(e, 1);
        }
        const selectedItem = cardSelection.value.map( i => props.tableData[i]);
        emit('selection-change', selectedItem)
    }

    watch(props.tableData, () => {
      // clean card data
      cardSelection.value = []
    })
    // 当某一行被点击时会触发该事件
    const handleRowClick = (row: any, column: any, event: MouseEvent) => {
        if(isMobile.value) {
          emit('row-dblclick', row, column, event)
          return ;
        }
        clearTimeout(clickTimeoutId.value);
        clickTimeoutId.value = setTimeout(() => {
            if(_options.value.multiSelect) handleShift(row)
            emit('row-click', row, column, event)
        }, 200);

    }
    const handleRowDblclick= (row: any, column: any, event: MouseEvent) => {
        // clean click adn selectChange timeout
        clearTimeout(clickTimeoutId.value);
        clearTimeout(selectChangeTimeoutId.value);
        console.log("db click")
        emit('row-dblclick', row, column, event)
    }
    const handleRightClick = (row: any, column: any, event: MouseEvent) => {
        emit('row-contextmenu', row, column, event)
    }
    // 当某个单元格被点击时会触发该事件
    const handleCellClick = (row: any, column: any, cell: any, event: MouseEvent) => {
        emit('cell-click', row, column, cell, event)
    }
    /**
        *  当表格的排序条件发生变化的时候会触发该事件
        * 在列中设置 sortable 属性即可实现以该列为基准的排序， 接受一个 Boolean，默认为 false。
        * 可以通过 Table 的 default-sort 属性设置默认的排序列和排序顺序。
        * 如果需要后端排序，需将 sortable 设置为 custom，同时在 Table 上监听 sort-change 事件，
        * 在事件回调中可以获取当前排序的字段名和排序顺序，从而向接口请求排序后的表格数据。
        */
    const handleSortChange = ({ column, prop, order }: SortParams<any>) => {
        emit('sort-change', { column, prop, order })
    }
// #endregion
const TableSortButtonRef = ref()
function reorderColumn (displayList, initColumn: boolean = true) {
    columns__sub.value = deepCopy(displayList);
    if(initColumn) {
        setTimeout(() => {
            TableSortButtonRef.value.initColumn()
        })
    }
}
// #region module: sort
    let CtrlDown = false
    let shiftOrAltDown = false
    const shiftSelectList = ref([])
    function handleShift (row) {
        console.log("handleShift", CtrlDown, shiftOrAltDown)
        if (_options.value.selectable && !_options.value.selectable(row)) return
        let refsElTable = tableRef.value
        if(CtrlDown) {
            refsElTable.toggleRowSelection(row); // ctrl多选 如果点击两次同样会取消选中
            return;
        }
        if ( shiftOrAltDown && shiftSelectList.value.length > 0) {
            let topAndBottom = getTopAndBottom(row, bottomSelectionRow.value, topSelectionRow.value );
            const dataObj = refsElTable.data.reduce((prev:any, item:any) => {
                prev[`${item.rowIndex}`] = item
                return prev
            }, {})
            refsElTable.clearSelection(); //先清空 不然会导致在这两行中间之外的行状态不变
            for (let index = topAndBottom.top; index <= topAndBottom.bottom; index++) { //选中两行之间的所有行
                refsElTable.toggleRowSelection(dataObj[index], true);
            }
         } else {
            let findRow = shiftSelectList.value.find(c => c.rowIndex == row.rowIndex); //找出当前选中行
            console.log("findRow", shiftSelectList.value, findRow)
            //如果只有一行且点击的也是这一行则取消选择 否则清空再选中当前点击行
            if (findRow&& shiftSelectList.value.length === 1 ) {
                refsElTable.toggleRowSelection(row, false);
                return;
            }
            refsElTable.clearSelection();
            refsElTable.toggleRowSelection(row);
        }
    }
    const bottomSelectionRow = computed(() => {
        if (shiftSelectList.value.length == 0) return null;
        return shiftSelectList.value.reduce((start, end) => {
            return start.rowIndex > end.rowIndex ? start : end;
        });
    })
    const topSelectionRow = computed(() => {
        if (shiftSelectList.value.length == 0) return null;
        return shiftSelectList.value.reduce((start, end) => {
            return start.rowIndex < end.rowIndex ? start : end;
        });
    })
    /**获取最新最上最下行 */
    function getTopAndBottom(row, bottom, top) {
        let n = row.rowIndex,
            mx = bottom.rowIndex,
            mi = top.rowIndex;
        if (n > mx) {
            return {
                top: mi,
                bottom: n
            };
        } else if (n < mx && n > mi) {
            return {
                top: mi,
                bottom: n
            };
        } else if (n < mi) {
            return {
                top: n,
                bottom: mx
            };
        } else if (n == mi || n == mx) {
            return {
                top: mi,
                bottom: mx
            };
        }
    };
// #endregion
function toggleSelection (rows?: any[]) {
    if (rows) {
        rows.forEach((row) => {
            // TODO: improvement typing when refactor table
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            tableRef.value!.toggleRowSelection(row, undefined)
        })
    } else {
        tableRef.value!.clearSelection()
    }
}
function handleHeaderDragEnd(newWidth, oldWidth, column, event) {
    console.log(newWidth, oldWidth, column, event);
}
onMounted(() => {
    onKeyDown('Control', (e) => {
      CtrlDown = true
    })
    onKeyUp('Control', (e) => {
      CtrlDown = false
    })
    onKeyDown('Shift', (e) => {
      shiftOrAltDown = true
    })
    onKeyUp('Shift', (e) => {
      // e.preventDefault();
      shiftOrAltDown = false
    })
})
// 暴露给父组件参数和方法，如果外部需要更多的参数或者方法，都可以从这里暴露出去。
defineExpose({ reorderColumn, toggleSelection, tableRef })
</script>
<style lang="scss" scoped>
:deep(.el-image__inner) {
  transition: all 0.3s;
    cursor: pointer;
    &:hover {
      transform: scale(1.2);
    }
}
.dp-table-container {
    display: grid;
    grid-template-rows: min-content 1fr min-content;
    height: 99%;
    overflow: hidden;
    user-select: none;
    &--main {
        position: relative;
        overflow: hidden;
        .el-table {
            height: 100%;
        }
    }
    .mt20 {
        margin-top: var(--app-padding);
        display: grid;
        grid-template-columns: 1fr min-content;
        align-items: center;
    }
}

.tableHeader{
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: flex-end;
    gap: var(--app-padding);
    .headerLeftExpand {
        overflow: hidden;
        display: flex;
        align-items: center;
    }
    &>:deep(.el-button)  {
        margin-bottom: 10px;
    }
}
.cardSortContainer{
  width: 100%;
  margin-bottom: 32px;
  z-index: 2;
  position: relative;
}
.noData{
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}
</style>
<style lang="scss">
.shiftSelect {
    background-color: red!important;
    td {
        background-color: red!important;
    }
}
.dp-table-container--main {
    .el-popper {
        max-width: 80%;
        line-height: 1.5rem;
    }
  @media( max-width: 640px) {
    display: flex;
    flex-flow: column nowrap;

  }
}
.cardList{
  height: 100%;
  overflow: auto;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: var(--app-padding);
  padding-inline: 4px;
}
@media (max-width : 640px) {
  .el-pagination__total, .el-pagination__sizes, .el-pagination__jump {
    display: none;
  }
}

.table-responsive-header {
    display: grid!important;
    grid-template-columns: 1fr min-content;
    margin-bottom: var(--app-padding);
    .headerLeftExpand {
        display: grid;
        grid-template-columns: 200px 1fr;
        align-items: flex-end!important;
    }
    .suffixSortButton {
        display: flex;
    }
}
@media (max-width : 1024px) {
    .table-responsive-header {
        width: 100%;
        grid-template-columns: 1fr;
        .headerLeftExpand {
            gap: var(--app-padding);
            grid-template-columns: unset;
        }
    }
}
</style>
<style lang="scss">
.dp-table-container .el-table__row {
    color: var(--color-grey-900);
}
.dp-table-container .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    background-color: var(--color-grey-050);
}
.dp-table-container .el-table--border .el-table__cell {
    border-right: transparent;
}
</style>
