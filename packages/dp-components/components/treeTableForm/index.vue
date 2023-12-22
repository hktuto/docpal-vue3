<template>
    <div class="dp-table-container">
        <div class="tableHeader">
            <div class="tableHeader-title">
                <slot name="title"></slot>
            </div>
            <div class="flex-x-center">
                <SvgIcon src="/icons/check.svg" 
                    style="--icon-bg-size: 24px; --icon-color: #fff;--icon-bg-color:var(--el-color-danger)"
                round :content="$t('checkData')"
                    @click="handleValid"></SvgIcon>
                <el-button type="primary" :icon="Plus" size="small" circle 
                            :disabled="_options.childLen === 1 || disabled"
                            @click="handleAdd()"/>
            </div>
        </div>
        <el-form ref="FormRef" class="table__content"
                :model="state.formData" :rules="state.formRule"
                label-position="top" @submit.native.prevent>
            <el-table
                ref="tableRef"
                :data="state.tableData"
                v-bind="_options"
                :header-cell-style="{'background': 'var(--color-grey-050)'}"
                @row-contextmenu="handleRightClick"
                @selection-change="handleSelectionChange"
                @row-click="handleRowClick"
                @row-dblclick="handleRowDblclick"
                @cell-click="handleCellClick"
                @expand-change="(row, expandedRows) => emit('expand-change', row, expandedRows)">
                <template v-for="(col, index) in columns" :key="index">
                    <template v-if="!col.hide">
                        <!---复选框, 序号 (START)-->
                            <el-table-column
                                v-if="col.type === 'index' || col.type === 'selection' || col.type === 'expand'"
                                v-bind="col"
                                :class-name="classComputed(col)"
                                :selectable="_options.selectable">
                                <!-- 当type等于expand时， 配置通过h函数渲染、txs语法或者插槽自定义内容 -->
                                <template #default="{ row, $index }">
                                    <!-- render函数 (START) : 使用内置的component组件可以支持h函数渲染和txs语法 -->
                                    <component v-if="col.render" :is="col.render" :row="row" :index="$index" />
                                    <!-- render函数 (END) -->
                                    <!-- 自定义slot (START) -->
                                    <slot v-else-if="col.slot" name="expand" :row="row" :index="$index"></slot>
                                    <!-- 自定义slot (END) -->
                                </template>
                                <template #header="{ row, $index }">
                                    <span>{{ $t(col.label) }}</span>
                                </template>
                            </el-table-column>
                        <!---复选框, 序号 (END)-->
                        <el-table-column v-else v-bind="col" :class-name="classComputed(col)" @command="handleAction">
                            <!-- 自定义列插槽 -->
                                <template #default="{ row, $index }">
                                    <el-form-item :prop="`${row.dpRowId}.${col.prop}`">
                                        <slot :name="col.slot" :row="row" :index="$index" >
                                            <el-input v-model="row[col.prop]" :disabled="disabled"></el-input>
                                        </slot>
                                    </el-form-item>
                                </template>
                                <template #header="{ row, $index }">
                                    <span>{{ $t(col.label) }}</span>
                                </template>
                            <!-- 自定义列插槽 -->
                        </el-table-column>
                    </template>
                </template>
                <el-table-column :label="$t('dpTable_actions')" :min-width="100" :width="100"  align="right">
                    <!-- <template slot="header" slot-scope="scope">
                        {{$t('dpTable_actions')}} -->
                        <!-- <CheckPopover ref="CheckPopover" :errData="errData" @click.native="handleValid"></CheckPopover> -->
                    <!-- </template> --> 
                    <!-- :disabled="(_options.childLen <= row[_options.treeProps.children].length) && _options.childLen !== 0" -->
                    <template #default="{ slotName, row, $index }">
                        <el-button 
                            v-show="_options.childDeep !== 0 && ((_options.childLen > 0 && _options.childLen > row[_options.treeProps.children].length) || !_options.childLen)"
                            type="primary" :icon="Plus" size="small" circle 
                            @click="handleAddChild(row, $index)"/>
                        <el-button type="danger" :icon="Minus" size="small" circle 
                            :disabled="$index === 0 && _options.childLen === 1 || disabled"
                            @click="handleDelete(row, $index)"/>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        <TreeTableFormValidDialog ref="TreeTableFormValidDialogRef"></TreeTableFormValidDialog>
    </div>
