<template>
<el-dialog v-model="state.visible" :title="state.isEdit ? $t('docType_editCaptureProfile') : $t('docType_addCaptureProfile')"
    :close-on-click-modal="false"
    >
    <el-form v-loading="state.pathLoading" :model="formData" ref="FormRef" label-position="top" @submit.native.prevent>
        <el-form-item :label="$t('docType_profileName')"
                prop="profileName"
                :rules="[{ required: true, message: $t('form_common_requird')}]"
        >
            <el-input type="text" v-model="formData.profileName" />
        </el-form-item>
        <el-form-item :label="$t('dpTable_rootPath')"
                prop="rootPath"
                :rules="[{ required: true, message: $t('form_common_requird')}]"
        >
            <el-cascader v-model="formData.rootPath" :props="state.cascaderProps" filterable clearable></el-cascader>
        </el-form-item>
    </el-form>
    <TreeTableForm ref="TreeTableFormRef" :columns="tableSetting.columns" :table-data="state.tableData"
        :treeTableFormRule="state.rules"
        :options="state.options"></TreeTableForm>
    <template #footer>
        <el-button :loading="state.loading" @click="handleSubmit()">{{$t('common_submit')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { SaveDocumentTypeProfileApi, getDocTypeListApi,
    GetChildThumbnail,
    GetBreadcrumb,
    checkNameOrTitleApi,
    getJsonApi,
    TABLE, defaultTableSetting, deepCopy } from 'dp-api'
const props = defineProps<{
    docType: any
}>()
const emits = defineEmits([
    'refresh'
])
const FormRef = ref()
const TreeTableFormRef = ref()
const tableKey = TABLE.ADMIN_BULK_IMPORT_CONFIG_FORM
const tableSetting = defaultTableSetting[tableKey]
const route = useRoute()
const user = useUser();
const state = reactive({
    pathLoading: false,
    loading: false,
    visible: false,
    isEdit: false,
    profileID: '',
    rules: {
        'title': [
            { validator: handleCheckNameOrTitle, trigger: 'blur' }
        ],
        'name': [
            { validator: handleCheckNameOrTitle, trigger: 'blur' }
        ]
    },
    options: {
        rowKey: 'dpRowId',
        childLen: 1
    },
    tableData: [],
    cascaderProps: {
        checkStrictly: true,
        lazy: true,
        lazyLoad (node, resolve) {
            const { level, value } = node;
            const idOrPath = level == 0 ? "/" : value
            setTimeout(async() => {
                let res = await GetChildThumbnail({idOrPath})
                const nodes = res.entryList.reduce((prev, item) => { 
                    if (item.isFolder) prev.push({
                        value: item.path,
                        label: item.name
                    })
                    return prev
                }, [])
                // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                resolve(nodes)
            })
        }
    }
})
const formData = reactive({
    profileID: '',
    profileName: '',
    rootPath: []
})
async function handleCheckNameOrTitle (rule, value, callback) {
    if (value === '') {
        callback(new Error($i18n.t('form_common_requird') as string))
    } else {
        const res = await checkNameOrTitleApi({ nameOrTitle: value})
        if (Number(res.Code) === 500) {
            callback(new Error(res.Message))
        }
        callback()
    }
}
const formJson = getJsonApi('admin/adminMetaRelated.json')
async function handleSubmit () {
    state.loading = true
    try {
        const configTree = await TreeTableFormRef.value.getFormData()
        const configData = await getFormData()
        if (!configTree || !configData) return false
        const params = {
            folder: getFolder(configTree),
            documentType: route.params.id,
            profileName: configData.profileName,
            rootPath: configData.rootPath.pop(),
        }
        if(state.profileID) params.profileID = state.profileID
        await SaveDocumentTypeProfileApi(params)
        state.visible = false
        emits('refresh')
    } catch (error) {
        
    }
    state.loading = false
}
async function getFormData () {
    const valid = await FormRef.value.validate((valid, fields) => {
        return valid
    })
    if (!valid) return false
    else return deepCopy(formData)
}
function getFolder (tableData) {
    const result = <any>{}
    tableData.forEach(item => {
        result.name = item.name
        result.title = item.title
        if (item.children && item.children.length > 0) {
            result.folder = getFolder(item.children)
        }
    })
    return result
}
function revertFolder (obj, folderList) {
    const folderItem = {
        name: obj.name,
        title: obj.title,
        children: []
    }
    folderList.push(folderItem)
    if (obj.folder) {
        revertFolder(obj.folder, folderItem.children)
    }
}

async function handleOpen(data) {
    state.visible = true
    state.tableData = []
    if (!!data) await revertData(data)
    else {
        formData.profileName = ''
        formData.rootPath = []
    }
    setTimeout(() => {
        TreeTableFormRef.value.initTable()
        FormRef.value.clearValidate()
    })
}
async function revertData (profile) {
    const folder = JSON.parse(profile.folder)
    revertFolder(folder, state.tableData)

    state.pathLoading = true
    state.profileID = profile.profileID
    formData.profileName = profile.profileName
    try {
        const data = await GetBreadcrumb(profile.rootPath)
        formData.rootPath = data.reduce((prev, item) => {
            prev.push(item.path)
            return prev
        }, [])
    } catch (error) {
        formData.rootPath = [profile.rootPath]
    }
    state.pathLoading = false
}

onMounted(async() => {
})
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>
:deep(.el-cascader){
    width: 100%
}
</style>
