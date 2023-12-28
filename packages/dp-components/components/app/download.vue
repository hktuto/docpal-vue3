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
        return location.origin + '/app/' + platform.value + '/DocPal' + (platform.value === 'mac' ? '.dmg' : '.exe')
    }

    async function download() {
        const downloadLink = await getDownloadLinkFromServer();
        if(downloadLink) {
            window.open(downloadLink, '_blank');
        }
    }
</script>

<template>
    <div class="downloadButtonDropDownContainer" >
        <div v-if="platform === 'mac' || platform === 'win'" class="buttonContainer" @click="download">
            <SvgIcon src="/icons/file/download.svg" />   
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>