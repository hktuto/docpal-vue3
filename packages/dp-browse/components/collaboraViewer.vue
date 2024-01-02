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
    mode.value = mode.value === 'view' ? 'edit' : 'view';
}
const officeUrl = (docId:string) =>{
    const WOPISrc = `https://${OFFICE_END_POINT}/wopi/files/${docId}?fileType=${props.fileType.toUpperCase()}&readonly=${mode.value === 'view'}`
    return `https://${OFFICE_END_POINT}/browser/85ac843/cool.html?lang=${userPreference.value.language.replaceAll('HK', "TW")}&WOPISrc=${encodeURIComponent(WOPISrc)}`;
}

function gotMessageFromIframe(e:MessageEvent){

   const data = e.data !== 'unchanged' ? JSON.parse(e.data) : undefined;
   if(!data) return
   if(data.MessageId === "App_LoadingStatus"){
    console.log('App_LoadingStatus')
     iframeReady.value = true
   }
   if(data.MessageId === "Doc_ModifiedStatus"){
     isModified.value = data.Values.Modified || false
   }
   
   if(data.MessageId === "UI_Save"){
     emit('saved')
   }
   // TODO : check if data is modified, if so , submit refesh event
  // modified "Doc_ModifiedStatus" Values Modified:boolean
  // SAVE Event "UI_Save"
   
}



useEventListener(window, 'message', gotMessageFromIframe)

watch(mode, () =>{
    displayIframe()
})
watch(docId, ()=>{
  console.log('doc or editing chagne')
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
    <div v-if="editable" :class="{editToggleButton:true, iframeReady}" @click="toggleMode">
      {{ $t('collabora.'+mode)}} <SvgIcon :src="mode === 'view' ? '/icons/file/edit.svg' : '/icons/close.svg'"  ></SvgIcon>
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
  left: calc(50% - 75px);
  top: 0;
  width: 150px;
  color: var(--color-grey-0000);
  font-size: 1rem;
  padding: .5rem 1rem;
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