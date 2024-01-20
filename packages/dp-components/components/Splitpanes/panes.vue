<script setup lang="ts">
import { Pane } from 'splitpanes'
const props = defineProps<{
  size?: number
  defaultSize?:number
  parentId:string
  minSizeInPixel: number
  maxSizeInPixel: number
  dragging:boolean
  toggle?: boolean
}>()

const emits = defineEmits(['update:size','toggled'])

const state = reactive({
  opened: true,
  size: props.size,
  minSize: null,
  maxSize: null,
  tempSize: null,
})

function toggleHandler(){
  if(state.opened){
    close()
  }else{
    open()
  }
  state.opened = !state.opened
}

function open(){
  console.log(state.tempSize)
  state.size = state.tempSize || state.maxSize|| props.defaultSize
  emits('update:size', state.size)
  emits('toggled')
}
function close(){
  state.tempSize = state.size;
  state.size = state.minSize;
  emits('update:size', state.size)
  emits('toggled')
}

watch(() => props.size, (newValue) => {
  state.size = newValue
})

onMounted(() => {
  if(props.parentId){
    const el = document.getElementById(props.parentId);
    if (el) {
      const { width } = el.getBoundingClientRect()

      if(props.minSizeInPixel) {
        state.minSize = props.toggle ? Number(((40 / width) * 100).toFixed(0)) :  Number(((props.minSizeInPixel / width) * 100).toFixed(0))
      }
      if(props.maxSizeInPixel) {
        state.maxSize =  Number(((props.maxSizeInPixel / width) * 100).toFixed(0))
      }
    }
  }
})

defineExpose({
  open,
  close
})
</script>

<template>
  <Pane v-bind="{...state}">
    <div :class="{paneContainer:true, toggle:toggle, dragging}">


    <template v-if="toggle">
      <div :class="{toggleContainer: true, opened:state.opened}" @click="toggleHandler">
        <div class="toggleButtonContainer" >
          <slot name="toggleButton"></slot>
        </div>
        <div v-if="state.opened" class="toggleTextContainer">
          <slot name="toggleText"></slot>
        </div>
      </div>
    </template>
      <div v-show="!toggle || state.opened" class="contentContainer">

        <slot />
      </div>
    </div>
  </Pane>
</template>

<style scoped lang="scss">
.paneContainer{
  height: 100%;
  width: 100%;
  position: relative;
  &.dragging{
    pointer-events: none;
    opacity: 0.5;
  }
  &.toggle{
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    overflow: hidden;
    .contentContainer{
      flex: 1 0 auto;
    }
  }
  .toggleContainer{
    flex: 0 0 auto;
  }
  .contentContainer{
    //height: 100%;
    //width: 100%;
  }
}
.toggleContainer{
  flex: 0 0 auto;
  padding: calc(var(--app-padding) / 2) var(--app-padding);
  --icon-size: 1.2rem;
  display: flex;
  flex-flow: row nowrap;
  gap: var(--app-padding);
  justify-content: flex-start;
  color: var(--primary-color);
  align-items: center;
  white-space: nowrap;
  cursor: pointer;
  &.opened{
    padding: calc(var(--app-padding) / 2) calc(var(--app-padding) * 2);
  }
}
</style>
