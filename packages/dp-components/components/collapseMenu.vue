<script setup lang="ts">
import {useBreakpoints} from '@vueuse/core'
import { onClickOutside } from '@vueuse/core'
const opened = ref(false);
const breakpoints = useBreakpoints({
  laptop: 1024,
  desktop: 1280,
})
const emits = defineEmits(['openedChange'])
const outsideTarget = ref()
const collapse = breakpoints.smallerOrEqual('laptop');

onClickOutside(outsideTarget, (event) => {
  if(collapse.value && opened.value){
    opened.value = false
  }
})

watch(opened,(bool) => {
  emits('openedChange', bool)
})
</script>

<template>
  <div class="collapseContainer">
    <template v-if="!collapse">
      <slot />
    </template>
    <template v-else>
      <div class="mobileCollapse" @click.stop="() => {}">
        <SvgIcon src="/icons/menu.svg" round @click="opened = true"/>
        <div ref="outsideTarget" :class="{listContainer:true, opened}">
          <slot :collapse="true" />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.collapseContainer{
  display: flex;
  flex-flow: row nowrap;
  gap: var(--app-padding);
  justify-content: flex-start;
  align-items: center;
  font-size: 16px;
  --icon-size: 16px;

}
.mobileCollapse{
  position: relative;

}
.listContainer{
  display: none;
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  z-index: 2;
  padding: var(--app-padding);
  background: var(--color-grey-0000);
  border-radius: 4px;
  box-shadow: 0 0 5px rgba(0,0,0,0.3);
  transform: translateX(100vw);
  transition: transform .2s ease-in-out;
  &.opened{
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    gap: calc(var(--app-padding) / 2);
    transform: translateX(0);
    z-index: 999;
  }
}
</style>
