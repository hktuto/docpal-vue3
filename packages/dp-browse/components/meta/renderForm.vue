<template>
    <FromVariablesRenderer ref="FromVariablesRendererRef" @formChange="formChange"/>
</template>

<script lang="ts" setup> 
import { GetMetaValidationRuleApi } from 'dp-api'
const props = withDefaults(defineProps<{
    showApply: boolean,
}>(), {
  showApply: true
})
const emits = defineEmits(['apply-to-formChange'])
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
        // try {
            const date = new Date().valueOf()
            state.variables = []
            state.data.forEach((item, index) => {
                if(item.display && ignoreList.indexOf(item.metaData) === -1) {
                    const _item = {
                        name: item.metaData,
                        label: $t(item.metaData),
                        type: item.dataType || 'input',
                        required: item.isRequire || false
                    }
                    
                    switch (item.dataType) {
                        case 'input':
                        case 'textarea':
                            if(item.options.length) _item.length = item.options.length
                            if(item.options.regex) _item.onValidate = getValidate(item.options.regex)
                            // _item.onValidate = getValidate('^[a-zA-Z_][a-zA-Z0-9_]*$')
                            break;
                        case 'date':
                            if(item.options.formatDate) _item.format = item.options.formatDate
                            break;
                        case 'select':
                            if(item.values) _item.options = item.values
                            break
                        default:
                            break;
                    }
                    state.variables.push(_item)
                }
            });
            nextTick(async () => {
                const formJson = await FromVariablesRendererRef.value.createJson(state.variables)
                if (props.showApply) {
                    getApplyFormJson(formJson)
                }
            })
        // } catch (error) {
        // }
    } 
    function getApplyFormJson (formJson) {
        const gridItem = getMetaApplyFormGridItem()
        gridItem.cols[0].widgetList.push(...formJson.widgetList)
        console.log('gridItem', gridItem);
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
    return await FromVariablesRendererRef.value.setData(properties)
}
async function getData() {
    return await FromVariablesRendererRef.value.getData()
}
function formChange(fieldName, newValue, oldValue, formModel) {
    emits('formChange', {fieldName,newValue,oldValue,formModel})
}
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
                        msg += `[${metaItem.metaData}]: ${$t('common_canNotEmpty')}<br/>`
                    }
            } 
        })
        return msg
    }

defineExpose({ getData, setData, init, getValidateMsg })
onMounted(() => {
    
    
})
</script>

<style lang="scss" scoped>
</style>
