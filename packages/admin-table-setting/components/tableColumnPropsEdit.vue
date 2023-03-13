<template>
    <el-dialog v-model="dialogVisible" :title="isEdit ? $t('editDisplayProp') : $t('addDisplayProp')">
        <el-form ref="formRef"
                :model="form"
                label-width="120px"
        >
            <el-form-item :label="$t('prop')" prop="prop"
                :rules="[ { required: true, message: 'Please input email address', trigger: 'change'}]">
                <el-select v-model="form.prop" clearable placeholder="please select prop"
                    @change="formatItemPropChange">
                    <el-option v-for="item in propList" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('formatFun')" prop="formatFun">
                <el-select v-model="form.formatFun" clearable placeholder="please select formatFun"
                    @change="formatItemFunChange">
                    <el-option v-for="item in formatFunList" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item v-for="(paramsValue, paramsKey) in form.params" :label="$t(paramsKey)" :prop="`params.${paramsKey}`">
                <el-input v-model="form.params[paramsKey]" placeholder="please input"></el-input>
            </el-form-item>
        </el-form>
        <!-- <TableSettingFormItem v-model="item.prop" :prop="`formatList.${index}.prop`" :label="$t('prop')"
            type="select"
            :fieldOptions="{ options: propList, clearable: true }"
            @change="formatItemPropChange(item)"></TableSettingFormItem>
        <TableSettingFormItem v-model="item.formatFun" :prop="`formatList.${index}.formatFun`" :label="$t('formatFun')" 
            type="select"
            :fieldOptions="{ options: item.formatFunList, clearable: true }"
            @change="formatItemFunChange(item)"></TableSettingFormItem>
        <TableSettingFormItem v-for="(value, key) in item.params" v-model="item.params[key]" :prop="`formatList.${index}.params.${key}`" :label="$t(key)" @change="handleChange"></TableSettingFormItem> -->
        <template #footer>
            <el-button @click="dialogVisible = false">{{$t('cancel')}}</el-button>
            <el-button @click="handleSave">{{$t('save')}}</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
const tableHelper = useTableHelper()
const state = reactive({
    propList: tableHelper.propListGet(tableHelper.trashType),
    formatFunList: [],
})
const emit = defineEmits(['add', 'save'])
// #region module: dialog
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    function handleOpen(exitFormatItems, formatItem) {
        isEdit.value = formatItem ? true : false
        initFormatItem(formatItem)
        dialogVisible.value = true
    }
// #endregion
// #region module: form
    const formRef = ref<FormInstance>()
    const form = reactive({
    })
    const meta:Table.formatListType = {
        joiner: '',
        prop: '',
        formatFun: '',
        params: {}
    } 
    function formatItemPropChange (prop) {
        form.formatFun = ''
        form.params = {}
        state.formatFunList = []
        state.formatFunList = tableHelper.getTableFilters(tableHelper.getPropType(tableHelper.trashType, prop))
        console.log(state.formatFunList, 'formatItemPropChange');
        
    }
    function formatItemFunChange (fun) {
        form.params = {}
        const funItem = state.formatFunList.find(item => item.value === fun)
        if (funItem.params) {
            Object.keys(funItem.params).forEach(key => {
                form.params[key] = ''
            })
        }
    }
    async function handleSave() {
        const valid = await formRef.value.validate((valid, fields) => valid)
        if (!valid) return
        if (isEdit.value) emit('save', deepCopy(form))
        else emit('add', deepCopy(form))
        dialogVisible.value = false
    }
// #endregion
function initFormatItem (formatItem) {
    state.formatFunList = []
    if (formatItem?.prop) formatItemPropChange(formatItem.prop)
    Object.keys(meta).forEach(key => {
        form[key] = meta[key]
    })
    if (formatItem) {
        Object.keys(formatItem).forEach(key => {
            form[key] = formatItem[key]
        })
    }
    setTimeout(() => {
        formRef.value.clearValidate()
    })
}
const { propList, formatFunList } = toRefs(state) 
defineExpose({ handleOpen })
</script>

<style scoped lang="scss">
.bb {
    border-bottom: 1px solid #ddd;
    margin-bottom: var(--app-padding);
}
</style>
