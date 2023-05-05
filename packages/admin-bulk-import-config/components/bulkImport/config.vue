<template>
<el-card v-loading="state.loading">
    <template #header>
        <div class="card-header">
            <span>{{$t('docType_captureProfile')}}</span>
            <el-button class="button" type="primary"
                @click="handleDialogShow()">{{$t('common_add')}}</el-button>
        </div>
    </template>
    <Table :columns="tableSetting.columns" :table-data="state._list"
        :options="{ rowKey: 'type' }"
        @row-dblclick="handleDialogShow"
        @command="handleAction">  
    </Table>
    <BulkImportConfigDialog :docType="state.docType" ref="BulkImportConfigDialogRef" @refresh="getTable"></BulkImportConfigDialog>
</el-card>
</template>


<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
    GetDocumentTypeProfileApi,
    SaveMetaValidationRuleApi,
    DeleteDocumentTypeProfileApi,
    TABLE, defaultTableSetting
} from 'dp-api'
const state = reactive({
    loading: false,
    list: [],
    _list: [],
})
const route = useRoute()
const router = useRouter()
const tableKey = TABLE.ADMIN_BULK_IMPORT_CONFIG
const tableSetting = defaultTableSetting[tableKey]

function handleAction (command:sting, row: any, rowIndex: number) {
    switch (command) {
        case 'delete':
            handleDelete(row)
            break
    }
}
async function handleDelete(row) {
    ElMessageBox.confirm(`${$i18n.t('msg_confirmWhetherToDelete')}`)
        .then(async() => {
            state.loading = true
            const res = await DeleteDocumentTypeProfileApi(row.profileID)
            await getTable()
            state.loading = false
        })
}
const BulkImportConfigDialogRef = ref()
function handleDialogShow(row) {
    const data = row ? deepCopy(row) : ''
    BulkImportConfigDialogRef.value.handleOpen(data)
}

async function getTable() {
    state.list = await GetDocumentTypeProfileApi({ documentType: route.params.id })
    state._list = state.list
    console.log(state._list, 'state._list');
    
}
onMounted(async() => {
    getTable()
})
</script>

<style lang="scss" scoped>
.el-card {
    display: grid;
    grid-template-rows: min-content 1fr;
    :deep(.el-card__body) {
        overflow: auto;
    }
    .card-header {
        display: flex;
        justify-content: space-between;
    }
}
</style>