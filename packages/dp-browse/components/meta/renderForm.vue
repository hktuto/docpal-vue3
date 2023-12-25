<template>
<div v-loading="state.loading" style="height: 100%;">
    <FromVariablesRenderer ref="FromVariablesRendererRef" @formChange="formChange"
        @handleApply="handleApply" >
        <template v-for="item in state.variables" v-slot:[`slot-${item.name}`]>
            <div v-if="state.aiAnalysis && state.aiAnalysis[item.name]" 
                :id="`slot-${item.name}`" :key="item.name" class="ai-suggestion-content">
                <SvgIcon src="/icons/file/ai.svg" />
                <pre>{{state.aiAnalysis[item.name].label || state.aiAnalysis[item.name].value}}</pre> 
                <div class="flex-x-start ai-button-list">
                    <el-button :icon="Check" type="primary" text style="color: #fff"
                        @click="aiFormChange(item.name, state.aiAnalysis[item.name])"></el-button>
                    <el-button :icon="Close" type="primary" text class="el-icon--right" style="color: #fff"
                        @click="deleteAiSuggestion(item.name)"></el-button>
                </div>
            </div>
        </template>
    </FromVariablesRenderer>
</div>
</template>

<script lang="ts" setup> 
import { Check, Close } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { GetMetaValidationRuleApi, GetDocListWithIsFolderApi, UpdateAiDocumentApi } from 'dp-api'
type initMetaFormOptions = {
    isFolder?: boolean,
    aiAnalysis?: any,
    aiDocId?: string
}
const props = withDefaults(defineProps<{
    mode: 'fileRequest' | 'ai' | 'ai-edit', 'normal',
}>(), {
    mode: 'normal',
})
const emits = defineEmits(['formChange', 'handleApply'])
const route = useRoute()
const state = reactive({
    loading: false,
    data: [],
    variables: [],
    documentTypeSelected: '',
    aiAnalysis: {},
    aiDocId: '',
})
const ignoreList = ['dc:title', 'dc:creator', 'dc:modified', 'dc:lastContributor', 'dc:created', 'dc:publisher', 'dc:contributors', 'common:icon', 'common:icon-expanded', 'uid:uid', 'uid:major_version', 'uid:minor_version', 'file:content', 'files:files', 'nxtag:tags', 'relatedtext:relatedtextresources', 'sec:clearanceLevel', 'sec:securityKeyword']
// #region module: Variables
    const FromVariablesRendererRef = ref()
    async function getVariables(isFolder?: boolean) {
        try {
            const date = new Date().valueOf()
            state.variables = []
            state.data.forEach((item, index) => {
                if(item.display && ignoreList.indexOf(item.metaData) === -1) {
                    const _item: any = {
                        name: item.metaData,
                        label: $t(item.metaData),
                        type: item.dataType || 'input',
                        required: item.isRequire || false,
                        options: {}
                    }
                    
                    switch (item.dataType) {
                        case 'input':
                        case 'textarea':
                            if(item.options.length) _item.options.maxLength = item.options.length
                            if(item.options.regex) _item.options.onValidate = getValidate(item.options.regex)
                            // _item.onValidate = getValidate('^[a-zA-Z_][a-zA-Z0-9_]*$')
                            break;
                        case 'date':
                            if(item.options.formatDate) _item.options.format = item.options.formatDate
                            if(item.options.formatDate.includes('HH') || item.options.formatDate.includes('hh')) _item.options.type = 'datetime'
                            break;
                        case 'select':
                            if(item.values) _item.options.optionItems = item.values
                            _item.options.clearable = true
                            _item.options.filterable = true
                            break
                        default:
                            break;
                    }
                    if(item.metaDataType === 'array') {
                        _item.options = { ..._item.options, multiple: true }
                    }
                    state.variables.push(_item)
                }
            });
            
            if(props.mode === 'ai') {
                state.variables.unshift({
                    name: 'documentType',
                    label: $t('search_documentType'),
                    type: 'select',
                    required: true,
                    options: {
                        optionItems: await GetDocListWithIsFolderApi(isFolder),
                        clearable: false,
                        filterable: true
                    }
                })
            }
            nextTick(async () => {
                const formJson = await FromVariablesRendererRef.value.createJson(state.variables)
                if (props.mode === 'fileRequest') {
                    const newFormJson = getApplyFormJson(formJson)
                    FromVariablesRendererRef.value.setFormJson(newFormJson)
                }
                else if (props.mode === 'ai' || props.mode === 'ai-edit') {
                    const newFormJson = getAIFormJson(formJson)
                    console.log({newFormJson});
                    FromVariablesRendererRef.value.setFormJson(newFormJson)
                }
            })
        } catch (error) {
        }
    } 
    function getApplyFormJson (formJson) {
        const widgetList = []
        formJson.widgetList.forEach(item => {
            const gridItem = getMetaApplyFormGridItem()
            const buttonItem = getMetaApplyButton(item.options.name)
            gridItem.cols[0].widgetList.push(item)
            gridItem.cols[1].widgetList.push(buttonItem)
            widgetList.push(gridItem)
        })
        return { formConfig: formJson.formConfig, widgetList }
    }
    function getAIFormJson (formJson) {
        const widgetList = []
        formJson.widgetList.forEach(item => {
            const gridItem = getMetaApplyFormGridItem(16,8, ['ai-suggestion-container'])
            const slotItem = getMetaAISlot(item.options.name)
            gridItem.cols[0].widgetList.push(item)
            gridItem.cols[1].widgetList.push(slotItem)
            widgetList.push(gridItem)
        })
        return { formConfig: formJson.formConfig, widgetList }
    }
    function getValidate(rule = '^[a-zA-Z_][a-zA-Z0-9_]*$') {
        return `if(!/${rule}/.test(value)) callback(new Error("${rule}")) \nelse callback()`
    }
    function clear() {
        state.variables = []
        FromVariablesRendererRef.value.createJson(state.variables )
    }
    async function init(documentType, initOptions: initMetaFormOptions) {
        if (!documentType) {
            clear()
            return
        }
        try {
            state.loading = true
            state.data = []
            state.variables = []
            state.data = await GetMetaValidationRuleApi({ documentType })
            await getVariables(initOptions.isFolder)
            if(props.mode === 'ai' || props.mode === 'ai-edit') {
                if(initOptions.aiAnalysis) state.aiAnalysis = initOptions.aiAnalysis
                if(initOptions.aiDocId) state.aiDocId = initOptions.aiDocId
            }
        } catch (error) {
        }
        state.loading = false
    }
