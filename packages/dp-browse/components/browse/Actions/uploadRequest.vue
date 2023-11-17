<template>
    <!-- <div class="actionIconContainer" @click="uploadDialog"> -->
      <div>
        <BrowseActionsButton id="uploadRequestActionButton" :label="$t('publicUpload_requestFileUpload')" @click="uploadDialog">
        
        <SvgIcon src="/icons/file/uploadRequest.svg" round content="upload request"
            ></SvgIcon>
        </BrowseActionsButton>
        <!-- <el-tooltip content="upload request">
            <el-icon >
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M544 864V672h128L512 480 352 672h128v192H320v-1.6c-5.376.32-10.496 1.6-16 1.6A240 240 0 0 1 64 624c0-123.136 93.12-223.488 212.608-237.248A239.808 239.808 0 0 1 512 192a239.872 239.872 0 0 1 235.456 194.752c119.488 13.76 212.48 114.112 212.48 237.248a240 240 0 0 1-240 240c-5.376 0-10.56-1.28-16-1.6v1.6H544z"></path></svg>
            </el-icon>
        </el-tooltip> -->
        <el-dialog v-model="state.dialogOpened" class="scroll-dialog" append-to-body
            :close-on-click-modal="false"
            :title="`${$t('publicUpload_requestFileUpload')}`"
            >
            <WorkflowDetailFormRender ref="FromRendererRef" :form-json="formJson"/>
            <template #footer>
              <el-button :loading="state.loading" type="primary" @click="handleSubmit">{{ $t('confirm') }}</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { saveFileRequestListApi, getJsonApi } from 'dp-api'
const emits = defineEmits(['success'])
const props = defineProps<{
    path: string
}>()
const state = reactive({
  loading: false,
  dialogOpened: false
})
function uploadDialog(){
  state.dialogOpened = true
  setTimeout(() => {

    FromRendererRef.value.vFormRenderRef.resetForm()
  })
  // open upload dialog
}
// #region module:
  const formJson = getJsonApi('clientFileRequest.json')
  const FromRendererRef = ref()
  async function handleSubmit () {
    state.loading = true
    try {
      const data = await FromRendererRef.value.getFormData(true, false)
      if (!data) throw new Error(`${$i18n.t('incompleteData')}`);
      if (data.expiredAt) data.expiredAt = data.expiredAt.replace(/.000.*$/, 'Z')
      data.message = data.message.replace(/\r\n|\r|\n/g, '<br/>')
      data.idOrPath = props.path
      const res = await saveFileRequestListApi(data)
      state.loading = false
      if (res.errorCode) throw new Error(res.message || 'error');
      state.dialogOpened = false
      ElMessage.success($i18n.t('publicUpload_success'))
      emits('success')
    } catch (error) {
      ElMessage.error(error.message)
    }
    state.loading = false
  }
// #endregion
</script>