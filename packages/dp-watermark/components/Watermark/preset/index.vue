<script  lang="ts" setup>

import {Watermark} from "~/compossible/Watermark";
import type {fabric} from "fabric";
type Preset = {
  name : string,
  setting : Watermark,
  icon : string,
  type: 'text' | 'image'
}

const props = defineProps<{
  modelValue: Watermark & fabric.Image | fabric.IText
}>();
const emit = defineEmits(['update:modelValue']);
const presets = ref<Preset[]>([])

const displayPreset = computed(() => {
  return presets.value.filter(item => item.type === props.modelValue.type)
})

function itemClick(item: Preset) {
  // update props.item by preset
}
</script>

<template>
  <div class="presetListContainer">
    <div v-for="preset in displayPreset" :key="preset.name" class="presetItem" @click="itemClick">
      <img :src="preset.icon" :alt="preset.name" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.presetListContainer {
  display: flex;
  flex-flow: row wrap;
  gap: 8px;
  align-items: flex-start;
  justify-content: flex-start;
}
.presetItem{
  aspect-ratio: 1/1;
  overflow: hidden;
}
</style>
