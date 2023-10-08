

<template>
            <!-- <div class="actionIconContainer">
                <div class="clickCon" @click="popupOpened = true">
                    <el-tooltip content="download" >
                        <el-icon >
                            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M160 832h704a32 32 0 1 1 0 64H160a32 32 0 1 1 0-64zm384-253.696 236.288-236.352 45.248 45.248L508.8 704 192 387.2l45.248-45.248L480 584.704V128h64v450.304z"></path></svg>
                        </el-icon>
                    </el-tooltip>
                </div>
            </div> -->
  <BrowseActionsButton id="downloadActionButton" :label="$t('download')" @click="popupOpened = true">
            <SvgIcon src="/icons/file/download.svg" round content="download"
                        ></SvgIcon>
  </BrowseActionsButton>
            <ElDialog v-model="popupOpened" width="280" append-to-body>
            <div class="popoverContent">
                <!-- download button -->
                <el-button type="text" @click="downloadHandler">Download original</el-button>
                <!-- download as pdf button -->
                <el-button v-if="isPdf" type="text" @click="downloadAsPdfHandler">Download as PDF</el-button>
                <!-- download pdf and annotation -->
                <el-button v-if="isPdf" type="text" @click="downloadPdfAndAnnotationHandler">Download PDF with annotation</el-button>
                <ElDivider />
                <ElForm
                    ref="formRef"
                    :model="form"
                    class="downloadConvertForm"
                    label-position="top"
                >
                    <ElFormItem :label="$t('convert_documentFormat')" prop="targetFile"
                                :rules="[{ required: true, message: $t('form_common_requird')}]">
                        <ElSelect v-model="form.targetFile" value-key="targetFileType">
                            <ElOption v-for="item in supportedFormatList" :key="item.targetFileType" :label="item.targetFileType" :value="item"></ElOption>
                        </ElSelect>
                    </ElFormItem>
                </ElForm>
               
                <ElButton type="primary" @click="handleConfirm">{{ $t('convert_convert') }}</ElButton>  
            </div>
            </ElDialog>
        

</template>

<script lang="ts" setup>
import { DownloadDocApi, downloadDocRecord, getSupportedFormatApi, submitExportRequestApi } from "dp-api"
import { Download } from '@element-plus/icons-vue';
import { ElNotification, ElMessage} from 'element-plus'
import {useEventListener} from "@vueuse/core";
const props = defineProps<{
    doc: any,
    blob: any,
    selected: any[]
}>()
const { doc } = toRefs(props)
const { t } = useI18n()
const popupOpened = ref(false)

const isPdf = ref()
// #region new convert 
const form = ref<any>({
      targetFile: ''
    })
const formRef = ref()
const supportedFormatObject = ref<any>({})
const supportedFormatList = computed(() => {
    const suffix = doc.value.name.split('.').pop()
    if(!supportedFormatObject.value[suffix]) return []
    return filterArrObj(supportedFormatObject.value[suffix], 'targetFileType')
})
const handleConfirm = async () => {
    const vaild = await formRef.value.validate();
      if(!vaild) return

      const param = {
        idOrPath: props.doc.id,
        targetFileType: form.value.targetFile.targetFileType,
        fileType: form.value.targetFile.type,
      }
      const response = await submitExportRequestApi([param])
      console.log(response)
      if (response.result ) {
        ElMessage.success(`${t('convert_transferring')}`)
        formRef.value.resetFields()
        popupOpened.value = false
        // 刷新转档列表
        const ev = new CustomEvent('refresh-conversion-history')
        window.dispatchEvent(ev)
      } else {
        // Message.error(`${i18n.t('responseMsg_errorCode_2')}`)
      }
    }
const handleGetSupportedFormat = async() => {
    if (supportedFormatObject.value instanceof Object && Object.keys(supportedFormatObject.value).length !== 0) return
    const response = await getSupportedFormatApi()
    supportedFormatObject.value = response
}
const filterArrObj = (arr,filterField) =>{
    const newArr = arr.reduce((pre,cur) => pre.some(item => item[filterField] === cur[filterField]) ?
    pre : [...pre,cur],[])
    return newArr
}

onMounted(async () => {
  const ev = new CustomEvent('checkIsPdf')
  document.dispatchEvent(ev)
    await handleGetSupportedFormat()
})



// #endregion
async function downloadHandler(){
    const id = new Date().valueOf() + props.doc.name
    const notification = ElNotification({
          title: '',
          icon: Download,
          dangerouslyUseHTMLString: true,
          message: `<span id="${id}">0%</span> ${props.doc.name}`,
          showClose: false,
          customClass: 'download-notification',
          duration: 0,
          position: 'bottom-right'
        });
    try{
      const blob = await DownloadDocApi(props.doc.id, (e) => {
        const el = document.getElementById(id)
        if(el) el.innerHTML = Math.round((e.loaded / e.total) * 100) + '%'
      })
      await downloadBlob(blob, props.doc.name)
    //   await DownloadDocApi(props.doc.id)
    } catch(error:any) {
        ElMessage.error(t('download_noFile') as string)
    }
    notification.close()
}
async function downloadAsPdfHandler(){
    // TODO : impelment action
    const notification = ElNotification({
          title: '',
          icon: Download,
          dangerouslyUseHTMLString: true,
          message: `${props.doc.name}`,
          showClose: false,
          customClass: 'download-notification',
          duration: 0,
          position: 'bottom-right'
        });
    try{
      console.log("downloadHandler")
      const ev = new CustomEvent('downloadPdf')
      document.dispatchEvent(ev);
        await downloadDocRecord({ idOrPath: props.doc.id, type: 'PDF'})
    } catch(error:any) {
        ElMessage.error(t('download_noFile') as string)
    }
    notification.close()
}

async function downloadPdfAndAnnotationHandler(){
    // TODO : impelment action
    const ev = new CustomEvent('downloadPdfAndAnnotation', { detail: props.doc })
    window.dispatchEvent(ev);
}

useEventListener(document, 'isDocPdf', () => {
  console.log('isDocPdf')
  isPdf.value = true;
})
useEventListener(document, 'notDocPdf', () => {
  console.log('notDocPdf')
  isPdf.value = false;
})
</script>

<style lang="scss" scoped>
.popoverContent{
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;
    gap: var(--app-padding);
    > button{
        width: 100%;
        text-align: left;
    }
}
</style>