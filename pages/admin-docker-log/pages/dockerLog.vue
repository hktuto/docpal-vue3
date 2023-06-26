<template>
    <NuxtLayout class="fit-height">
        <div :class="{ browsePage: true }">
            <iframe ref="iframe" :src="`${hostname}/container_logs/`" crossorigin allowfullscreen   />
        </div>
    </NuxtLayout>
</template>


<script lang="ts" setup>
const iframe = ref();
const hostname = computed(() => location.host.includes('localhost') ? 'http://132.148.160.88:8989' : location.protocol + '//' + location.host)
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