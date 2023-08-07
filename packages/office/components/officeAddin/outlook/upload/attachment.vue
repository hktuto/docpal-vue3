<script setup lang="ts">

import {getJsonApi} from "dp-api";
import {useUpload} from "~/compositbles/upload";
import { base64StringToBlob } from 'blob-util';

const formJson = getJsonApi('office/officeUpload.json')
const {form, docTypeList, fileDocTypeList, docTypeChange, CheckDuplicate} = useUpload()
const FromRendererRef = ref()
const metaForm = ref();

const itemUpdate = ({key,value}:any) => {
  form.metadata[key] = value;
}

const props = defineProps<{
  attachment: any
}>()


async function validate(){
  const from1 = await FromRendererRef.value.vFormRenderRef.getFormData();
  const valid = await metaForm.value.validate();
  if(!valid) throw new Error();
  const path = [...from1.path];
  form.fileName = from1.fileName
  form.path = path.pop()
  await CheckDuplicate()
  const newForm = {...form}
  newForm.emailId = Office.context.mailbox.item.itemId;
  newForm.blob = base64StringToBlob(props.attachment.content, props.attachment.contentType)
  return newForm;
}


onMounted(() => {
  nextTick( () => {
    FromRendererRef.value.vFormRenderRef.setFormData({
      fileName: props.attachment.name
    })
  })
})

defineExpose({
  validate
})

</script>

<template>
  <div class="attachmentItemContainer">
    <div class="fileName">
      {{attachment.name}}
    </div>
    <FromRenderer ref="FromRendererRef" :form-json="formJson" >
      <template v-slot:tableForm>
        <el-form :model="form" ref="metaForm">
          <el-form-item label="Document Type" required prop="docType">
            <el-select v-model="form.docType" @change="docTypeChange" filterable>
              <el-option v-for="item in fileDocTypeList" :key="item.name" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-for="(item, index) in form.displayMeta" :key="item.metaData" :label="$t(item.metaData)" :prop="`metadata.${item.metaData}`" :required="item.isRequire">
            <BrowseInfoMetaEditField :item="item"  @change="itemUpdate"/>
          </el-form-item>
        </el-form>
      </template>
    </FromRenderer>
  </div>
</template>

<style scoped lang="scss">

</style>