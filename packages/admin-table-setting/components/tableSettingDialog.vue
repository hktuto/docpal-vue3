<template>
    <el-dialog v-model="dialogVisible" title="Add Column">
        <el-form ref="formRef"
                :model="form"
                :rules="rules"
                label-width="120px"
        >
            <TableSettingFormItem v-model="form.name" prop="name" :label="$t('name')" @change="handleChange"></TableSettingFormItem>
            <div class="flex-x-between bb">formatList
                <el-button @click="formatListAdd">add</el-button>
            </div>
            <el-card class="bb" v-for="(item, index) in form.formatList" :key="index">
                <template #header>
                    <div class="card-header">
                        <span>Card name</span>
                        <el-button v-if="index === form.formatList.length -1" class="button" text  @click="formatListRemove(index)">Remove</el-button>
                    </div>
                </template>
                <TableSettingFormItem v-model="item.prop" :prop="`formatList.${index}.prop`" :label="$t('prop')"
                    type="select"
                    :fieldOptions="{ options: propList, clearable: true }"
                    @change="formatItemPropChange(item)"></TableSettingFormItem>
                <TableSettingFormItem v-model="item.formatFun" :prop="`formatList.${index}.formatFun`" :label="$t('formatFun')" 
                    type="select"
                    :fieldOptions="{ options: item.formatFunList, clearable: true }"
                    @change="formatItemFunChange(item)"></TableSettingFormItem>
                <TableSettingFormItem v-for="(value, key) in item.params" v-model="item.params[key]" :prop="`formatList.${index}.params.${key}`" :label="$t(key)" @change="handleChange"></TableSettingFormItem>
            </el-card>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="handleSubmit">
                open the inner Dialog
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { CircleCloseFilled } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { trashType, propListGet, getFilterArr, getPropType } from '../stores/index'
// #region module: dialog
    const dialogVisible = ref(false)
    function handleOpen() {
        console.log('in');
        
        dialogVisible.value = true
    }
    function handleClose() {

    }
// #endregion
// #region module: form
    const formRef = ref<FormInstance>()
    const form = reactive({
        name: '888',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        formatList: [{ prop: '', formatFun: '', formatFunList: [], params: {} }],
    })
    const propList = ref(propListGet(trashType))
    function formatListAdd () {
        form.formatList.push({
            prop: '', formatFun: '', params: {}
        })
    }
    function formatListRemove (index) {
        form.formatList.splice(index, 1)
    }
    function formatItemPropChange (formatItem) {
        formatItem.formatFun = ''
        formatItem.params = {}
        formatItem.formatFunList = []
        formatItem.formatFunList = getFilterArr(getPropType(trashType, formatItem.prop))
    }
    function formatItemFunChange (formatItem) {
        formatItem.params = {}
        const funItem = formatItem.formatFunList.find(item => item.value === formatItem.formatFun)
        if (funItem.params) {
            Object.keys(funItem.params).forEach(key => {
                formatItem.params[key] = ''
            })
        }
    }
    function handleChange() {
    }
// #endregion
function handleSubmit () {
    alert(JSON.stringify(form))
}
defineExpose({ handleOpen })
</script>

<style scoped lang="scss">
.bb {
    border-bottom: 1px solid #ddd;
    margin-bottom: var(--app-padding);
}
</style>
