<template>
    <Table  :columns="tableSetting.columns" :table-data="tableData" 
            @row-dblclick="handleDblclick">
            <template #actions="{ row, $index }">
                <el-button v-if="row.readOnly" type="primary" text disabled>{{$t('readOnly')}}</el-button>
                <el-button v-else-if="row.watermarkStatus === 'NO'" type="primary" text disabled>{{$t('Converting')}}...</el-button>
                <el-button v-else-if="(!row.watermarkStatus || row.watermarkStatus === 'YES')" type="primary" :loading="row.downloading" @click="handleAction('download', row, $index)">{{$t('download')}}</el-button>
                <el-button v-else text type="danger" disabled>{{$t('Conversion failed')}}</el-button>
            </template>    
        </Table>
    <ReaderDialog ref="ReaderRef" v-bind="previewFile" >
        <!-- <template #actions>
            <el-button :icon="Download" :loading="previewFile.downloading" @click="handleAction('download', previewFile)">{{$t('download')}}</el-button>
        </template> -->
    </ReaderDialog>
</template>


<script lang="ts" setup>
import { getPreviewApi, publicDownloadApi, checkWatermarkStatusApi, TABLE, defaultTableSetting } from 'dp-api'
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
async function handleAction (command: string, row: any, index: number) {
    switch(command) {
        case 'download':
            row.downloading = true
            try {
                await handleDownload(row)
                row.downloading = false
            } catch (error) {
                row.downloading = false
            }
            break
        default:
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
        noDownload: true,
        print: false,
        loadAnnotations: false,
    }
})
</script>

<style lang="scss" scoped>
</style>