<template>
<Interact
    id="drawer"
    :resizable="true"
    :resizeOption="{
            edges: { left: true, right: false, bottom: false, top: false }
        }"
    :style="style"
    @resizemove="resizeMove"
>
  <slot></slot>
  <div class="drawer-close" v-show="interact.closeShow">
        <slot name="drawerAction"></slot>
        <SvgIcon v-if="close" src="/icons/close.svg"
            @click="handleSwitch()"></SvgIcon>
  </div>
</Interact>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
    defaultOpen: boolean,
    showClose: boolean,
    defaultW: number,
    minWidth: number,
    maxWidth: number,
    close: boolean
}>(),{
    defaultOpen: false,
    showClose: true,
    defaultW: 400,
    minWidth: 340,
    maxWidth: 600,
    close: true
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
function handleSwitch(isOpen: boolean = false) {
    console.log(isOpen , 'isOpen');
    
    if (interact.w === 0 || isOpen) {
        interact.w = props.defaultW 
        interact.closeShow = true
    } else {
        interact.w = 0 
        interact.closeShow = false
    }
}
function handleOpen(width: number = props.defaultW) {
    interact.w = width 
    interact.closeShow = props.showClose
}
function resizeMove(event:any) {
    const min = Math.max(event.rect.width, props.minWidth)
    interact.w = props.maxWidth ? Math.min(min, props.maxWidth) : min;
}
onMounted(() => {
     if(props.defaultOpen) handleOpen()
})
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
    transition: all .5s;
    background: var(--drawer-bg, #fff);
}
.drawer-close {
    display: flex;
    gap: 4px;
    position: absolute;
    top: var(--drawer-padding);
    right: var(--drawer-padding);
}
</style>