// #endregion
async function setData(properties) {
    state.variables.forEach(item => {
        switch (item.type) {
            case 'textarea':
                if (properties[item.name]) properties[item.name] = properties[item.name].replaceAll('<br/>','\n')
                break;
            default:
                break;
        }
    })
    setTimeout(() => {
        FromVariablesRendererRef.value.setData(properties)
    })
    // return await FromVariablesRendererRef.value.setData(properties)
}
async function getData() {
    const data = await FromVariablesRendererRef.value.getData()
    state.variables.forEach(item => {
        switch (item.type) {
            case 'textarea':
                if (data[item.name]) data[item.name] = data[item.name].replaceAll('\n','<br/>')
                break;
            case 'date':
                // if (data[item.name]) data[item.name] = formatDate(data[item.name], 'YYYY-MM-DD HH:mm:ss')
            default:
                break;
        }
    })
    return Object.keys(data).reduce((prev: any, key) => {
        prev[key] = data[key] ? data[key] : ''
        return prev
    }, {})
}
function formChange(formData) {
    emits('formChange', formData)
}
async function aiFormChange (key, analysis) {
    FromVariablesRendererRef.value.setData({
        [key]: analysis.value
    })
}
async function deleteAiSuggestion(deleteName: string) {
    const _aiAnalysis = deepCopy(state.aiAnalysis)
    delete _aiAnalysis.documentType
    delete _aiAnalysis[deleteName]
    const params: any = {
        documentType: deleteName === 'documentType' || !state.aiAnalysis.documentType ? null : state.aiAnalysis?.documentType?.value,
        metaDatas: Object.keys(_aiAnalysis).reduce((prev: any,key) => {
            const item = _aiAnalysis[key]
            prev.push({
                name: key,
                value: item.value
            })
            return prev
        }, []),
        aiId:  state.aiDocId
    }
    try {
        const res = await UpdateAiDocumentApi(params)
        delete state.aiAnalysis[deleteName]
    } catch (error) {
        
    }
}
function handleApply(formModel) {
    console.log(formModel);
    emits('handleApply', formModel)
}
// #region module: Validate
    async function getValidateMsg (documentType, properties?) {
        let msg = ''
        const metaList = await GetMetaValidationRuleApi({ documentType })
        if (!metaList) return msg
        metaList.forEach(metaItem => {
            if (!metaItem.display || ignoreList.includes(metaItem.metaData)) return
            if (metaItem.isRequire){
                if(!properties 
                    || !properties[metaItem.metaData]
                    || (properties[metaItem.metaData] instanceof Array && properties[metaItem.metaData].length === 0)) {
                        msg += `[${$t(metaItem.metaData)}]: ${$t('common_canNotEmpty')}<br/>`
                    }
            } 
        })
        return msg
    }
    async function getErrorMessage (doc, docKey) {
        const _msg = await getValidateMsg(doc.documentType , deepCopy(doc.properties) )
        if (_msg) return `<h4 class="msg-h4">${doc[docKey]}:</h4>${_msg}`
        return ''
    }
    // docListItem: name,properties, documentType
    async function checkMetaValidate(docList: any[], docKey: string = 'name') {
        const pList = []
        docList.forEach(item => {
            if(!item.properties) item.properties = {}
            const pItem = getErrorMessage(item, docKey)
            pList.push(pItem)
        })
        let errorMessage = await Promise.all(pList)
        errorMessage = errorMessage.filter(item => !!item)
        if(errorMessage.length > 0) {
            ElMessageBox.confirm(errorMessage.join('<br>'), $t('dpTip_warning'), {
                dangerouslyUseHTMLString: true,
                confirmButtonText: $t('dpButtom_confirm'),
            })
            throw new Error("error");
        } 
        return errorMessage.length === 0
        
    }
