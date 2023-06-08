<template>
<el-card>
    <template #header>
        <div class="card-header">
            <span>{{$t('docType_metaMapping')}}</span>
            <el-button class="button" type="primary"
                @click="handleDialogShow()">{{$t('common_add')}}</el-button>
        </div>
    </template>
    <Table :columns="tableSetting.columns" :table-data="state._list"
        @row-dblclick="handleDblclick"
        @command="handleAction">
        <template #isRequire="{ row }">
            <el-icon v-if="row.isRequire" style="--color: var(--primary-color)"><Select /></el-icon>
            <el-icon v-else style="--color: #F56C6C"><CloseBold /></el-icon>
        </template>    
        <template #display="{ row }">
            <el-switch v-model="row.display" :loading="row.loading"
                @click.native.stop
                @change="handleDisplayChange(row)"></el-switch>    
        </template>    
    </Table>
    <BulkImportMetaMappingDialog ref="BulkImportMetaMappingDialogRef" :metaMapping="state.metaMapping" @refresh="getTable"></BulkImportMetaMappingDialog>
</el-card>
</template>


<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Select, CloseBold } from '@element-plus/icons-vue'
import { 
    GetMetaMappingApi,
    SaveMetadataMappingApi,
    TABLE, defaultTableSetting, deepCopy
} from 'dp-api'
const state = reactive({
    list: [],
    _list: [],
    metaMapping: {}
})
const route = useRoute()
const tableKey = TABLE.ADMIN_BULK_IMPORT_META
const tableSetting = defaultTableSetting[tableKey]
function handleDblclick (row) {
    handleDialogShow(row)
}
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
            const _metaMapping = {
                name: state.metaMapping.name,
                metaDataMapper: { ...state.metaMapping.metaDataMapper }
            }
            delete _metaMapping.metaDataMapper[row.metaData]
            const res = await SaveMetadataMappingApi({
                documentType: [_metaMapping]
            })
            getTable()
        })
    
}
const BulkImportMetaMappingDialogRef = ref()
function handleDialogShow(data) {
    BulkImportMetaMappingDialogRef.value.handleOpen(state.list, data)
}

async function getTable() {
    const res = await GetMetaMappingApi({ name: route.params.id })
    state.metaMapping = { ...res[0] }
    state.metaMapping.metaDataMapper = res[0].metaDataMapper ? JSON.parse(res[0].metaDataMapper) : {}
    state.list = res.reduce((prev, item) => {
        if (item.metaDataMapper) {
            const _metaDataMapper = JSON.parse(item.metaDataMapper)
            Object.keys(_metaDataMapper).forEach(key => {
                prev.push({ metaData: key, label: _metaDataMapper[key]})
            }) 
        }
        return prev
    }, [])
    state._list = deepCopy(state.list) 
}
async function handleDisplayChange(row) {
    try {
        row.loading = true
        const params = {
            id: row.id,
            name: row.display,
            metaDataMapper: row.documentType,
        }
        await SaveMetadataMappingApi({ documentType: params })
    } catch (error) {
        row.display = !row.display
    }
    setTimeout(() => {
        row.loading = false
    }, 500)
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