<script lang="ts" setup>
import * as Dom from '@xmldom/xmldom';
import { useEventListener } from '@vueuse/core';
import { getOfficeTokenApi } from 'dp-api';
import * as xpath from 'xpath';
import { ref, toRefs, nextTick } from 'vue'; 
import { getMimeTypeFromDocument } from '../utils/browseHelper';

const {userPreference} = useUser()
const props = defineProps<{
    docId?: string,
    readonly: boolean
    fileType: string
}>()
const { docId } = toRefs(props)
const formEl = ref();
const collaboraUrl = ref('');
const css = ref('');
const ui = ref(`UITheme=${userPreference.value.color};UIMode=notebookbar;TextRuler=false;PresentationStatusbar=false;SpreadsheetSidebar=false;SavedUIState=false;TextSidebar=false;TextToolbar=false`)
const token = ref('')
const xlsxIframe = ref()

async function displayIframe(){

    token.value = await getOfficeTokenApi(props.docId)
    collaboraUrl.value = officeUrl(props.docId)
    
    nextTick(() => {
        formEl.value.submit()
    });
}


const officeUrl = (docId:string) =>{
    let host = window.location.host.replace('admin.', '');
    if(!host.includes('localhost')){
        return `https://office.${host}/browser/85ac843/cool.html?WOPISrc=https://office.${host}/wopi/files/${docId}&access_token=${token.value}?readonly=${props.readonly}&fileType=${props.fileType}`
    }else{
        return `https://office.app4.wclsolution.com/browser/85ac843/cool.html?WOPISrc=https://office.app4.wclsolution.com/wopi/files/${docId}?readonly=${props.readonly}&fileType=${props.fileType}`
    }
}

function gotMessageFromIframe(e:MessageEvent){

   const data = e.data !== 'unchanged' ? JSON.parse(e.data) : undefined;
   if(!data) return
   if(data.MessageId === "App_LoadingStatus"){
    console.log('App_LoadingStatus')
       // set readonly
       
    //    xlsxIframe.value.contentWindow.postMessage(JSON.stringify({
    //             MessageId: "Hide_Menubar",
    //             SendTime: new Date().getTime(),
                
    //     }), '*')
    //    xlsxIframe.value.contentWindow.postMessage(JSON.stringify({
    //             MessageId: "Hide_StatusBar",
    //             SendTime: new Date().getTime(),
                
    //     }), '*')
       
   }
   
}



useEventListener(window, 'message', gotMessageFromIframe)

watch(docId, ()=>{
    if(!docId) return;
    displayIframe()
},{
    immediate: true
})

</script>


<template>
<div class="xlsContainer">
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
}
</style>