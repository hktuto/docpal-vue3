<template>
    <FromVariablesRenderer ref="FromVariablesRendererRef" @formChange="formChange"
        @handleApply="handleApply">
        <template v-for="item in state.variables" v-slot:[`slot-${item.name}`]>
            <div :id="`slot-${item.name}`" :key="item.name">
                {{ item.name }}
            </div>
        </template>
    </FromVariablesRenderer>
</template>

<script lang="ts" setup> 
import { ElMessageBox } from 'element-plus'
import { GetMetaValidationRuleApi, GetSTypesApi } from 'dp-api'
const props = withDefaults(defineProps<{
    mode: 'fileRequest' | 'ai' | 'normal',
}>(), {
    mode: 'normal',
})
const emits = defineEmits(['formChange', 'handleApply'])
const route = useRoute()
const state = reactive({
    data: [],
    variables: [],
    documentTypeSelected: ''
})
const ignoreList = ['dc:title', 'dc:creator', 'dc:modified', 'dc:lastContributor', 'dc:created', 'dc:publisher', 'dc:contributors', 'common:icon', 'common:icon-expanded', 'uid:uid', 'uid:major_version', 'uid:minor_version', 'file:content', 'files:files', 'nxtag:tags', 'relatedtext:relatedtextresources', 'sec:clearanceLevel', 'sec:securityKeyword']
// #region module: Variables
    const FromVariablesRendererRef = ref()
    async function getVariables() {
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
                        optionItems: await GetSTypesApi()
                    }
                })
            }
            console.log(state.variables);
            nextTick(async () => {
                const formJson = await FromVariablesRendererRef.value.createJson(state.variables)
                if (props.mode === 'fileRequest') {
                    const newFormJson = getApplyFormJson(formJson)
                    FromVariablesRendererRef.value.setFormJson(newFormJson)
                }
                else if (props.mode === 'ai') {
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
            const gridItem = getMetaApplyFormGridItem(16,8,['test'])
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
    async function init(documentType) {
        if (!documentType) {
            clear()
            return
        }
        try {
            state.data = []
            state.variables = []
            state.data = await GetMetaValidationRuleApi({ documentType })
        } catch (error) {
        }
        getVariables()
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
    return await FromVariablesRendererRef.value.setData(properties)
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

<style lang="scss">
.meta-button-flex-end {
  display: flex!important;
  align-items: flex-end;
}
.meta-button-flex-end button{
   margin-bottom: 18px;
}
</style>
