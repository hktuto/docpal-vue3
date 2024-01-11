<template>
    <el-popover
        ref="BrowseAiPopperRef"
        :placement="state.position"
        :width="340"
        trigger="click"
        popper-class="browseAiPopper"

    >
    <template #reference>
        <div id="browseAiButton" :class="{'browseAiButton--left': state.position === 'bottom-start'}">
            <SvgIcon v-if="state.position !== 'bottom-start'" class="el-icon--left" src="/icons/tools/toLeft.svg" @click.stop="state.position = 'bottom-start'"></SvgIcon>
            <b style="margin-top: 3px; font-size: 16px;">Ask</b>
            <SvgIcon class="el-icon--right" src="/icons/logo/ai-pure.svg"></SvgIcon>
            <SvgIcon v-if="state.position !== 'bottom-end'" class="el-icon--right" src="/icons/tools/toRight.svg"  @click.stop="state.position = 'bottom-end'"></SvgIcon>
        </div>
    </template>
    <template #default>
        <div id="browseAi">
            <AiChat :idOrPath="doc.path" :rows="1" @close="closePopper()"></AiChat>
        </div>
    </template>
</el-popover>
</template>

<script lang="ts" setup>
const props = defineProps(['doc'])
const emits = defineEmits(['openAiDrawer'])

const state = reactive<any>({
    position: 'bottom-end'
})
function itemClicked() {
    emits('openAiDrawer')
}
const BrowseAiPopperRef = ref()
function closePopper() {
    BrowseAiPopperRef.value.hide()
}
</script>


<style lang="scss">
#browseAiButton {
    --icon-color: #fff; 
    --icon-size: 20px;
    background-color: var(--primary-color);
    color: #fff;
    display: flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 20px;
    height: 28px;
    line-height: 28px;
    position: absolute;
    right: calc(var(--el-component-size-small) + 15px);
    bottom: calc(var(--el-component-size-small) + 40px);
    cursor: pointer;
    width: fit-content;
    &:hover {
        opacity: .9;
    }
}
.browseAiButton--left {
    left: calc(var(--el-component-size-small) + 15px);
    right: unset;
}
#browseAi {
    overflow: hidden;
    height: 100%;
}
</style>
<style>
.browseAiPopper {
    height: 60vh;
    overflow: hidden;
    /* backdrop-filter: blur(10px); */
    /* filter: blur(20px); */
    backdrop-filter: blur(20px);
    background-color: rgba(248, 249, 250, 0.5)!important;
}
</style>
