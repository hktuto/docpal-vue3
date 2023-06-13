<template>
  <div class="anchorsContainer">
<!--    loop anchors in inlineSvg-->
    <div
      v-for="anchor in anchors"
      :key="anchor"
      class="anchor"
      :class="anchor"
      @click="$emit('change', anchor)"
    >
      <SvgIcon :src="`/icons/anchor-${anchor}.svg`" />
    </div>
  </div>
</template>
<script lang="ts" setup>

const props = defineProps<{
  modelValue: string
}>();

const emit = defineEmits(['update:modelValue', 'change'])

const anchors = [
  'tLeft' , 'tRight' , 'bLeft' , 'bRight' ,  'center'
]
</script>

<style scoped lang="scss">
.anchorsContainer{
  --color: currentColor;
  --hover: var(--color);
  display : flex;
  flex-flow: row nowrap;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.anchor{
  color: #000;
  flex: 1 0 auto;
  cursor: pointer;
  :hover {
    color: var(--primary-color);
  }
}
</style>
