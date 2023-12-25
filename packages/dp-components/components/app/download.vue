<script lang="ts" setup>

    // get platform from window.navigator.userAgent
    const platform = computed(() => {
        if(!window?.navigator?.userAgent) return "";
        const platform = window.navigator.userAgent
        if (platform.includes('Win')) {
            return 'win'
        } else if (platform.includes('Mac')) {
            return 'mac'
        } else if (platform.includes('Linux')) {
            return 'linux'
        } else if (platform.includes('iPhone')) {
            return 'ios'
        } else if (platform.includes('Android')) {
            return 'android'
        }
    })
    
    async function getDownloadLinkFromServer() {
        //TODO : get download link from server
        return location.origin + '/app/win/DocPal_x64-setup.exe';    
    }

    async function download() {
        const downloadLink = await getDownloadLinkFromServer();
        if(downloadLink) {
            window.open(downloadLink, '_blank');
        }
    }
</script>

<template>
    <div class="downloadButtonDropDownContainer" @click="download">
        <SvgIcon src="/icons/file/download.svg" />   
    </div>
</template>

<style lang="scss" scoped>

</style>