</template>
<script lang="ts" setup>
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'

import { Plus, Minus } from '@element-plus/icons-vue'
const props = defineProps<{
    tableData: Array<object>, // table的数据
    columns: Table.Column[], // 每列的配置项
    options?: Table.Options,
    treeTableFormRule?: object,
    disabled?: boolean
}>()
const tableRef = ref();

// 设置option默认值，如果传入自定义的配置则合并option配置项
const _options = computed<Table.Options>(() => {
    const option = {
        treeProps: {
            hasChildren: 'hasChildren',
            children: 'children',
        },
        childLen: 0,
        rowKey: 'dpRowId',
        multiSelect: false,
        stripe: false,
        tooltipEffect: 'dark',
        showHeader: true,
        showPagination: false,
        height: '100%',
        defaultExpandAll: false
    }
    return Object.assign(option, props?.options)
})
// 
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
    'expand-change',
    'delete-row'
])
const state = reactive({
    formData: {}, // 校验
    tableData: [], // 展示
    formRule: {},
    unitRow: {}
})
const FormRef = ref()
function classComputed(col) {
    const slot = col.slot ? `column_${col.slot}` : ''
    const prop = col.prop ? `column_${col.prop}` : ''
    return `${slot} ${prop}`
}
// #region Event Handling
    // 按钮组事件
    const handleAction = (command: Table.Command, row: any, index: number) => {
        emit('command', command, row, index)
    }

    // 多选事件
    const handleSelectionChange = (val: any) => {
        emit('selection-change', val)
    }
    // 当某一行被点击时会触发该事件
    const handleRowClick = (row: any, column: any, event: MouseEvent) => {
        emit('row-click', row, column, event)
    }
    const handleRowDblclick= (row: any, column: any, event: MouseEvent) => {
        emit('row-dblclick', row, column, event)
    }
    const handleRightClick = (row: any, column: any, event: MouseEvent) => {
        emit('row-contextmenu', row, column, event)
    }
    // 当某个单元格被点击时会触发该事件
    const handleCellClick = (row: any, column: any, cell: any, event: MouseEvent) => {
        emit('cell-click', row, column, cell, event)
    }
