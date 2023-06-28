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
    @click="handleOpen"></SvgIcon>
</Interact>
</template>

<script lang="ts" setup>

const interact = reactive({
    maxWidth: 600,
    minWidth: 120,
    w: 0,
    defaultW: 400,
    closeShow: false
})
const style = computed(() => {
    let s = `--drawer-width: ${interact.w}px;` 
    s += `--drawer-padding: ${interact.w === 0 ? 0 + 'px': 'var(--app-padding)'};`
    s += `--drawer-min-width: ${interact.w === 0 ? 0 : interact.minWidth }px;`
    return s
})
function handleOpen(width: number = interact.defaultW) {
    if (interact.w === 0) {
        interact.w = width 
        interact.closeShow = true
    } else {
        interact.w = 0 
        interact.closeShow = false
    }
}
function resizeMove(event:any) {
    const min = Math.max(event.rect.width, interact.minWidth)
    interact.w = interact.maxWidth ? Math.min(min, interact.maxWidth) : min;
}
defineExpose({
    handleOpen
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
    top: var(--app-padding);
    right: var(--app-padding);
}
</style>
