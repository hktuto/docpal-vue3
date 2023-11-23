<template>
    <Table :columns="tableSetting.columns" :table-data="state._list"
        :options="{ rowKey: 'type' }"
        @row-dblclick="handleDblclick"
        @command="handleAction">  
        <template #preSortButton>
            <div class="mg-b">
                <KeywordFilter :list="state.list" attr="metaData"
                    @filter="handleKeywordFilter"></KeywordFilter>
                <el-button class="el-icon--right" type="primary"
                    @click="handleDialogShow()">{{$t('common_add')}}</el-button>
            </div>
        </template>
    </Table>
    <MetaValidationRelatedTypeDialog ref="MetaDisplayMetaDialogRef" :docType="docType" @refresh="getTable"></MetaValidationRelatedTypeDialog>
</template>


<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
    GetMetadataRelatedApi,
    DeleteMetadataRelatedApi,
    TABLE, defaultTableSetting
} from 'dp-api'
const props = defineProps<{
    docType: object,
}>()
const state = reactive({
    loading: false,
    list: [],
    _list: [],
})
const route = useRoute()
const router = useRouter()
const tableKey = TABLE.ADMIN_META_RELATED
const tableSetting = defaultTableSetting[tableKey]
function handleDblclick (row) {
    handleDialogShow(row)
    // router.push(`/user/detail?id=${row.userId}`)
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
            state.loading = true
            try {
                const res = await DeleteMetadataRelatedApi(row.id)
                await getTable()
            } catch (error) {
                
            }
            state.loading = false
        })
}
const MetaDisplayMetaDialogRef = ref()
function handleDialogShow(data) {
    MetaDisplayMetaDialogRef.value.handleOpen(state.list, data)
}

async function getTable() {
    state.list = await GetMetadataRelatedApi(route.params.id)
    state._list = state.list
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