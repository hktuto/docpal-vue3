<template>
<Table
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

const state = reactive<State>({
    loading: false,
    // tableData: [],
    options: {
        // multiSelect: true,
        showPagination: false,
    },
    watermarkList: []
})
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
    console.log(state.watermarkList, 'watermarkList');
})
</script>

<style lang="scss" scoped>

</style>
