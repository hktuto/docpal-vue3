<template>
<NuxtLayout class="fit-height withPadding" backPath="/template" :pageTitle="`${$t('admin_template')}/${$t('common_preview')}`">
    <div class="template-container">
        <div class="template-left-container">
            <div class="flex-x-between">
                <div class="flex-x-between">
                    <span class="template-title"> {{ state.info.name }} </span>
                    <SvgIcon src="/icons/file/edit.svg" class="el-icon--right"
                        round :content="$t('tip.editTemplateInfo')"
                        @click="handleEdit"></SvgIcon> 
                </div>
                <div class="flex-x-between">
                    <SvgIcon class="el-icon--left" src="/icons/file/file-refresh.svg" round :content="$t('common_refresh')" @click="handleRefresh()" />
                    <BrowseActionsOffice :doc="{...state.info, id: state.info.documentId}" @refresh="handleRefresh()"/>
                    <TemplateReplaceButton :templateInfo="state.info" class="el-icon--right" @refresh="getPreviewFile()" />
                </div>
            </div>
            <div v-loading="state.previewFile.loading">
                <Reader ref="ReaderRef" v-bind="state.previewFile" ></Reader>
            </div>
        </div>
        <InteractDrawer ref="InteractDrawerRef" class="template-interact-drawer" :min-width="200" :defaultOpen="true" :showClose="false">
            <div class="template-title">{{$t('template.variable')}}</div>
            <FromVariablesRenderer ref="FromVariablesRendererRef"/>
            <el-button :loading="state.downloadLoading" @click="handleTest">{{$t('template.test')}}</el-button>
        </InteractDrawer>
    </div>
    <TemplateAddStep1Dialog ref="TemplateAddStep1DialogRef" @update="handleInit('info')"></TemplateAddStep1Dialog>
</NuxtLayout>
</template>

<script lang="ts" setup> 
import { Download } from '@element-plus/icons-vue';
import { ElNotification } from 'element-plus'
import { GetTemplateInfoApi, GetDocumentPreview, GetTemplateVariablesApi, GenerateFileApi } from 'dp-api'
const route = useRoute()
const state = reactive({
    info: {
        name: ''
    },
    variables: [],
    previewFile: {
        blob: null,
        name: '',
        id: '',
        loading: false,
        options: {
            noDownload: true,
            print: false,
            loadAnnotations: false,
            readOnly: true
        }
    },
    downloadLoading: false
})
const InteractDrawerRef = ref()
async function getPreviewFile () {
    state.previewFile.loading = true
    try {
        state.previewFile.blob = await GetDocumentPreview(state.info.documentId)
    } catch (error) {
    }
    state.previewFile.loading = false
}
async function getInfo() {
    state.info = await GetTemplateInfoApi(route.params.id)
}
// #region module: Variables
    const FromVariablesRendererRef = ref()
    async function getVariables() {
        try {
            const date = new Date().valueOf()
            const res = await GetTemplateVariablesApi(route.params.id)
            if(!res.templateVariable) return
            const templateVariable = [...new Set(JSON.parse(res.templateVariable))]
            state.variables = []
            templateVariable.forEach((item, index) => {
                state.variables.push({
                    name: item,
                    type: 'input',
                    required: true
                })
            });
            nextTick(() => {
                FromVariablesRendererRef.value.createJson(state.variables)
            })
            
        } catch (error) {
            
        }
    } 
    async function handleTest() {
        state.downloadLoading = true
        
        try {
            const data = await FromVariablesRendererRef.value.getData()
            const id = new Date().valueOf() + state.info.name
            const notification = ElNotification({
                title: '',
                icon: Download,
                dangerouslyUseHTMLString: true,
                message: `<span id="${id}">0%</span> <span title="${state.info.name}">${state.info.name}</span>`,
                showClose: false,
                customClass: 'download-notification',
                duration: 0,
                position: 'bottom-right'
            });
            const blob = await GenerateFileApi({
                id: state.info.id,
                variables: data
            }, (e) => {
                const el = document.getElementById(id)
                if(el) el.innerHTML = Math.round((e.loaded / e.total) * 100) + '%'
            })
            downloadBlob(blob, getName())
            setTimeout(()=> {
                notification.close()
            }, 3000)
        } catch (error) {
            
        }
        state.downloadLoading = false
    }
    
// #endregion
function getName () {
    return state.info.name.split('.')[0]
}
const TemplateAddStep1DialogRef = ref()
function handleEdit() {
    TemplateAddStep1DialogRef.value.handleOpen({ ...state.info, isEdit: true })
}

function handleRefresh () {
    getInfo()
    getVariables()
    getPreviewFile()
}
onMounted(async () => {
    getVariables()
    await getInfo()
    getPreviewFile()
})
</script>

<style lang="scss" scoped>
.template-container {
    display: grid;
    grid-template-columns: 1fr min-content;
    gap: var(--app-padding);
    overflow: hidden;
}
.template-left-container {
    display: grid;
    grid-template-rows: min-content 1fr;
    gap: var(--app-padding);
}
.template-interact-drawer {
    height: 100%;
    overflow: hidden;
    box-shadow: unset;
    border-left: 1px solid #ddd;
    display: grid;
    grid-template-rows: min-content 1fr min-content;
    gap: var(--app-padding);
    padding-bottom: 0;
    .formContainer {
        overflow: auto;
    }
}
.template-title {
    font-size: 18px;
    font-weight: bold;
    line-height: 22px;
    letter-spacing: 0px;
    color: #606266;
}
</style>
