<template>
    <NuxtLayout class="fit-height withPadding" :backPath="state.backPath" :pageTitle="$t('share.shareQueue')">
        <main class="share-main" v-loading="state.loading">
            <FromRenderer ref="FromRendererRef" class="div1" :form-json="formJson" />
            <div class="div2" v-loading="previewFile.loading">
                <template v-if="previewFile.name">
                    <div class="reader-container">
                        <h3>{{previewFile.name}}</h3>
                        <Reader ref="ReaderRef" v-bind="previewFile" ></Reader>
                    </div>
                </template>
                <template v-else>
                    <div class="no-file-preview"> {{$t('please select a file')}}</div>
                </template>
            </div>
            <ShareTableSet v-model:tableData="state.minTypeShareList" class="div3"
                @db-click="handleDblclick"
                @delete="handleDeleteRow"></ShareTableSet>
            <div class="div4 flex-x-end">
                <div>
                    <el-button type="primary" @click="handleAddMore">{{$t('button.addMore')}}</el-button>
                    <el-button type="info" @click="handleDiscard">{{$t('discard')}}</el-button>
                    <el-button type="primary" @click="handleSubmit">{{$t('confirm')}}</el-button>
                </div>
            </div>
        </main>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import {
    prepareShareDownloadApi,
    getPrepareShareDownloadUrlApi,
    shareRequestApi,
    GetWatermarkDocPreview,
    GetDocumentPreview,
    getJsonApi } from 'dp-api';
const route = useRoute()
const router = useRouter()
const { updateShareList, getMineTypeShareList, getUseWatermark } = useShareStore()
const ShareStore = useShareStore()
const formJson = getJsonApi('shareRequest.json')
const FromRendererRef = ref()
const state = reactive({
    minTypeShareList: [],
    interval: null,
    loading: false,
    backPath: '/browse'
})

const previewFile = reactive({
    blob: null,
    name: '',
    id: '',
    path: '',
    loading: false,
    options: {
        noDownload: true,
        print: false,
        loadAnnotations: false,
    }
})
async function handleDblclick (row) {
    previewFile.loading = true
    if(row.watermark) {
        if(!!state.interval) clearInterval(state.interval)
        state.interval = setInterval(async() => {
            const res = await getPrepareShareDownloadUrlApi(row.id)
            if (res === 'YES') {
                clearInterval(state.interval)
                previewFile.blob = await GetWatermarkDocPreview({
                    watermarkTemplateId: row.watermark,
                    documentId: row.id
                })
                previewFile.loading = false
            }
        }, 1000)
    } else {
        previewFile.blob = await GetDocumentPreview(row.id)
        previewFile.loading = false
    }
    previewFile.name = row.name
    previewFile.id = row.id
}
async function handleSubmit () {
    state.loading = true
    clearInterval(state.interval)
    try {
      const formData = await FromRendererRef.value.vFormRenderRef.getFormData()
      const param = {
        emailList: formData.emailList,
        documentList: documentIdListGet(),
        password: formData.password ? formData.password : '',
        tokenLiveInMinutes: diffMinute(formData.dueDate)
      }
        const response = await shareRequestApi(param)
        ElMessage.success($i18n.t('share_success'))
        updateShareList([])
        router.push(state.backPath)
    } catch (error) {
      console.log(error);
      ElMessage.error(error.message)
    }
    state.loading = false
    // function watermarkListGet() {
    //     return state.minTypeShareList.reduce((prev,item) => {
    //         if (item.watermark) prev[item.id] = item.watermark
            
    //         return prev
    //     }, {})
    // }
    function documentIdListGet () {
        return state.minTypeShareList.map((item:any) => ({
            docId:item.id,
            readOnly:item.readOnly,
            watermarkTemplateId: item.watermark || ""
        })
        )
    }
}
function handleDeleteRow (row) {
    const index = state.minTypeShareList.findIndex(item => row.id === item.id)
    state.minTypeShareList.splice(index, 1)
    updateShareList(state.minTypeShareList)
}
async function handleDiscard () {
    const action = await ElMessageBox.confirm(`${$t('msg_confirmWhetherToDelete')}`)
    if(action !== 'confirm') return
    clearInterval(state.interval)
    updateShareList([])
    router.push(state.backPath)
}
function handleAddMore () {
    clearInterval(state.interval)
    router.push(state.backPath)
}
onMounted(async() => {
    state.backPath = route?.query?.backPath ? route.query.backPath : '/browse'
    console.log(state.backPath);
    
    try {
        state.minTypeShareList = await getMineTypeShareList()
    } catch (error) {

    }
    if(state.minTypeShareList.length === 0) router.push(state.backPath)
    const mimeTypeList = state.minTypeShareList.reduce((prev, item) => {
        if (item.mimeType && getUseWatermark(item.mimeType)) prev.push(item.id)
        return prev
    }, [])
    prepareShareDownloadApi(mimeTypeList)
})
</script>

<style lang="scss" scoped>
.share-main {
    height: 100%;
    overflow: hidden;
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    grid-template-rows: min-content 1fr min-content;
    gap: var(--app-padding);
    .div1 { grid-area: 1 / 1 / 2 / 2; }
    .div2 { grid-area: 1 / 2 / 3 / 3; }
    .div3 { grid-area: 2 / 1 / 3 / 2; }
    .div4 { grid-area: 3 / 1 / 4 / 3; }
    .div1,.div2,.div3,.div4 {
        overflow: hidden;
    }
    .reader-container {
        height: 100%;
        overflow: hidden;
        display: grid;
        grid-template-rows: min-content 1fr;
    }
}
.no-file-preview{
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}
</style>
