<template>
    <div class="actionIconContainer" @click="iconClickHandler">
    <!-- <div> -->
        <!-- <SvgIcon src="/icons/file/share.svg" round content="share"
            @click="iconClickHandler"></SvgIcon> -->
        <el-tooltip content="share">
            <el-icon >
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="m679.872 348.8-301.76 188.608a127.808 127.808 0 0 1 5.12 52.16l279.936 104.96a128 128 0 1 1-22.464 59.904l-279.872-104.96a128 128 0 1 1-16.64-166.272l301.696-188.608a128 128 0 1 1 33.92 54.272z"></path></svg>
            </el-icon>
        </el-tooltip>
        <el-dialog v-model="state.dialogOpened" class="scroll-dialog" append-to-body
            :close-on-click-modal="false"
            :title="$t('share_shareFiles')">
            <FromRenderer ref="FromRendererRef" :form-json="formJson"/>
            <template #footer>
                <el-button @click="handleSubmit"> {{$t('confirm')}} </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElNotification } from 'element-plus'
import { shareRequestApi, getJsonApi } from 'dp-api'
const shareList = inject('selectList')
const props = defineProps<{
    doc: any,
}>()
const state = reactive({
    dialogOpened: false
})
function iconClickHandler(){
    if (shareList.value.length === 0) {
         ElNotification.warning($i18n.t('dpTip_noSelection'))
        return
    }
    state.dialogOpened = true
    // open upload dialog

}
const formJson = getJsonApi('shareRequest.json')
const FromRendererRef = ref()
async function handleSubmit () {
    const formData = await FromRendererRef.value.vFormRenderRef.getFormData()
    const param = {
        emailList: formData.emailList,
        documentIdList: shareList.value.map(item => (item.id)),
        password: formData.password ? formData.password : '',
        tokenLiveInMinutes: diffMinute(formData.dueDate)
        // tokenTime: handleTokenTime(form.value.time,form.value.timeUnit)
    }
    try {
        const response = await shareRequestApi(param)
        if(response.errorCode) throw new Error(res.message || 'error');
        ElMessage.success($i18n.t('share_success'))
        state.dialogOpened = false
    } catch (error) {
        ElMessage.error(error.message)
    }
}
</script>