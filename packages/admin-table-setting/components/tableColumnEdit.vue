<template>
<div>
   
    <el-form ref="formRef"
            :model="form"
            :rules="rules"
            label-position="top"
    >   
        <el-radio-group v-if="typeList" v-model="form.type">
            <el-radio label="">prop</el-radio>
            <el-radio v-for="typeItem in typeList" :key="typeItem" :label="typeItem" >{{typeItem}}</el-radio>
        </el-radio-group>
        <el-form-item :label="$t('header')" prop="label">
            <el-input v-model="form.label" />
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
        <template v-if="form.type === ''">
            <el-form-item  :label="$t('primaryProp')" prop="prop" >
                <el-select v-model="form.prop" placeholder="please select prop"
                    @change="formatItemPropChange">
                    <el-option v-for="item in propList" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <TableColumnProps v-model:formatList="form.formatList"></TableColumnProps>
        </template>
        <template v-else-if="form.type === 'slot'">
            <el-form-item  :label="$t('primaryProp')" prop="prop" >
                <el-select v-model="form.slot" clearable placeholder="please select prop"
                    value-key="slot"
                    @change="slotChange">
                    <el-option v-for="item in state.slotList" :label="item.slot" :value="item" />
                </el-select>
            </el-form-item>
        </template>
        <TableColumnButtons v-else v-model:buttons="form.buttons"></TableColumnButtons>
    </el-form>
</div>
</template>
<script lang="ts" setup>
import { CircleCloseFilled } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { defaultTableSetting } from 'dp-api/src/model/Table'
const props = defineProps<{
    column: Table.Column,
    typeList: Array
}>()
const state = reactive({
    slotList: []
})
const route = useRoute()
const tableHelper = useTableHelper()
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
    Object.keys(metaData).forEach(key => {
        form[key] = metaData[key]
    })
    if (props.column) Object.keys(props.column).forEach(key => {
        form[key] = props.column[key]
    })
    const defaultSlots = defaultTableSetting[route.params.id].slots
    if (defaultSlots) state.slotList = defaultSlots
}
function slotChange (slotItem) {
    const data = { ...deepCopy(form), ...slotItem }
    Object.keys(data).forEach(key => {
        form[key] = data[key]
    })
}
onMounted(() => {
    initForm()
})
defineExpose({ getForm, initForm })
</script>

<style scoped lang="scss">
.bb {
    border-bottom: 1px solid #ddd;
    margin-bottom: var(--app-padding);
}
</style>
