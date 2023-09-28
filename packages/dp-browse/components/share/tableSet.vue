<template>
<Table
    ref="tableRef"
    v-loading="state.loading"
    :columns="tableSetting.columns"
    :table-data="tableData"
    :options="state.options"
        @command="handleAction"
        @row-dblclick="handleDblclick">
        <template #watermark="{ row, index }">
            <el-select v-if="row.mimeType && getUseWatermark(row.mimeType)" v-model="row.watermark" filterable default-first-option clearable >
                <el-option v-for="item in state.watermarkList" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
        </template>
        <template #readOnly="{ row, index }">
            <el-switch v-model="row.readOnly"  active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
</Table>
</template>


<script lang="tsx" setup>
import { getWatermarkTemplates, TABLE, defaultTableSetting } from 'dp-api'
const props = defineProps<{
    tableData: any
}>();
const emit = defineEmits([
    'update:tableData',
    'db-click',
    'delete'
])
const route = useRoute()
const router = useRouter()
const { allowFeature } = useLayout()
const state = reactive<State>({
    loading: false,
    // tableData: [],
    options: {
        // multiSelect: true,
        showPagination: false,
    },
    watermarkList: []
})
const tableRef = ref()
const tableKey = TABLE.CLIENT_SHARE_SET
const tableSetting = defaultTableSetting[tableKey]
function getUseWatermark(mimeType :string) {
    // check mintype is image, pdf or video
    if (mimeType.includes('image') || mimeType.includes('pdf') || mimeType.includes('video')) {
        return true
    }
    return false
}
function handleAction (command:string, row: any, rowIndex: number) {
    switch (command) {
        case 'delete':
            emit('delete', row)
            break
    }
}
// #endregion

function handleDblclick (row:any) {
    emit('db-click', row)
}
onMounted(async() => {
    state.watermarkList = await getWatermarkTemplates() 
    if(!allowFeature('WATERMARK')) {
        const index = tableSetting.columns.findIndex(item => item.id === 'watermark')
        if(index === -1) return
        tableSetting.columns.splice(index, 1)
        nextTick(() => {
            tableRef.value.reorderColumn(tableSetting.columns)
        })
    }
})
</script>

<style lang="scss" scoped>

</style>
