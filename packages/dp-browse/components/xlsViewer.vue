<script lang="ts" setup>
import { getOfficeTokenApi } from 'dp-api';

const props = defineProps<{
    doc: any
}>()
const { doc } = toRefs(props)
const iframeSrc = ref('');

async function displayIframe(){
    const token = await getOfficeTokenApi(props.doc.id)
    iframeSrc.value = officeUrl(props.doc.id, token)
}


const officeUrl = (docId:string, token:string) =>{
    let host = window.location.host.replace('admin.', '');
    if(!host.includes('localhost')){
        return `https://office.${host}/browser/85ac843/cool.html?WOPISrc=https://office.${host}/wopi/files/${docId}?access_token=${token}`
    }else{
        return `https://office.app4.wclsolution.com/browser/85ac843/cool.html?WOPISrc=https://office.app4.wclsolution.com/wopi/files/${docId}?access_token=${token}`
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
    <iframe ref="xlsxIframe" id="xlsxIframe" class="xlsxIframe" frameborder="0" :src="iframeSrc"></iframe>
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