<template>
<el-dialog v-model="state.visible" :title="state.isEdit ? $t('docType_editDisplayMeta') : $t('docType_addDisplayMeta')"
    :close-on-click-modal="false"
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson" @metaChange="handleMetaChange">
        <template v-slot:languageForm>
            <LanguageUnitForm ref="LanguageUnitFormRef" class="mg-b" :lKey="state.lKey"/>
        </template>
    </FromRenderer>
    <template #footer>
        <el-button :loading="state.loading" @click="handleSubmit()">{{$t('common_submit')}}</el-button>
        <el-button  v-show="!state.isEdit" :loading="state.loading" @click="handleSubmit(true)">{{$t('common_addMore')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>

import { getJsonApi, CreateMetadataSettingApi, UpdateMetadataSettingApi } from 'dp-api'
const props = defineProps<{
    docType: object,
}>()
const emits = defineEmits([
    'refresh'
])
const route = useRoute()
const user = useUser();
const state = reactive({
    loading: false,
    visible: false,
    isEdit: false,
    lKey: '',
    setting: {}
})
const FromRendererRef = ref()
const formJson = getJsonApi('meta/display.json')
async function handleSubmit (addMore: boolean = false) {
    const formData = await FromRendererRef.value.vFormRenderRef.getFormData()
    state.loading = true
    const param = {
        metaData: formData.metaData,
        isRequire: formData.isRequire,
        display: formData.display,
        dataType: formData.dataType,
        options: getFormOptions(formData),
        documentType: props.docType.name,
    }
    try {
        if(state.isEdit) {
            param.id = state.setting.id
            await UpdateMetadataSettingApi(param)
        } else {
            await CreateMetadataSettingApi(param)
        }
        state.visible = false
        FromRendererRef.value.vFormRenderRef.resetForm()
        emits('refresh', addMore)
    } catch (error) {
        
    }
    await saveI18n()
    state.loading = false

    function getFormOptions(formOptions) {
        const result = {}
        switch (formOptions.dataType) {
            case 'input':
            case 'textarea':
                result.length = formOptions.length
                result.regex = formOptions.regex
                break;
            case 'date':
                result.formatDate = formOptions.formatDate
                break;
            case 'select':
                result.dropdownType = formOptions.dropdownType
                if(formOptions.dropdownType ==='vocabulary') {
                    result.vocabulary = formOptions.vocabulary
                } else if (formOptions.dropdownType ==='masterTable') {
                    result.masterTable = formOptions.masterTable
                    result.masterTableColumn = formOptions.masterTableColumn
                } else if (formOptions.dropdownType ==='documentType') {
                    result.documentType = formOptions.documentType
                    result.displayField = formOptions.displayField
                    result.isMultiple = formOptions.isMultiple
                }
                break;
            default:
                break;
        }
        return result
    }
}
function handleOpen(exitList, data) {
    state.visible = true
    setTimeout(() => {
        FromRendererRef.value.vFormRenderRef.resetForm()
        handleOptions(exitList)
        if (!!data) {
            const pData = data.options ? data.options : {}
            FromRendererRef.value.vFormRenderRef.setFormData({...data,  ...pData})
            state.isEdit = true
            state.setting = data
        } else {
            state.isEdit = false
            state.setting = {}
        }
        setReady()
    })
    function setReady() {
        setTimeout(() => {
            const readyRef = FromRendererRef.value.vFormRenderRef.getWidgetRef('ready')
            readyRef.setValue(true)
        }, 1000)
    }
}
const ignoreList = ['dc:title', 'dc:creator', 'dc:modified', 'dc:lastContributor', 'dc:created', 'dc:publisher', 'dc:contributors', 'common:icon', 'common:icon-expanded', 'uid:uid', 'uid:major_version', 'uid:minor_version', 'file:content', 'files:files', 'nxtag:tags', 'relatedtext:relatedtextresources', 'sec:clearanceLevel', 'sec:securityKeyword']
async function handleOptions (exitList) {
    const idRef = FromRendererRef.value.vFormRenderRef.getWidgetRef('metaData')
    const options = listFilter()
    idRef.loadOptions(options)
    function listFilter() {
        return props.docType.keywords.reduce((prev, item) => {
            const index = exitList.findIndex(exitItem => exitItem.metaData === item.name)
            if (item.type !== 'complex' && !ignoreList.includes(item.name)) {
                item.value = item.name
                item.label = item.name
                if(index === -1) item.disabled = false
                else item.disabled = true
                prev.push(item)
            }
            return prev
        }, []);
    }
}
// #region module: i18n
    const LanguageUnitFormRef = ref()
    function handleMetaChange(lKey) {
        state.lKey = lKey
    }
    async function saveI18n() {
        await LanguageUnitFormRef.value.handleSubmit()
    }
// #endregion
onMounted(async() => {
})
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>
.mg-b {
    margin-bottom: var(--app-padding);
}
</style>
