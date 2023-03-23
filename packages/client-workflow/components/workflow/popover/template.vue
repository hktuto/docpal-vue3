<template>
    <el-dialog v-model="dialogVisible" :title="$t('addButton')"
        destroy-on-close append-to-body :close-on-click-modal="false">
        <el-form ref="formRef"
                :model="form"
                label-width="120px"
                label-position="top"
        >
            <el-form-item :label="$t('tableHeader_emailList')" prop="emailList"
                :rules="[ { required: true, message: $t('form_common_requird'), trigger: 'change'}]">
                <el-select v-model="form.emailList"
                    filterable multiple clearable allow-create 
                    style="width: 100%">
                    <el-option v-for="item in userList" :key="item.email" :label="`${item.username} <${item.email}>`" :value="item.email"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('share_shareLink')">
                <el-input v-model="shareLink" readonly type="text" 
                    class="cursorPointer"
                    @click="handleCopy(shareLink)">
                    <template #suffix>
                        <el-icon @click="handleCopy(shareLink)"><CopyDocument /></el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item :label="$t('share_password')" prop="password"
                        :rules="[{ required: true, message: $t('form_common_requird')}]">
                        <el-input v-model="form.password" type="text" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('tableHeader_dueDate')" prop="dueDate"
                        :rules="[{ required: true, message: $t('form_common_requird')}]">
                        <el-date-picker v-model="form.dueDate" 
                                        type="datetime"
                                        :default-time="defaultTime"
                                        :shortcuts="shortcuts" 
                                        style="width: 100%"/>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <el-button @click="dialogVisible = false">{{$t('cancel')}}</el-button>
            <el-button @click="handleSubmit">{{$t('submit')}}</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { CopyDocument } from '@element-plus/icons-vue'
import { getUserListApi } from 'dp-api'
import type { FormInstance } from 'element-plus'
import { useI18n } from "vue-i18n";
const { externalEndpoint } = toRefs(useSetting())
const { t } = useI18n();
const route = useRoute()
const state = reactive({
    userList: [],
    shareLink: '',
    defaultTime: new Date(2000, 1, 1, 23, 59, 59),
    shortcuts: [
        {
            text: `1 ${t('common_day')}`,
            value: () => {
                const date = new Date();
                date.setTime(date.getTime() + 3600 * 1000 * 24);
                return date
            }
        },
        {
            text: `7 ${t('common_days')}`,
            value: () => {
                const date = new Date();
                date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
                return date
            },
        },
        {
            text: `30 ${t('common_days')}`,
            value: () => {
                const date = new Date();
                date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
                return date
            },
        },
    ]
})
const value1 = ref()
const emit = defineEmits(['submit'])
// #region module: dialog
    const dialogVisible = ref(false)
    function handleOpen(shareInfo) {
        initFormatItem(shareInfo)
        dialogVisible.value = true
    }
// #endregion
// #region module: form
    const formRef = ref<FormInstance>()
    const form = reactive({
        emailList: [],
        password: '',
        dueDate: ''
    })
    async function handleSubmit() {
        const valid = await formRef.value.validate((valid, fields) => valid)
        if (!valid) return
        emit('submit', deepCopy(form))
        dialogVisible.value = false
    }
// #endregion
function initFormatItem (shareInfo) {
    form.emailList = shareInfo.emailList
    form.password = shareInfo.password || ''
    form.dueDate = shareInfo.expiredDate
    const origin = externalEndpoint?.value?.upload
    state.shareLink = `${origin}/share?token=${shareInfo.accessToken}`
    setTimeout(() => {
        formRef.value.clearValidate()
    })
}
function handleCopy (copyContent: string) {
    copy(copyContent, t('common_copySuccess'))
}
onMounted(async() => {
    state.userList = await getUserListApi()  
})
const { defaultTime, shortcuts, shareLink, userList } = toRefs(state) 
defineExpose({ handleOpen })
</script>

<style scoped lang="scss">

</style>
