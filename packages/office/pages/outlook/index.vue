<script setup lang="ts">
import {useOffice} from '~/compositbles/office'
const {  host, ready, checkOffice, platform } = useOffice()
const {externalEndpoint} = useSetting()
type Methods = 'message' | 'messageAndAttachments' | 'attachments';
type outlookState = 'waiting' | 'noSelected' | 'multipleSelect' | 'selected' | 'chooseMethod' | 'uploading' | 'finish'
const state = ref<outlookState>('waiting')
const methodState = ref<Methods>();
const selectedItem = ref<any>({
  subject:"",
  hasAttachment: false,
});
const isSelectedMultiple = ref(false)
const uploadQueue = ref([]);
function getAttachmentCallback(result:any, item:any) {
  console.log(result)
  // check item.id already in selectedItem attachmentFile
  // if not push
  // if yes, replace
  const i = selectedItem.value.attachmentFile.findIndex((i:any) => i.id === item.id);
  if (i === -1) {
    selectedItem.value.attachmentFile.push({
      ...item,
      ...result.value,
      
    })
    return;
  }
}

function getSelected() {
  console.log('getSelected');
  const item = Office.context.mailbox.item
  console.log(item, ready.value)
  if(!item) {
    state.value = 'noSelected'
    return ;
  }
  selectedItem.value = item
  selectedItem.value.attachmentFile = [];
  state.value = 'selected'
  if( item.attachments.length > 0) {
    
      for( let i=0; i < item.attachments.length; i ++) {
        item.getAttachmentContentAsync(item.attachments[i].id, (res:any) => getAttachmentCallback(res, item.attachments[i]));
      }
    }
}
function selectedChange() {
  
  Office.context.mailbox.getSelectedItemsAsync((asyncResult:any) => {
    state.value = 'noSelected'
    selectedItem.value.attachmentFile = []
    uploadQueue.value = [];
    if (asyncResult.status === Office.AsyncResultStatus.Failed) {
      console.log(asyncResult.error.message);
      return;
    }
    console.log('selectedChange', asyncResult.value) 
    // reset all 
    selectedItem.value = null
    if(asyncResult.value.length === 0) {
      state.value = 'noSelected'
      return ;
    }
    isSelectedMultiple.value = !(asyncResult.value.length === 1)
    if(isSelectedMultiple.value) {
      state.value = 'multipleSelect'
      return
    }
    state.value = 'selected'
    const item = Office.context.mailbox.item
    selectedItem.value = item
    selectedItem.value.attachmentFile = [];
    if(asyncResult.value[0].hasAttachment && item.attachments.length > 0) {
      for( let i=0; i < item.attachments.length; i ++) {
        item.getAttachmentContentAsync(item.attachments[i].id, (res:any) => getAttachmentCallback(res, item.attachments[i]));
      }
    }
    // if hasAttachment is true, 
    // loop all attachment and push 

  })
}
function initOutlook() {
  // register outlook event listener
  getSelected();
  if(platform.value === 'OfficeOnline' || platform.value === 'Mac') {
    
    return ;
  }
  // Office.context.mailbox.addHandlerAsync(Office.EventType.SelectedItemsChanged, selectedChange, (asyncResult:any) => {
  //   console.log(asyncResult)
  //   if (asyncResult.status === Office.AsyncResultStatus.Failed) {
  //     console.log(asyncResult.error.message);
  //     return;
  //   }
  //   console.log("Event handler added.");
  //   selectedChange();
  // });
}

function chooseMethod(method:Methods) {
  state.value = 'chooseMethod';
  methodState.value = method;
}

function chooseMethodAgain() {
  state.value = 'selected';
}

function toUpload(form:any) {
  uploadQueue.value.push(...form);
  state.value = 'uploading'
}

function uploadFinish(){
  console.log('upload finish')
  state.value = 'finish'
}

onMounted(() => {
  checkOffice()
})

watch( ready, (isReady) => {
  if(isReady) {
    state.value = 'noSelected'
    initOutlook()
  }else{
    state.value = 'waiting'
  }
})
</script>

<template>
  <NuxtLayout  name="addin" :pageTitle="host">
    <div v-if="state !== 'waiting' " class="contentContainer">
      <div v-if="state === 'noSelected'" class="noSelect">
        Please select an email
      </div>
      <div v-else-if="state === 'multipleSelect'">
        please only select one email
      </div>
      <div v-else-if="state === 'selected'" class="selectedContainer">
        <el-button size="large" type="primary" @click="chooseMethod('message')">Upload Message</el-button>
        <template v-if="platform === 'OfficeOnline'">
          Attachment is not supported in Office Online
        </template>
        <el-button size="large" v-if="selectedItem.attachmentFile.length > 0" type="primary" @click="chooseMethod('messageAndAttachments')">Upload Message and Attachments</el-button>
        <el-button size="large" v-if="selectedItem.attachmentFile.length > 0" type="primary" @click="chooseMethod('attachments')">Upload Attachments</el-button>
      </div>
      <div v-else-if="state === 'chooseMethod'" class="chooseMethod">
        <div v-if="methodState === 'message' " class="messageOnly">
          <div class="title">
            Upload Email Message Only
          </div>
          <OfficeAddinOutlookUploadMessage :item="selectedItem" @back="chooseMethodAgain" @submit="toUpload"/>
        </div>
        <div v-else-if="methodState === 'messageAndAttachments' " class="messageAndAttachments">
          <div class="title">
            Upload Email Message and Attachments
          </div>
          <OfficeAddinOutlookUploadMessageAndAttachments :item="selectedItem" :attachments="selectedItem.attachmentFile" @back="chooseMethodAgain" @submit="toUpload"/>
        </div>
        <div v-else-if="methodState === 'attachments' " class="attachments">
          <div class="title">
            Upload Email Attachments
          </div>
          <OfficeAddinOutlookUploadAttachments :attachments="selectedItem.attachmentFile" @back="chooseMethodAgain" @submit="toUpload" />
        </div>
      </div>
      <div v-else-if="state === 'uploading'" class="uploading">
        <OfficeAddinOutlookUpload :items="uploadQueue" @finish="uploadFinish" />
      </div>
      <div v-else-if="state === 'finish'" class="finish">
        Upload Success
      </div>
    </div>
    <div v-else>
      Loading...
    </div>
  </NuxtLayout>
</template>

<style scoped>
.contentContainer{
  height: 100%;
  overflow: auto;
  > * {
    height: 100%;
  }
}
.selectedContainer{
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  gap: var(--app-padding);
  .subject{
    font-size: 1.2rem;
    margin-block: var(--app-padding);
  }
}
.finish {
  display: grid;
  place-items: center;
  font-size: 1.5rem;
  color: var(--primary-color);
}
</style>