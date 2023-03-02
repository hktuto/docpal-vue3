<template>
    <NuxtLayout >
        <div class="mainContent">
            <div class="padding flex-x-between">
                {{route.params.id}}
                <div>
                    <el-button @click="handleOpenAdd">add column</el-button>
                    <el-button @click="handleSave">save</el-button>
                </div>
            </div>
            <main>
                <el-card v-for="(item,index) in tableColumns">
                    <template #header>
                        <div class="flex-x-between">
                            <span>column-{{index + 1}}</span>
                            <el-button v-if="!item.default" class="button" :icon="Delete" @click="handleDeleteColumn(item,index)"></el-button>
                        </div>
                    </template>
                    <TableColumnEdit :ref="(el) => tableColumnEditRefs[item.id] = el" :column="item"></TableColumnEdit>
                </el-card>
            </main>
        </div>
        <TableColumnAdd ref="tableColumnAddRef"
            @add="handleColumnAdd"></TableColumnAdd>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { Delete } from '@element-plus/icons-vue'
import { SaveTableColumnSetting } from 'dp-api'
const route = useRoute()
const { tableColumnSetting } = toRefs(useSetting())
const tableColumnEditRefs = ref({})
const tableColumnAddRef = ref()
const tableColumns = ref([])

function initTableColumns(id) {
    if(id === 'trash') {
        tableColumns.value = [
            { id: '1', label: 'tableHeader_name', prop: 'name' },
            { id: '2', label: 'tableHeader_path', prop: 'logicalPath' },
            { id: '3', label: 'tableHeader_type', prop: 'type' },
            { id: '4', label: 'trash_deleteBy', prop: 'properties.principalName' },
            { id: '5', label: 'trash_date', prop: "properties.trashed_date", type: 'date' }
        ]
    } else {
        tableColumns.value = tableColumnSetting.value[id]
    }
}
function handleSave () {
    const columns = []
    const columnIds = tableColumns.value.reduce((prev, item) => {
        prev.push(item.id)
        return prev
    },[])
    Object.keys(tableColumnEditRefs.value).forEach(key => {
        if(columnIds.includes(key)) columns.push(tableColumnEditRefs.value[key].getForm())
    })
    const setting = deepCopy(tableColumnSetting.value)
    setting[route.params.id] = columns
    SaveTableColumnSetting(setting)
}
function handleColumnAdd (column) {
    column.id = new Date().valueOf().toString()
    tableColumns.value.push(column)
}
function handleDeleteColumn (column,index) {
    tableColumns.value.splice(index, 1)
}
function handleOpenAdd () {
    tableColumnAddRef.value.handleOpen()
}
watch(
        () => route.params,
        async (newval) => {
            initTableColumns(newval.id)
        },
        { immediate: true }
    )
</script>

<style lang="scss" scoped>
.mainContent {
    padding: var(--app-padding);
    display: grid;
    grid-template-rows: min-content 1fr;
    height: 100%;

    main{
        overflow: auto;
        .el-card {
            margin: var(--app-padding);
        }
    }
}
.padding {
    padding: var(--app-padding)
}
</style>