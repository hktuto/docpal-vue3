<template>
    <Table :columns="tableSetting.columns" :table-data="state._list"
        @row-dblclick="handleDblclick"
        @command="handleAction">
        <template #isRequire="{ row }">
            <el-icon v-if="row.isRequire" style="--color: var(--primary-color)"><Select /></el-icon>
            <el-icon v-else style="--color: #F56C6C"><CloseBold /></el-icon>
        </template>   
        <template #preSortButton>
            <div class="mg-b">
                <KeywordFilter :list="state.list" attr="metaData"
                    @filter="handleKeywordFilter"></KeywordFilter>
                <el-button class="el-icon--right" type="primary"
                    @click="handleDialogShow()">{{$t('common_add')}}</el-button>
            </div>
        </template> 
        <template #dataType="{ row }">
            {{$t(`meta.dataType.${row.dataType}`)}}
        </template>  
        <template #display="{ row }">
            <el-switch v-model="row.display" :loading="row.loading"
                @click.native.stop
                @change="handleDisplayChange(row)"></el-switch>    
        </template>    
    </Table>
    <MetaValidationDisplayMetaDialog ref="MetaDisplayMetaDialogRef"
        :docType="docType"
         @refresh="getTable"></MetaValidationDisplayMetaDialog>
</template>


<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Select, CloseBold } from '@element-plus/icons-vue'
import { 
    GetMetadataSettingApi,
    UpdateMetadataSettingApi,
    DeleteMetadataSettingApi,
    TABLE, defaultTableSetting
} from 'dp-api'
const props = defineProps<{
    docType: object,
}>()
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
            const res = await DeleteMetadataSettingApi(row.id)
            getTable()
        })
}
const MetaDisplayMetaDialogRef = ref()
function handleDialogShow(data) {
    MetaDisplayMetaDialogRef.value.handleOpen(state.list, data)
}

async function getTable(addMore: boolean = false) {
    state.list = await GetMetadataSettingApi( route.params.id )
    state._list = state.list
    if (!!addMore) handleDialogShow()
}
function handleKeywordFilter(data) {
    state._list = data
}
async function handleDisplayChange(row) {
    try {
        row.loading = true
        const params = {
            id: row.id,
            display: row.display,
            ...row
        }
        await UpdateMetadataSettingApi(params)
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
.mg-b {
    margin-bottom: var(--app-padding);
}
</style>