<script lang="ts" setup>
import { getOfficeTokenApi } from 'dp-api';

const props = defineProps<{
    doc: any
}>()
const { doc } = toRefs(props)
const formEl = ref();
const collaboraUrl = ref('');
const css = ref('');
const ui = ref('UIMode=Default')
const token = ref('')

async function displayIframe(){

    token.value = await getOfficeTokenApi(props.doc.id)
    collaboraUrl.value = officeUrl(props.doc.id, token)
    formEl.value.submit
}


const officeUrl = (docId:string, token:string) =>{
    let host = window.location.host.replace('admin.', '');
    if(!host.includes('localhost')){
        return `https://office.${host}/browser/85ac843/cool.html?WOPISrc=https://office.${host}/wopi/files/${docId}`
    }else{
        return `https://office.app4.wclsolution.com/browser/85ac843/cool.html?WOPISrc=https://office.app4.wclsolution.com/wopi/files/${docId}`
    }
}

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
        <input type="submit" value="" />
    </form>
    <iframe ref="xlsxIframe" id="xlsxIframe" class="xlsxIframe" frameborder="0" name="collabora-online-viewer"></iframe>
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