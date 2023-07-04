<script setup lang="ts">
import {useOffice} from '~/compositbles/office'
const { result, ext, host, ready, checkOffice } = useOffice()
const {externalEndpoint} = useSetting()

const selectedItem = ref<any>();
const isSelectedMultiple = ref(false)
function selectedChange() {
  Office.context.mailbox.getSelectedItemsAsync((asyncResult:any) => {
    if (asyncResult.status === Office.AsyncResultStatus.Failed) {
      console.log(asyncResult.error.message);
      return;
    }
    console.log("items", asyncResult.value)
    isSelectedMultiple.value = asyncResult.value.length > 1;
    // asyncResult.value.forEach(item => {
    //   const listItem = document.createElement("li");
    //   listItem.textContent = item.subject;
    //   list.appendChild(listItem);
    // });
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

onMounted(() => {
  checkOffice()
})

watch( ready, (isReady) => {
  if(isReady) initOutlook()
})
</script>

<template>
  <NuxtLayout  name="addin" :pageTitle="host">
    <div v-if="ready" class="contentContainer">
      <div v-if="isSelectedMultiple">
        please only select one email
      </div>
      <div v-else>
        add button
      </div>
    </div>
    <div v-else>
      Loading
    </div>
  </NuxtLayout>
</template>

<style scoped>

</style>