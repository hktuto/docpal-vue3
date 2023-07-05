<script setup lang="ts">
import {useOffice} from '~/compositbles/office'
const {  host, ready, checkOffice } = useOffice()
const {externalEndpoint} = useSetting()
type Methods = 'message' | 'messageAndAttachments' | 'attachments';
type outlookState = 'waiting' | 'noSelected' | 'multipleSelect' | 'selected' | 'chooseMethod'
const state = ref<outlookState>('waiting')
const methodState = ref<Methods>();
const selectedItem = ref<any>({
  subject:"",
  hasAttachment: false,
});
const isSelectedMultiple = ref(false)

function getAttachmentCallback(result:any, item:any) {
    console.log(result.value, item, selectedItem.value)
  selectedItem.value.attachmentFile.push({
    ...result.value,
    ...item,
  })
}
function selectedChange() {
  Office.context.mailbox.getSelectedItemsAsync((asyncResult:any) => {
    state.value = 'noSelected'
    if (asyncResult.status === Office.AsyncResultStatus.Failed) {
      console.log(asyncResult.error.message);
      return;
    }
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
    if(item.attachments.length > 0) {
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
  Office.context.mailbox.addHandlerAsync(Office.EventType.SelectedItemsChanged, selectedChange, (asyncResult:any) => {
    if (asyncResult.status === Office.AsyncResultStatus.Failed) {
      console.log(asyncResult.error.message);
      return;
    }
    console.log("Event handler added.");
    selectedChange();
  });
}

function chooseMethod(method:Methods) {
  state.value = 'chooseMethod';
  methodState.value = method;
}

function chooseMethodAgain() {
  state.value = 'selected';
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
    <div v-if="ready " class="contentContainer">
      <div v-if="state === 'noSelected'" class="noSelect">
        Please select an email
      </div>
      <div v-else-if="state === 'multipleSelect'">
        please only select one email
      </div>
      <div v-else-if="state === 'selected'" class="selectedContainer">
        <div class="subject">
          {{ selectedItem.subject }}
        </div>
        <el-button type="primary" @click="chooseMethod('message')">Upload Message</el-button>
        <el-button v-if="selectedItem.attachmentFile.length > 0" type="primary" @click="chooseMethod('messageAndAttachments')">Upload Message and Attachments</el-button>
        <el-button v-if="selectedItem.attachmentFile.length > 0" type="primary" @click="chooseMethod('attachments')">Upload Attachments</el-button>
      </div>
      <div v-if="state === 'chooseMethod'" class="chooseMethod">
        
        {{ methodState }}
        <el-button @click="chooseMethodAgain">back</el-button>
      </div>
    </div>
    <div v-else>
      Loading
    </div>
  </NuxtLayout>
</template>

<style scoped>
.selectedContainer{
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
</style>