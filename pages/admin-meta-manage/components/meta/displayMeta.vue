<template>
<el-card>
    <template #header>
        <div class="card-header">
            <span>{{$t('docType_displayMeta')}}</span>
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
    <MetaDisplayMetaDialog ref="MetaDisplayMetaDialogRef" @refresh="getTable"></MetaDisplayMetaDialog>
</el-card>
</template>


<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Select, CloseBold } from '@element-plus/icons-vue'
import { 
    GetMetaValidationRuleApi,
    SaveMetaValidationRuleApi,
    DeleteMetaValidationRuleApi,
    TABLE, defaultTableSetting
} from 'dp-api'
const state = reactive({
    list: [],
    _list: [],
})
const route = useRoute()
const tableKey = TABLE.ADMIN_META_DISPLAY
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
            const res = await DeleteMetaValidationRuleApi(row.id)
            getTable()
        })
    
}
const MetaDisplayMetaDialogRef = ref()
function handleDialogShow(data) {
    MetaDisplayMetaDialogRef.value.handleOpen(state.list, data)
}

async function getTable(addMore: boolean = false) {
    state.list = await GetMetaValidationRuleApi({ documentType: route.params.id })
    state._list = state.list
    if (!!addMore) handleDialogShow()
}
async function handleDisplayChange(row) {
    try {
        row.loading = true
        const params = {
            id: row.id,
            display: row.display,
            documentType: row.documentType,
            metaData: row.metaData
        }
        await SaveMetaValidationRuleApi(params)
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