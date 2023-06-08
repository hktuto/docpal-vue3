<template>
    <SvgIcon src="/icons/file/office.svg" round content="Go to office"
                @click="goOffice"></SvgIcon>
</template>

<script lang="ts" setup>
import { ElNotification } from 'element-plus'
import { getOfficeTokenApi } from 'dp-api'
const props = defineProps<{
    doc: any
}>()

async function goOffice(){
    const token = await getOfficeTokenApi(props.doc.id)
    const baseUrl = officeUrl(props.doc.id, token)
    // const baseUrl = `https://office.app4.wclsolution.com/browser/85ac843/cool.html?WOPISrc=https://app4.wclsolution.com/api/wopi/files/${props.doc.id}?access_token=${token}`
    window.open(baseUrl, '_blank')
}
const officeUrl = (docId:string, token:string) =>{
    const host = window.location.host;
    if(!host.includes('localhost')){
        return `https://office.${host}/browser/85ac843/cool.html?WOPISrc=https://office.${host}/wopi/files/${docId}?access_token=${token}`
    }else{
        return `https://office.app4.wclsolution.com/browser/85ac843/cool.html?WOPISrc=https://office.app4.wclsolution.com/wopi/files/${docId}?access_token=${token}`
    }
}
</script>