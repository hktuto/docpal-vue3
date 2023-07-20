<script setup lang="ts">
const props = defineProps<{
  label: string
}>()
</script>

<template>
  <div class="buttonContainer">
    <slot />
    <div class="label">{{label}}</div>
  </div>
</template>

<style scoped lang="scss">
.buttonContainer{
  display: flex;
  flex-flow: row nowrap;
  gap: var(--app-padding);
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  @media (max-width: 1024px) {
    &:hover {
      background: var(--primary-color-02);
    }
  }
  .label {
    display: none;
    color: #000;
    @media (max-width: 1024px) {
      display: block;
    }
  }
}
</style>