// #endregion
// #region module: form event
    async function getFormData () {
        const valid = await FormRef.value.validate((valid, fields) => {
            return valid
        })
        if (!valid) return false
        else return getPureTree(state.tableData)
    }
    function getPureTree (tableData) {
        const _tree = deepCopy(tableData)
        const result = <any>[]
        _tree.forEach(item => {
            const _item = { ...item }
            if (item[_options.value.treeProps.children] && item[_options.value.treeProps.children].length > 0) {
                _item[_options.value.treeProps.children] = getPureTree(item[_options.value.treeProps.children])
            } else {
                delete _item[_options.value.treeProps.children]
            }
            delete _item.dpRowId
            delete _item.dpRowParentId
            result.push(_item)
        })
        return result
    }
    async function getFlatData (idKey: string = 'id', parentKey: string = 'parentId') {
        const valid = await FormRef.value.validate((valid, fields) => {
            return valid
        })
        if (!valid) return false
        return Object.keys(state.formData).reduce((prev, key) => {
            const _item = deepCopy(state.formData[key])
            if (_item.dpRowParentId) {
                _item[parentKey] = state.formData[_item.dpRowParentId][idKey]
            }
            delete _item.dpRowId
            delete _item.dpRowParentId
            prev.push(_item)
            return prev
        }, [])
    }
    function getMeta () {
        state.unitRow = {}
        props.columns.forEach(item => { 
            state.unitRow[item.prop] = item.defaultValue === undefined ? '' : item.defaultValue
        })
        state.unitRow[_options.value.treeProps.children] = [] // 必须，否则不渲染
    }

    function getFormRule () {
        if(!props.treeTableFormRule) return
        const result = {}
        Object.keys(props.treeTableFormRule).forEach(key => {
            Object.keys(state.formData).forEach(mapKey => {
                result[`${mapKey}.${key}`] = props.treeTableFormRule[key]
            })
        })
        state.formRule = result
        setTimeout(() => {
            FormRef.value.clearValidate()
        })
    }
    function setTableData (tableData) {
        state.formData = {}
        handleId(tableData)
        state.tableData = deepCopy(tableData) 
        getFormRule()
    }
    function handleId (list, dpRowParentId ='') {
      list.forEach((item, index) => {
        item.dpRowId = dpRowParentId + '' + index + ''
        if (dpRowParentId) item.dpRowParentId = dpRowParentId
        state.formData[item.dpRowId] = item
        if (item[_options.value.treeProps.children]) handleId(item[_options.value.treeProps.children], item.dpRowId)
      })
    }
    function handleAdd () {
        if (Object.keys(state.unitRow).length === 0) getMeta()
        const row = deepCopy(state.unitRow)
        row.dpRowId = new Date().getTime()
        state.tableData.push(row)
        state.formData[row.dpRowId] = row
        getFormRule()
    }
    function handleAddChild(row, rowIndex) {
        if (Object.keys(state.unitRow).length === 0) getMeta()
        if (!row[_options.value.treeProps.children]) row[_options.value.treeProps.children] = []
        const newRow = deepCopy(state.unitRow)
        newRow.dpRowId = new Date().getTime()
        newRow.dpRowParentId = row.dpRowId
        row[_options.value.treeProps.children].push(newRow)
        state.formData[newRow.dpRowId] = newRow
        getFormRule()
    }
    function handleDelete(row) {
        let childList
        if(row.dpRowParentId) {
          childList = state.formData[row.dpRowParentId][_options.value.treeProps.children]
            console.log({childList});
            
        } else {
          childList = state.tableData
        }
        const index = childList.findIndex(item => item.dpRowId === row.dpRowId)
        childList.splice(index, 1)
        delete state.formData[row.dpRowId];
        getFormRule()
        emit('delete-row', row)
    }
// #endregion
function initTable(data) {
    const _tableData = data || props.tableData
    nextTick(() => {
        if (!_tableData || _tableData.length === 0) {
            state.tableData = []
            handleAdd()
        }
        else {
            setTableData(_tableData)
        }
    })
}
const TreeTableFormValidDialogRef = ref()
async function handleValid () {
    setTimeout(async () => {
        let errorData = {}
        await FormRef.value.validate((valid, fields) => {
            errorData = fields || []
        })
        TreeTableFormValidDialogRef.value.handleOpen(errorData)
    })
}
 
onMounted(() => {
    initTable()
})
// 暴露给父组件参数和方法，如果外部需要更多的参数或者方法，都可以从这里暴露出去。
defineExpose({ getFormData, getFlatData, initTable })
</script>
<style lang="scss" scoped>
.dp-table-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    .tableHeader{
        display: grid;
        grid-template-columns: 1fr min-content;
        gap: var(--app-padding);
        margin-bottom: 10px;
        align-items: center;
        &-title {
            line-height: var(--el-dialog-font-line-height);
            font-size: var(--el-dialog-title-font-size);
            color: var(--el-text-color-primary)
        }
        div:not(:first-child), button:not(:first-child) {
            margin-left: 1rem;
        }
    }
    .table__content{
        flex: 1;
        overflow: hidden;
        :deep(.el-table__cell .cell){
            display: flex;
            align-items: center;
            .el-form-item, .el-input {
                flex: 1
            }
        }
        :deep(.el-table__cell.is-right .cell){
            justify-content: end;
        }
        :deep(.el-table__cell.is-center .cell), 
        :deep(.el-table__cell.is-center .cell .el-form-item__content){
            justify-content: center;
        }
        :deep(.table__hide-expand) {
            .el-table__expand-icon {
                display: none
            }
            .el-table__placeholder {
                display: none
            }
        }
    }
    :deep(.el-form-item)  {
        margin-bottom: unset;
    }
}
</style>

