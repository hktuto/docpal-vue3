<script lang="ts" setup>
import * as Dom from '@xmldom/xmldom';
import { useEventListener } from '@vueuse/core';
import { getOfficeTokenApi } from 'dp-api';
import * as xpath from 'xpath';
import { ref, toRefs, nextTick } from 'vue'; 
import { getMineTypeFromDocument } from '../utils/browseHelper';
const props = defineProps<{
    doc: any
}>()
const { doc } = toRefs(props)
const formEl = ref();
const collaboraUrl = ref('');
const css = ref('--co-primary-element: #4c566a;--co-body-bg=#FFF;--co-txt-accent=#2e1a47;');
const ui = ref('UITheme=light;UIMode=notebookbar;TextRuler=false;PresentationStatusbar=false;SpreadsheetSidebar=true;SavedUIState=false;SpreadsheetToolbar=false;TextSidebar=true;TextToolbar=false')
const token = ref('')
const xlsxIframe = ref()

async function displayIframe(){

    token.value = await getOfficeTokenApi(props.doc.id)
    collaboraUrl.value = officeUrl(props.doc.id)
    
    nextTick(() => {
        formEl.value.submit()
    });
}


const officeUrl = (docId:string) =>{
    let host = window.location.host.replace('admin.', '');
    if(!host.includes('localhost')){
        return `https://office.${host}/browser/85ac843/cool.html?WOPISrc=https://office.${host}/wopi/files/${docId}&access_token=${token.value}&ui_defaults=${ui.value}&css_variables=${css.value}`
    }else{
        return `https://office.app4.wclsolution.com/browser/85ac843/cool.html?WOPISrc=https://office.app4.wclsolution.com/wopi/files/${docId}&access_token=${token.value}&ui_defaults=${ui.value}&css_variables=${css.value}`
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

function iframeLoaded(){
    console.log('iframeLoaded')
    // send message to collabora iframe to make it readonly
    // @ts-ignore
    // xlsxIframe.contentWindow.postMessage({
    //     MessageId: "Get_Views_Resp",
    //         SendTime: new Date().getTime(),
    //     Values: {
    //         ReadOnly: true
    //     }
    // }, '*')
}

useEventListener(window, 'message', gotMessageFromIframe)

watch(doc, ()=>{
    if(!doc) return;
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
    <iframe ref="xlsxIframe" id="xlsxIframe" class="xlsxIframe" frameborder="0" name="collabora-online-viewer" @load="iframeLoaded"></iframe>
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