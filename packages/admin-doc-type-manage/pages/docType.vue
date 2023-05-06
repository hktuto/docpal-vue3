<template>
    <NuxtLayout class="fit-height withPadding">
        <div class="main">
            <el-card>
                <template #header>
                    <div class="card-header">
                        <span>{{$t('docType_schema')}}({{ state.schemaList.length }})</span>
                        <el-button class="button" type="primary"
                            @click="handleSchemaDialogShow()">{{$t('common_new')}}</el-button>
                    </div>
                    <KeywordFilter :list="state.schemaList" attr="name"
                        @filter="handleUserFilter"></KeywordFilter>
                </template>
                <Table :columns="schemaTableSetting.columns" :table-data="state._schemaList"
                    @command="handleSchemaAction"
                    @row-dblclick="handleSchemaDialogShow"></Table>
            </el-card>
            <el-card>
                <template #header>
                    <div class="card-header">
                        <span>{{$t('docType_documentType')}}({{ state.docTypeList.length }})</span>
                        <el-button class="button" type="primary" 
                            @click="handleDocTypeDialogShow()">{{$t('common_new')}}</el-button>
                    </div>
                    <KeywordFilter :list="state.docTypeList" attr="name"
                        @filter="handleGroupFilter"></KeywordFilter>
                </template>
                <Table :columns="docTypeTableSetting.columns" :table-data="state._docTypeList"
                    @command="handleDocTypeAction"
                    @row-dblclick="handleDocTypeDialogShow"></Table>
            </el-card>
       </div>
       <SchemaManageDialog ref="SchemaManageDialogRef" @refresh="getSchema"></SchemaManageDialog>
       <DocTypeManageDialog ref="DocTypeManageDialogRef" @refresh="getDocType"></DocTypeManageDialog>
    </NuxtLayout>
</template>


<script lang="ts" setup>
// import { getLoggersApi, setLoggersApi } from 'dp-api/src/endpoint/admin-log'
import { 
    GetCustomSchemaListApi,
    GetCustomDocTypeListApi,
    TABLE, defaultTableSetting
} from 'dp-api'
const state = reactive({
    schemaList: [],
    _schemaList: [],
    docTypeList: [],
    _docTypeList: [],
})
const schemaTableKey = TABLE.ADMIN_SCHEMA_LIST
const schemaTableSetting = defaultTableSetting[schemaTableKey]
const docTypeTableKey = TABLE.ADMIN_DOC_TYPE_LIST
const docTypeTableSetting = defaultTableSetting[docTypeTableKey]
function handleSchemaAction (command:sting, row: any, rowIndex: number) {
    switch (command) {
        case 'edit':
            handleSchemaDialogShow(row)
            break
    }
}
function handleDocTypeAction (command:sting, row: any, rowIndex: number) {
    switch (command) {
        case 'edit':
            handleDocTypeDialogShow(row)
            break
    }
}
const SchemaManageDialogRef = ref()
const DocTypeManageDialogRef = ref()
function handleSchemaDialogShow(data) {
    SchemaManageDialogRef.value.handleOpen(data)
}
function handleDocTypeDialogShow(data) {
    DocTypeManageDialogRef.value.handleOpen(data)
}
async function handleSubmit (shareInfo) {
}
function handleUserFilter(data) {
    state._schemaList = data
}
function handleGroupFilter(data) {
    state._docTypeList = data
}
async function getSchema() {
    state.schemaList = await GetCustomSchemaListApi(true)
    state._schemaList = state.schemaList
}
async function getDocType() {
    state.docTypeList = await GetCustomDocTypeListApi(true)
    state._docTypeList = state.docTypeList
}
onMounted(async() => {
    getSchema()
    getDocType()
})
</script>

<style lang="scss" scoped>

.main {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: calc(var(--app-padding) * 2);
}
:deep(.el-autocomplete) {
    width: 100%;
    margin: var(--app-padding) 0;
}
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