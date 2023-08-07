<template>
    <div class="drag-outer"
       ref="dragWrap"
       @mouseenter="state.isHover = true"
       @mouseleave="state.isHover = state.isMousedown = false"
       @mouseup.stop="state.isMousedown = false"
       @mousemove="dragMousemove">
    <div class="drag-inner"
         ref="dragElement"
         @mousedown="dragMousedown"
         @mouseup.stop="state.isMousedown = false">
      <slot></slot>
    </div>
</div>

</template>

<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
const props = withDefaults(defineProps<{
    imgWidth: string,
    scaleZoom: any,
}>(), {
  imgWidth: '400px',
  scaleZoom: {
    max: 5,
    min: 0.5
  }
})
const dragElement = ref()
const state = reactive({
    isMousedown: false,
    isHover: false,
    moveStart: {},
    translate: {x: 0, y: 0},
    scale: 1
})
function handleScroll(e) {
    if (state.isHover) {
        let speed = e.wheelDelta / 120
        if (e.wheelDelta > 0 && state.scale < props.scaleZoom.max) {
            state.scale += 0.2 * speed
            dragElement.value.style.transform = `scale(${state.scale}) translate(${state.translate.x}px, ${state.translate.y}px)`
        } else if (e.wheelDelta < 0 && state.scale > props.scaleZoom.min) {
            state.scale += 0.2 * speed
            dragElement.value.style.transform = `scale(${state.scale}) translate(${state.translate.x}px, ${state.translate.y}px)`
        }
    }
}
function dragMousedown(event) {
    state.moveStart.x = event.clientX
    state.moveStart.y = event.clientY
    state.isMousedown = true
}
function dragMousemove(event) {
    if (state.isMousedown) {
        state.translate.x += (event.clientX - state.moveStart.x) / state.scale
        state.translate.y += (event.clientY - state.moveStart.y) / state.scale
        dragElement.value.style.transform = `scale(${state.scale}) translate(${state.translate.x}px, ${state.translate.y}px)`
        state.moveStart.x = event.clientX
        state.moveStart.y = event.clientY
    }
}
onMounted(() => {
    useEventListener(dragElement, 'mousewheel', handleScroll)
})
</script>

<style lang="scss" scoped>
  .drag-outer {
    height:100%;
    width: 100%;
    overflow: hidden;
    float: left;
    display: flex;
    background-color:#fff;
    justify-content: center;
    align-items: center;
    .drag-inner {
      transform-origin: center center;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: grab;
      user-select: none;
      width:100%;
      height:100%;
      >* {
        -webkit-user-drag: none;
        user-drag: none;
      }
      img{object-fit:contain; width:100%; height:100%}
    }
  }
</style>

