<script setup lang="ts">

import {getJsonApi} from "dp-api";
import {useUpload} from "~/compositbles/upload";

const formJson = getJsonApi('office/officeUpload.json')
const {form, docTypeList, docTypeChange, CheckDuplicate} = useUpload()
const FromRendererRef = ref()
const metaForm = ref();
const props = defineProps<{
  item: any
}>();
const itemUpdate = ({key,value}:any) => {
  form.metadata[key] = value;
}

const emits = defineEmits(['submit','back'])
async function getMessage() {
  const body =  Office.context.mailbox.item.body;
  const toFromText = `
    from : ${Office.context.mailbox.item.from.displayName}<${Office.context.mailbox.item.from.emailAddress}>
    to : ${Office.context.mailbox.item.to.map(item => (item.displayName + '<' + item.emailAddress + '>')).join(', ')}
    cc : ${Office.context.mailbox.item.cc.map(item => (item.displayName + '<' + item.emailAddress + '>')).join(', ')}
    bcc : ${Office.context.mailbox.item.bcc.map(item => (item.displayName + '<' + item.emailAddress + '>')).join(', ')}
    
    subject :  Office.context.mailbox.item.subject
  `
  body.getAsync(Office.CoercionType.Html, function (asyncResult) {
    if (asyncResult.status !== Office.AsyncResultStatus.Succeeded) {
      // do something with the error
      console.log('error', asyncResult);
    } else {
      const parser = new DOMParser();
      const doc = parser.parseFromString(asyncResult.value, "text/html");
      const div = doc.createElement('div')
      div.innerText = toFromText;
      div.style.width = '100%';
      div.style.display = 'block';
      div.style.marginBottom = '24px';
      doc.body.insertBefore(div, doc.body.firstChild);
      // create html file to File
      emits('submit', [{...form,
        emailId: Office.context.mailbox.item.itemId,
        blob: new Blob([doc.documentElement.innerHTML], {type: 'text/html'})
      }]);
    }
  });
}

async function submit() {
  try {
    const from1 = await FromRendererRef.value.vFormRenderRef.getFormData();
    const valid = await metaForm.value.validate();
    if(!valid) return;
    const path = [...from1.path];
    form.fileName = from1.fileName
    form.path = path.pop()
    await CheckDuplicate()
    await getMessage()
    if(!valid) return;
    
    
  }catch(err){
    console.log(err)
  }
  
}

function back() {
  emits('back')
}

onMounted(() => {
  nextTick(async() => {
    FromRendererRef.value.vFormRenderRef.setFormData({
        fileName: props.item.subject
      })
  })
  // 
})

</script>

<template>
  <div class="uploadContainer">
    
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
    <el-button @click="back">back</el-button>
    <el-button type="primary" @click="submit">Next</el-button>
  </div>
</template>

<style scoped lang="scss">
.title{
  font-size: 1.2rem;
  color: var(--primary-color);
  line-height: 1.2;
}
</style>