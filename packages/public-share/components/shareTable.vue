<template>
    <Table  :columns="tableSetting.columns" :table-data="tableData" 
            @row-dblclick="handleDblclick">
            <template #actions="{ row, $index }">
                <el-button type="primary" :loading="row.downloading" @click="handleAction('download', row, $index)">{{$t('download')}}</el-button>
            </template>    
        </Table>
    <ReaderDialog ref="ReaderRef" v-bind="previewFile" >
        <template #actions>
            <el-button :icon="Download" :loading="previewFile.downloading" @click="handleAction('download', previewFile)">{{$t('download')}}</el-button>
        </template>
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
                if (row.watermarkTemplateId && row.watermarkStatus !== 'YES') {
                    row.interval = setInterval(async() => {
                        const params = {
                            token: route.query.token,
                            password: sessionStorage.getItem('sharePWD'),
                            documentId: row.id
                        }
                        const data = await checkWatermarkStatusApi(params)
                        if(data.watermarkStatus === 'YES') {
                            clearInterval(row.interval)
                            row.watermarkStatus = 'YES'
                            await handleDownload(row)
                            row.downloading = false
                        }
                    },1000)
                } else {
                    await handleDownload(row)
                    row.downloading = false
                }
            } catch (error) {
                row.downloading = false
            }
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