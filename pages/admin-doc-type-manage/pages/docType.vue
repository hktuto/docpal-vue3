<template>
    <NuxtLayout class="fit-height withPadding">
        <div class="main">
            <div class="main-header">
                <el-button @click="handleDownload" @keyup.enter="handleDownload">{{$t('common_download')}}</el-button>
            </div>
            <el-card class="main-left" v-loading="state.schemaLoading">
                <template #header>
                    <div class="card-header">
                        <span>{{$t('docType_schema')}}({{ state.schemaList.length }})</span>
                        <el-button class="button" type="primary"
                            @click="handleSchemaDialogShow()">{{$t('common_new')}}</el-button>
                    </div>
                    <KeywordFilter :list="state.schemaList" attr="keyword"
                        @filter="handleUserFilter"></KeywordFilter>
                </template>
                <Table :columns="schemaTableSetting.columns" :table-data="state._schemaList"
                    @command="handleSchemaAction"
                    @row-dblclick="handleSchemaDialogShow"></Table>
            </el-card>
            <el-card class="main-right" v-loading="state.docTypeLoading">
                <template #header>
                    <div class="card-header">
                        <span>{{$t('docType_documentType')}}({{ state.docTypeList.length }})</span>
                        <el-button class="button" type="primary"
                            @click="handleDocTypeDialogShow()">{{$t('common_new')}}</el-button>
                    </div>
                    <KeywordFilter :list="state.docTypeList" attr="docTypeId"
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
    DownloadPackageTarApi,
    TABLE, defaultTableSetting
} from 'dp-api'
const state = reactive({
    schemaList: [],
    _schemaList: [],
    docTypeList: [],
    _docTypeList: [],
    schemaLoading: false,
    docTypeLoading: false,
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
async function handleDownload () {
    const blob = await DownloadPackageTarApi()
    downloadBlob(blob, 'wcl-custom-schema-doctype-vocabulary.jar')
}
async function getSchema() {
    state.schemaLoading = true
    try {
        state.schemaList = await GetCustomSchemaListApi(true)
        state._schemaList = state.schemaList
    } catch (error) {
    }
    state.schemaLoading = false
}
async function getDocType() {
    state.docTypeLoading = true
    try {
        state.docTypeList = await GetCustomDocTypeListApi(true)
        state._docTypeList = state.docTypeList
    } catch (error) {
    }
    state.docTypeLoading = false
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
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: min-content 1fr;
    gap: calc(var(--app-padding) * 2);
    overflow: hidden;
    &-header { grid-area: 1 / 1 / 2 / 3; }
    &-left { grid-area: 2 / 1 / 3 / 2; }
    &-right { grid-area: 2 / 2 / 3 / 3; }
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
