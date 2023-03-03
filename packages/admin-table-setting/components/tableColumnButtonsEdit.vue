<template>
    <el-dialog v-model="dialogVisible" :title="isEdit ? $t('editButton') : $t('addButton')">
        <el-form ref="formRef"
                :model="form"
                label-width="120px"
        >
            <el-form-item :label="$t('content')" prop="name"
                :rules="[ { required: true, message: 'Please input email address', trigger: 'change'}]">
                <el-input v-model="form.name" clearable />
            </el-form-item>
            <el-form-item :label="$t('command')" prop="command" >
                <el-select v-model="form.command" clearable>
                    <el-option v-for="item in commandList" :key="item" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('buttonType')" prop="type" >
                <el-radio-group v-model="form.type">
                    <el-radio v-for="item in typeList" :key="item" :label="item">
                        <el-button :type="item">{{$t(item)}}</el-button>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('buttonSize')" prop="size" >
                <el-radio-group v-model="form.size">
                    <el-radio v-for="item in sizeList" :key="item" :label="item">
                        <el-button :size="item">{{$t(item)}}</el-button>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="dialogVisible = false">{{$t('cancel')}}</el-button>
            <el-button @click="handleSave">{{$t('save')}}</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { defaultTableBaseSetting } from 'dp-api/src/model/Table'
// 'primary' | 'success' | 'warning' | 'danger' | 'info'
import type { FormInstance, FormRules } from 'element-plus'
const route = useRoute()
const state = reactive({
    commandList: [],
    sizeList: ['large', 'default', 'small'],
    typeList: ['default','primary', 'success', 'warning', 'danger', 'info']
})
const emit = defineEmits(['add', 'save'])
// #region module: dialog
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    function handleOpen(buttonItem) {
        isEdit.value = buttonItem ? true : false
        initFormatItem(buttonItem)
        dialogVisible.value = true
    }
// #endregion
// #region module: form
    const formRef = ref<FormInstance>()
    const form = reactive({
    })
    const meta:Table.ButtonItem = {
        name: '',
        command: '',
        size: '',
        type: 'primary',
    } 
    async function handleSave() {
        const valid = await formRef.value.validate((valid, fields) => valid)
        if (!valid) return
        if (isEdit.value) emit('save', deepCopy(form))
        else emit('add', deepCopy(form))
        dialogVisible.value = false
    }
// #endregion
function initFormatItem (buttonItem) {
    state.commandList = defaultTableBaseSetting[route.params.id].commands
    Object.keys(meta).forEach(key => {
        form[key] = meta[key]
    })
    if (buttonItem) {
        Object.keys(buttonItem).forEach(key => {
            form[key] = buttonItem[key]
        })
    }
    setTimeout(() => {
        formRef.value.clearValidate()
    })
}
const { commandList, typeList, sizeList } = toRefs(state) 
defineExpose({ handleOpen })
</script>

<style scoped lang="scss">
.bb {
    border-bottom: 1px solid #ddd;
    margin-bottom: var(--app-padding);
}
</style>
