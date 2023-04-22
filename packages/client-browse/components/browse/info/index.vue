<template>
<Interact
    :resizable="true"
    :resizeOption="{
            edges: { left: true, right: false, bottom: false, top: false }
        }"
    :style="style"
    :class="{infoContainer:true, infoOpened:!infoOpened}"
    @resizemove="resizeMove"
>
    <BrowseInfoDocInfo :doc="doc" />
    <BrowseInfoPicture :doc="doc" />
    <BrowseInfoMeta :doc="doc" />
    <BrowseInfoTag :doc="doc" />
</Interact>
</template>

<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'

const props = defineProps<{
    doc: any,
    infoOpened:boolean
}>()
const { doc } = toRefs(props)

const dragSize = ref(200);
const maxWidth = 600;
const minWidth = 120;
const w = ref(400);
const h = ref(0);
const x = ref(0);
const y = ref(0);
const style = computed(() => {
    if(!props.infoOpened) return {
        width: '0px',
        height: "100%"
    }
    let result:any = {};
    if(w.value) {
    result.width = `${w.value}px`
    }
    return result
})
function resizeMove(event:any) {
    const min = Math.max(event.rect.width, minWidth)
    w.value = maxWidth ? Math.min(min, maxWidth) : min;
    x.value += event.deltaRect.left;
    y.value += event.deltaRect.top;
    if(w.value === maxWidth) {
        console.log('reachMax')
        emit('reachMax')
    }else if(w.value === minWidth) {
        console.log('reachMin')
        emit('reachMin')
    }
}

const infoSize = computed(() => {
    return props.infoOpened ? dragSize.value + 'px' : '0px'
})

</script>

<style lang="scss" scoped>

.infoContainer {
    margin-left: var(--app-padding);
    padding: var(--app-padding);
    background: var(--color-grey-0000);
    height: 100%;
    border-radius: 12px;
    user-select: none;
    -ms-touch-action: none;
    touch-action: none;
    overflow: hidden;
    &.infoOpened{
        padding:0;
    }
}
</style>