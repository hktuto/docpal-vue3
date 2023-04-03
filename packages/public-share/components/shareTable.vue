<template>
    <Table  :columns="tableSetting.columns" :table-data="tableData" 
            @command="handleAction"
            @row-dblclick="handleDblclick"></Table>
    <ReaderDialog ref="ReaderRef" v-bind="previewFile" >
        <template #actions>
            <el-button :icon="Download" @click="handleDownload">{{$t('download')}}</el-button>
        </template>
    </ReaderDialog>
</template>


<script lang="ts" setup>
import { getPreviewApi, publicDownloadApi, TABLE, defaultTableSetting } from 'dp-api'
const route = useRoute()
const props = withDefaults( defineProps<{
    tableData: Array;
}>() , {
    tableData: [],
})
// #region module: page
    const tableKey = TABLE.PUBLIC_SHARE
    const tableSetting = defaultTableSetting[tableKey]
// #endregion
async function handleDblclick (row) {
    ReaderRef.value.handleOpen()
    previewFile.loading = true
    const fileId = row.id
    try {
        const params = {
            token: route.query.token,
            password: sessionStorage.getItem('sharePWD'),
            documentId: fileId,
        }
        previewFile.blob = await getPreviewApi(params)
    } catch (error) {
        
    }
    previewFile.id = fileId
    previewFile.name = row.title
    previewFile.loading = false
}
function handleAction (command, row: any, index: number) {
    switch(command) {
        case 'download':
            handleDownload(row)
            break
    }
}
async function handleDownload (row: any) {
    const params = {
        token: route.query.token,
        password: sessionStorage.getItem('sharePWD'),
        documentId: row.id
    }
    const blob = await publicDownloadApi(params)
    downloadBlob(blob, row.name || row.title, blob.type)
    
}
const ReaderRef = ref()
const previewFile = reactive({
    blob: null,
    name: '',
    id: '',
    loading: false,
    options: {
        noDownload: true
    }
})
</script>

<style lang="scss" scoped>
</style>