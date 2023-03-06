<template>
<div>
    <el-checkbox-group v-model="showTypeList" :min="0" :max="1">
            <!-- slot/render -->
        <el-checkbox v-for="typeItem in ['buttons']" :key="typeItem" :label="typeItem">{{
        typeItem
        }}</el-checkbox>
    </el-checkbox-group>
    <template >
        
    </template>
    <el-form ref="formRef"
            :model="form"
            :rules="rules"
            label-position="top"
    >   
        <el-form-item :label="$t('header')" prop="label">
            <el-input v-model="form.label" />
        </el-form-item>
            
        <el-form-item v-if="!showTypeList.includes('buttons')" :label="$t('prop')" prop="prop" >
            <el-select v-model="form.prop" clearable placeholder="please select prop"
            @change="formatItemPropChange">
            <el-option v-for="item in propList" :label="item.label" :value="item.value" />
        </el-select>
        </el-form-item>
        <el-form-item :label="$t('align')" prop="align">
            <el-radio-group v-model="form.align">
                <el-radio-button label="left" />
                <el-radio-button label="center" />
                <el-radio-button label="right" />
            </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('hide')">
            <el-switch v-model="form.hide" />
        </el-form-item>
        <el-form-item :label="$t('prefixIcon')" prop="prefixIcon">
            <SvgIconSelector v-model:src="form.prefixIcon" />
        </el-form-item>
        <el-form-item :label="$t('suffixIcon')" prop="suffixIcon">
            <SvgIconSelector v-model:src="form.suffixIcon" />
        </el-form-item>
        <TableColumnProps v-if="!showTypeList.includes('buttons')" v-model:formatList="form.formatList"></TableColumnProps>
        <TableColumnButtons v-else v-model:buttons="form.buttons"></TableColumnButtons>
    </el-form>
</div>
</template>
<script lang="ts" setup>
import { CircleCloseFilled } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import onMountedEditorVue from '../../../libraries/v-from/src/components/form-designer/setting-panel/property-editor/event-handler/onMounted-editor.vue'
interface TableProps {
    column: Table.Column
}
const props = defineProps<TableProps>()
const state = reactive({
    showTypeList: []
})
// #region module:  
// #endregion
// #region module: form
    const formRef = ref<FormInstance>()
    const propList = tableHelper.propListGet(tableHelper.trashType)
    const form = reactive({
        type: '',
        label: '',
        prop: '',
        align: 'left',
        hide: false,
        system: false, // 后期兼容不允许删除
        showOverflowTooltip: false,
        formatList: [],
        buttons: []
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
        prefixIcon: '',
        suffixIcon: ''
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
    state.showTypeList = []
    Object.keys(metaData).forEach(key => {
        form[key] = metaData[key]
    })
    if (props.column) Object.keys(props.column).forEach(key => {
        form[key] = props.column[key]
    })
    console.log('???');
    
}
onMounted(() => {
    initForm()
})
const { showTypeList } = toRefs(state)
defineExpose({ getForm, initForm })
</script>

<style scoped lang="scss">
.bb {
    border-bottom: 1px solid #ddd;
    margin-bottom: var(--app-padding);
}
</style>
