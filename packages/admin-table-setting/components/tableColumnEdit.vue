<template>
<div>
        <el-form ref="formRef"
                :model="form"
                :rules="rules"
                label-width="120px"
        >
            <el-form-item label="prop" prop="prop">
                <el-select v-model="form.prop" clearable placeholder="please select prop"
                @change="formatItemPropChange">
                <el-option v-for="item in propList" :label="item.label" :value="item.value" />
            </el-select>
            </el-form-item>
            <el-form-item label="label" prop="label">
                <el-input v-model="form.label" />
            </el-form-item>
            <el-form-item label="align" prop="align">
                <el-radio-group v-model="form.align">
                    <el-radio-button label="left" />
                    <el-radio-button label="center" />
                    <el-radio-button label="right" />
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('hide')" prop="hide">
                <el-switch v-model="form.hide" />
            </el-form-item>
        </el-form>
        <TableColumnProps v-model:formatList="form.formatList"></TableColumnProps>
</div>
</template>

<script lang="ts" setup>
import { CircleCloseFilled } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import onMountedEditorVue from '../../../libraries/v-from/src/components/form-designer/setting-panel/property-editor/event-handler/onMounted-editor.vue'
import { trashType, propListGet, getFilterArr, getPropType } from '../../dp-components/stores/index'
interface TableProps {
    column: Table.Column
}
const props = defineProps<TableProps>()
// #region module: form
    const formRef = ref<FormInstance>()
    const propList = propListGet(trashType)
    const form = reactive({
        type: '',
        label: '',
        prop: '',
        align: 'left',
        hide: false,
        system: false, // 后期兼容不允许删除
        showOverflowTooltip: false,
        formatList: [],
    })
    const metaData:Table.Column = {
        type: '',
        label: '',
        prop: '',
        align: 'left',
        hide: false,
        system: false, // 后期兼容不允许删除
        showOverflowTooltip: false,
        formatList: [],
    }
    const rules = reactive<FormRules>({
        name: [
            { required: true, message: 'Please el-input Activity name', trigger: 'blur' },
            { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
        ],
        // date1: [
        //     {
        //         type: 'date',
        //         required: true,
        //         message: 'Please pick a date',
        //         trigger: 'change',
        //     },
        // ]
    })
    function handleChange() {
    }
// #endregion
function getForm () {
    return deepCopy(form)
}
function initForm () {
    Object.keys(metaData).forEach(key => {
        form[key] = metaData[key]
    })
    Object.keys(props.column).forEach(key => {
        form[key] = props.column[key]
    })
}
watch(() => props.column, (newValue) => {
    initForm()
}, { immediate: true })
defineExpose({ getForm, initForm })
</script>

<style scoped lang="scss">
.bb {
    border-bottom: 1px solid #ddd;
    margin-bottom: var(--app-padding);
}
</style>