// #endregion


defineExpose({ getData, setData, init, getValidateMsg, checkMetaValidate })
</script>
<style lang="scss" scoped>
.ai-button-list {
    gap: var(--app-padding);
    .el-button {
        margin: unset;
        padding: unset;
    }
}
</style>

<style lang="scss">
.ai-suggestion-container {
    .field-wrapper, .static-content-item, .slot-wrapper-render {
        height: 100%;
    }
    padding: 24px 0 18px;
    .ai-suggestion-content {
        height: 100%;
        --icon-color: #fff;
        --icon-size: 18px;
        padding: 3px var(--app-padding);
        background-color: #FFC401;
        color: #fff;
        border-radius: 15px;
        display: grid;
        grid-template-columns: min-content 1fr min-content;
        align-items: self-start;
        gap: var(--app-padding);
        line-height: 30px;
        .el-button.is-text:not(.is-disabled):hover, .el-button.is-text:not(.is-disabled):focus {
            background-color: unset;
            opacity: .5;
        }
        pre {
            font-family: Roboto;
            font-style: normal;
            font-weight: normal;
            padding: unset;
            margin: unset;
            white-space: pre-wrap; /* css-3 */
            word-wrap: break-word; /* InternetExplorer5.5+ */
            white-space: -moz-pre-wrap; /* Mozilla,since1999 */
            white-space: -pre-wrap; /* Opera4-6 */
            white-space: -o-pre-wrap;
        }
    }
}
</style>
