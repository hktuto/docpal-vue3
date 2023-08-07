<template>
<Interact
    :resizable="true"
    :resizeOption="{
            edges: { left: true, right: false, bottom: false, top: false }
        }"
    :style="style"
    @resizemove="resizeMove"
>
  <slot></slot>
  <SvgIcon v-if="interact.closeShow" class="drawer-close" src="/icons/close.svg"
    @click="handleSwitch"></SvgIcon>
</Interact>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
    defaultW: number,
    minWidth: number,
    maxWidth: number,
}>(),{
    defaultW: 400,
    minWidth: 120,
    maxWidth: 600
})
const interact = reactive({
    // maxWidth: 600,
    // minWidth: 120,
    w: 0,
    // defaultW: 400,
    closeShow: false
})
const style = computed(() => {
    let s = `--drawer-width: ${interact.w}px;` 
    s += `--drawer-padding: ${interact.w === 0 ? 0 + 'px': 'var(--app-padding)'};`
    s += `--drawer-min-width: ${interact.w === 0 ? 0 : props.minWidth }px;`
    return s
})
function handleSwitch(width: number = props.defaultW) {
    if (interact.w === 0) {
        interact.w = width 
        interact.closeShow = true
    } else {
        interact.w = 0 
        interact.closeShow = false
    }
}
function handleOpen(width: number = props.defaultW) {
    interact.w = width 
    interact.closeShow = true
}
function resizeMove(event:any) {
    const min = Math.max(event.rect.width, props.minWidth)
    interact.w = props.maxWidth ? Math.min(min, props.maxWidth) : min;
}
defineExpose({
    handleOpen, handleSwitch
})
</script>

<style lang="scss" scoped>
.interactContainer {
    position: relative;
    width: var(--drawer-width);
    min-width: var(--drawer-min-width);
    padding: var(--drawer-padding);
    box-shadow: 0px 0px 12px rgba(0,0,0,.12);
    overflow: auto;
}
.drawer-close {
    position: absolute;
    top: var(--drawer-padding);
    right: var(--drawer-padding);
}
</style>
