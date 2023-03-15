<template>
    <div class="dp-table-container">
        <div class="tableHeader">
            <div class="headerLeftExpand">
                <slot name="preSortButton"></slot>
            </div>
            <TableSortButton :columns="columns" sortKey="test"  @reorderColumn="reorderColumn"></TableSortButton>
        </div>
        <div class="dp-table-container--main">
            <el-table
                ref="tableRef"
                :data="tableData"
                :row-class-name="tableRowClassName"
                v-bind="_options"
                @selection-change="handleSelectionChange"
                @row-click="handleRowClick"
                @row-dblclick="handleRowDblclick"
                @cell-click="handleCellClick"
                @sort-change="handleSortChange"
                @expand-change="(row, expandedRows) => emit('expand-change', row, expandedRows)">
                <template v-for="(col, index) in columns__sub" :key="index">
                    <template v-if="!col.hide">
                        <!---复选框, 序号 (START)-->
                            <el-table-column
                                v-if="col.type === 'index' || col.type === 'selection' || col.type === 'expand'"
                                :index="indexMethod"
                                v-bind="col">
                                <!-- 当type等于expand时， 配置通过h函数渲染、txs语法或者插槽自定义内容 -->
                                <template #default="{ row, $index }">
                                    <!-- render函数 (START) : 使用内置的component组件可以支持h函数渲染和txs语法 -->
                                    <component v-if="col.render" :is="col.render" :row="row" :index="$index" />
                                    <!-- render函数 (END) -->
                                    <!-- 自定义slot (START) -->
                                    <slot v-else-if="col.slot" name="expand" :row="row" :index="$index"></slot>
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
        </div>
        <!-- 分页器 -->
        <div v-if="_options.showPagination" class="mt20">
            <el-pagination
                v-bind="_paginationConfig"
                @size-change="pageSizeChange"
                @current-change="currentPageChange" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import { onKeyUp, onKeyDown } from '@vueuse/core'
export type SortParams = {
    column: TableColumnCtx<T | any>,
    prop: string,
    order: Table.Order
}

const props = defineProps<{
    tableData: Array<object>, // table的数据
    columns: Table.Column[], // 每列的配置项
    options?: Table.Options
}>()
const tableRef = ref();

// 设置option默认值，如果传入自定义的配置则合并option配置项
const _options = computed<Table.Options>(() => {
    const option = {
        multiSelect: false,
        stripe: false,
        tooltipEffect: 'dark',
        showHeader: true,
        showPagination: false,
        height: '100%'
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
    row.rowIndex = rowIndex
    let rowName = ""
    const index = shiftSelectList.value.findIndex(c => c.rowIndex === row.rowIndex)
    if (index > -1) {
        rowName = "current-row "; // elementUI 默认高亮行的class类 不用再样式了^-^,也可通过css覆盖改变背景颜色
    }
    return rowName; //也可以再加上其他类名 如果有需求的话
}
const rowStyle = (row, rowIndex) => {
    
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
    const handleAction = (command: Table.Command, row: any, index: number) => {
        emit('command', command, row, index)
    }

    // 多选事件
    const handleSelectionChange = (val: any) => {
        shiftSelectList.value = val
        emit('selection-change', val)
    }
    // 当某一行被点击时会触发该事件
    const handleRowClick = (row: any, column: any, event: MouseEvent) => {
        if(_options.value.multiSelect) handleShift(row)
        emit('row-click', row, column, event)
    }
    const handleRowDblclick= (row: any, column: any, event: MouseEvent) => {
        emit('row-dblclick', row, column, event)
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

function reorderColumn (displayList) {
    columns__sub.value = deepCopy(displayList);
}
// #region module: sort
    let CtrlDown = false
    let shiftOrAltDown = false
    const shiftSelectList = ref([])
    function handleShift (row) {
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
// defineExpose({ element: tableRef })
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
    user-select: none;
    &--main {
        overflow: hidden;
        .el-table {
            height: 100%;
        }
    }
}

.tableHeader{
    width: 100%;
    display: grid;
    grid-template-columns: 1fr min-content;
    gap: var(--app-padding);
}
</style>
<style lang="scss">
.shiftSelect {
    background-color: red!important;
    td {
        background-color: red!important;
    }
}
</style>

