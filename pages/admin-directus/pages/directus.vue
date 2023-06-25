<template>
    <NuxtLayout class="fit-height">
        <div :class="{ browsePage: true }">
            <iframe v-if="cookieReady" ref="iframe" :src="`${hostname}/directus/admin/`" crossorigin allowfullscreen  @onload="loadHandler"  />
        </div>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { api } from 'dp-api';
const iframe = ref();
const hostname = computed(() => location.host.includes('localhost') ? 'https://app4.wclsolution.com' : location.protocol + '//' + location.host)

const cookieReady = ref(false);
const directus_refresh_token = useCookie('directus_refresh_token');
const directus_token = useCookie('directus_token');
async function getDirecutsToken(){
    try {
    const { result } = await api.post('/directus/auth/login',{}).then((res:any) => res.data);
    directus_refresh_token.value = result.refresh_token;
    directus_token.value = result.access_token;

    cookieReady.value = true;
    } catch(e) {
    console.log(e)
    }
    cookieReady.value = true; // tem allow to load iframe
}

function loadHandler() {
    }

onMounted(() => {
    getDirecutsToken();
})
</script>

<style lang="scss" scoped>
.browsePage{
    position: relative;
    height: 100%;
    padding: var(--app-padding);
    iframe{
        width: 100%;
        height: 100%;
        overflow: hidden;
        border: none;
        border-radius: var(--app-padding);
        // opacity:0;
        transition: opacity .3s ease-in-out;
        &.show{
            opacity:1;
        }
    }
}
</style>