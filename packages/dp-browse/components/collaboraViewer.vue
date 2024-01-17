<script lang="ts" setup>
import {useEventListener} from '@vueuse/core';
import {getOfficeTokenApi} from 'dp-api';
import {nextTick, ref, toRefs} from 'vue';

const {userPreference} = useUser()
const {public:{OFFICE_END_POINT}} = useRuntimeConfig()
const props = defineProps<{
    docId?: string,
    readonly: boolean
    editable: boolean
    fileType: string
}>()
const { docId } = toRefs(props)
const iframeReady = ref(false)
const editing = ref(props.readonly);
const mode = ref<'view' | 'edit'>('view');
const isModified = ref(false);
const formEl = ref();
const collaboraUrl = ref('');
const css = ref('');
const ui = ref(`UITheme=${userPreference.value.color};UIMode=notebookbar;TextRuler=false;PresentationStatusbar=false;SpreadsheetSidebar=false;SavedUIState=false;TextSidebar=false;TextToolbar=false`)
const token = ref('')
const xlsxIframe = ref()
const emit = defineEmits(['saved'])
async function displayIframe(){
  console.log("displayIframe")
  iframeReady.value = false;
    token.value = await getOfficeTokenApi(props.docId, props.fileType)
    collaboraUrl.value = officeUrl(props.docId)
    
    nextTick(() => {
        formEl.value.submit()
    });
}

function refresh(){
    displayIframe()
}


function toggleMode() {
    if(!editing.value) return
  if(mode.value === 'view') {
    mode.value = 'edit';
  } else {
    // check 
    console.log("Doc_ModifiedStatus", isModified.value)
    if(isModified.value){
      const confirmSave = confirm("Data will auto save when you close, are you sure?");
      if(!confirmSave) return
      // save 
      xlsxIframe.value.contentWindow.postMessage(JSON.stringify({
        MessageId: "Action_Save",
        Values: {
          DontTerminateEdit: false,
          DontSaveIfUnmodified: true,
          Notify:true
        }
      }), '*');
      window.location.reload();
    }else{
      mode.value = 'view';
    }
    
  }
}
const officeUrl = (docId:string) =>{
    const WOPISrc = `https://${OFFICE_END_POINT}/wopi/files/${docId}?fileType=${props.fileType.toUpperCase()}&readonly=${mode.value === 'view'}`
    return `https://${OFFICE_END_POINT}/browser/85ac843/cool.html?lang=${userPreference.value.language.replaceAll('HK', "TW")}&WOPISrc=${encodeURIComponent(WOPISrc)}`;
}

function gotMessageFromIframe(e:MessageEvent){
  
   const data = e.data !== 'unchanged' ? JSON.parse(e.data) : undefined;
   if(!data) return
  console.log(data)
   if(data.MessageId === "App_LoadingStatus"){
    console.log('App_LoadingStatus')
     iframeReady.value = true
     return
   }
   if(data.MessageId === "App_LoadingStatus"){
     // Values.success = load success or not
   }
   if(data.MessageId === "Doc_ModifiedStatus"){
     isModified.value = data.Values.Modified || false
     return
   }
   
  isModified.value = false;
   if(data.MessageId === "UI_Save"){
     emit('saved')
     return
   }
   
}



useEventListener(window, 'message', gotMessageFromIframe)

watch(mode, () =>{
    displayIframe()
})
watch(docId, ()=>{
    displayIframe()
},{
    immediate: true
})

defineExpose({
  refresh
})

</script>


<template>
<div class="xlsContainer">
    <div  :class="{editToggleButton:true, iframeReady}" @click="toggleMode">
      {{ $t('collabora.'+mode)}} <SvgIcon v-if="editable" :src="mode === 'view' ? '/icons/file/edit.svg' : '/icons/close.svg'"  ></SvgIcon>
    </div>
    <form ref="formEl" :action="collaboraUrl" enctype="multipart/form-data" method="post" target="collabora-online-viewer" id="collabora-submit-form">
        <input name="css_variables" :value="css" type="hidden" id="css-variables"/>
        <input name="ui_defaults" :value="ui" type="hidden" id="ui-defaults"/>
        <input name="access_token" :value="token" type="hidden" id="access-token"/>
    </form>
    <iframe ref="xlsxIframe" id="xlsxIframe" class="xlsxIframe" frameborder="0" name="collabora-online-viewer" ></iframe>
</div>
</template>

<style lang="scss" scoped>
.xlsContainer{
    width:100%;
    height:100%;
  position: relative;
}
#xlsxIframe{
    width: 100%;
    height: 100%;
  border-radius: var(--app-padding);
}
.editToggleButton{
  --icon-color: var(--color-grey-0000);
  --icon-size: .8rem;
  position: absolute;
  left: calc(50% - 60px);
  top: 0;
  width: 120px;
  color: var(--color-grey-0000);
  font-size: .8rem;
  padding: .5rem .5rem;
  display: flex;
  gap:calc( var(--app-padding) / 2 );
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  background: var(--primary-color);
  border-radius: var(--app-padding);
  border: 1px solid #ccc;
  z-index: 2;
  opacity: 0;
  &.iframeReady{
    opacity: 1;
  }
}
</style>