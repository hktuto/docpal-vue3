<template>
    <div class="ai-chat-container">
        <SvgIcon class="logo" src="/icons/logo/docpal-ai.svg"></SvgIcon>
        <AiChatContent ref="AiChatContentRef" :loading="state.loading"> </AiChatContent>
        <AiChatBox v-model="state.inputValue" :loading="state.loading" @enter="handleEnter"/>
        <div class="ai-chat-tools" style="--icon-color: var(--color-grey-500)">
            <template v-if="!state.fullScreen">
                <SvgIcon src="/icons/tools/fullScreen.svg" @click="handleFullScreen"></SvgIcon>
                <SvgIcon src="/icons/close.svg" @click="emits('close')"></SvgIcon>
            </template>
            <template v-else>
                <SvgIcon src="/icons/tools/exitFullScreen.svg" @click="handleExitFullScreen"></SvgIcon>
            </template>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useResizeObserver } from '@vueuse/core'
const emits = defineEmits(['close'])
const state = reactive<any>({
    inputValue: '',
    loading: false,
    fullScreen: false
})
const AiChatContentRef = ref()
function handleEnter() {
    console.log('enter', state.inputValue);
    state.loading = true
    setTimeout(() => {
        state.loading = false
        state.inputValue = ''
    }, 1000)
}
function handleFullScreen() {
    document.getElementById('drawer').requestFullscreen()
    state.fullScreen = true
}
function handleExitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen()
    }
}
function isFullscreen() {
    return  !! (
        document.fullscreenElement ||
        document.mozFullScreen ||                         
        document.webkitIsFullScreen ||       
        document.webkitFullScreen || 
        document.msFullScreen 
    );
}
onMounted(() => {
    nextTick(() => {
        useResizeObserver(AiChatContentRef, (entries) => {
            if(!isFullscreen()) state.fullScreen = false
        })
    })
})
</script>
<style lang="scss" scoped>
.ai-chat-container {
    padding-top: 26px;
    height: 100%;
    overflow: hidden;
    display: grid;
    grid-template-rows: min-content 1fr min-content;

}
:fullscreen .ai-chat-container {
    width: 60vw;
    margin: auto;
}
.logo {
    padding: 16px;
    :deep .svg-icon {
        transform: scale3d(2.5, 2.5, 2.5);
        cursor: unset;
        &:hover {
            opacity: 1;
        }
    } 
}
.ai-chat-tools {
    position: absolute;
    top: var(--app-padding);
    right: var(--app-padding);
    display: flex;
    gap: 5px;
}
</style>
