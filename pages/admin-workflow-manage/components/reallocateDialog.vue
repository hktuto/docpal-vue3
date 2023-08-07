<template>
    <el-dialog v-model="dialogVisible" :title="$t('common_reallocation')">
        <el-form ref="formRef"
                :model="form"
                label-width="120px"
                label-position="top"
                @submit.native.prevent
        >
            <el-form-item :label="$t('workflow_assignee')" prop="assignee"
                :rules="[ { required: true, message: $t('form_common_requird'), trigger: 'change'}]">
                <el-select v-model="form.assignee" filterable clearable
                    style="width: 100%">
                    <el-option v-for="item in state.userList" :key="item.id" :label="item.userId" :value="item.userId"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="handleSubmit">{{$t('submit')}}</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { getUserListApi } from 'dp-api'
const route = useRoute()
const state = reactive({
    userList: []
})
const value1 = ref()
const emit = defineEmits(['submit'])
// #region module: dialog
    const dialogVisible = ref(false)
    async function handleOpen(row) {
        dialogVisible.value = true
        if(row.assignee) {
            form.oldAssignee = row.assignee
            form.assignee = row.assignee
            form.id = row.id
        } else {
            form.oldAssignee = ''
            form.assignee = ''
            form.id = row.id
        }
        state.userList = await getUserListApi()
        state.userList = state.userList.filter(item => item.userId !== row.assignee && item.userId)
    }
// #endregion
// #region module: form
    const formRef = ref<FormInstance>()
    const form = reactive({
        oldAssignee: '',
        assignee: '',
        id: ''
    })
    async function handleSubmit() {
        if (form.oldAssignee && form.oldAssignee === form.assignee) {
            dialogVisible.value = false
            return
        }
        const valid = await formRef.value.validate((valid, fields) => valid)
        if (!valid) return
        emit('submit', deepCopy(form))
        dialogVisible.value = false
    }
// #endregion
defineExpose({ handleOpen })
</script>

<style scoped lang="scss">

</style>
