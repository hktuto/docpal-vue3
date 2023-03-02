<template>
<el-dialog v-model="dialogVisible" :title="$t('addColumn')">
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
    <template #footer>
        <el-button @click="dialogVisible = false">{{$t('cancel')}}</el-button>
        <el-button @click="handleAdd">{{$t('add')}}</el-button>
    </template>
</el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import onMountedEditorVue from '../../../libraries/v-from/src/components/form-designer/setting-panel/property-editor/event-handler/onMounted-editor.vue'
import { trashType, propListGet, getFilterArr, getPropType } from '../../dp-components/stores/index'
const dialogVisible = ref(false)
function handleOpen() {
    dialogVisible.value = true
}
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
    const rules = reactive<FormRules>({})
// #endregion
function getForm () {
    return deepCopy(form)
}
const emit = defineEmits(['add'])
function handleAdd () {
    emit('add', deepCopy(form))
    dialogVisible.value = false
}
defineExpose({ handleOpen })
</script>

<style scoped lang="scss">
</style>
