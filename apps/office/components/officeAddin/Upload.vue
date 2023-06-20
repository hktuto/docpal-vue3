<script setup lang="ts">

import {useUpload} from "~/compositbles/upload";
import {getJsonApi} from "dp-api";
import {ElNotification} from "element-plus";
const formJson = getJsonApi('office/officeUpload.json')
const FromRendererRef = ref();
const metaForm = ref();
const {status, Upload, form, docTypeList, docTypeChange} = useUpload()

async function confirmForm() {
  try{
    
  const from1 = await FromRendererRef.value.vFormRenderRef.getFormData();
  const valid = await metaForm.value.validate();
  form.fileName = from1.fileName
  form.path = from1.path.pop()
  if(!valid) return;
  await Upload();
  ElNotification({
    title: 'Success',
    message: 'Upload Success',
    type: 'success'
  })
  }catch(e){
    console.log(e);
  }
}

const itemUpdate = ({key,value}:any) => {
  form.metadata[key] = value;
}
</script>

<template>
  <div class="UploadContainer">
    <FromRenderer ref="FromRendererRef" :form-json="formJson" >
      <template v-slot:tableForm>
        <el-form :model="form" ref="metaForm">
          <el-form-item label="Document Type" required prop="docType">
            <el-select v-model="form.docType" @change="docTypeChange" filterable>
              <el-option v-for="item in docTypeList" :key="item.name" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-for="(item, index) in form.displayMeta" :key="item.metaData" :label="$t(item.metaData)" :prop="`metadata.${item.metaData}`" :required="item.isRequire">
            <BrowseInfoMetaEditField :item="item"  @change="itemUpdate"/>
          </el-form-item>
        </el-form>
      </template>
    </FromRenderer>
    <el-button v-if="status === 'NOT_STARTED'" type="primary" size="large" @click="confirmForm">Upload</el-button>
  </div>
</template>

<style scoped lang="scss">

</style>