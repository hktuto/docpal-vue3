<template>
    <el-dialog v-model="dialogVisible" :title="title ? title : $t('add')">
        <el-form ref="formRef"
                :model="form"
                label-width="120px"
                label-position="top"
        >
            <el-form-item :label="$t('tableHeader_name')" prop="name"
                :rules="[ { required: true, message: 'Please input email address', trigger: 'change'}]">
                <el-input v-model="form.name" clearable />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="dialogVisible = false">{{$t('cancel')}}</el-button>
            <el-button @click="handleSubmit">{{$t('save')}}</el-button>
        </template>
    </el-dialog>
</template>


<script lang="ts" setup>
const emits = defineEmits(['submit']);
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps<{
    title: string
}>()
const formRef = ref()
const dialogVisible = ref(false)
const form = reactive({
  name: '',
  description: ''
})
function handleClose () {
    dialogVisible.value = false
}
function handleOpen(fileDetail) {
    if (fileDetail) {
        form.name = fileDetail.name
        form.description = fileDetail.description
    }
    dialogVisible.value = true
}
async function handleSubmit() {
    const valid = await formRef.value.validate((valid, fields) => valid)
    if (!valid) return
    emits('submit', deepCopy(form))
    dialogVisible.value = false
}
defineExpose({ handleOpen, handleClose })
</script>

<style lang="scss" scoped>
</style>
