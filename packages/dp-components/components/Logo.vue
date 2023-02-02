<template>
     <img :src="`/images/logo-${mode}-${$colorMode.value === 'system' ? 'dark' : $colorMode.value}.svg`" width="100%" alt="logo" @click="$emit('click')"/>
</template>

<script lang="ts" setup>
export interface Props {
  mode: string
}
withDefaults(defineProps<Props>(), {
  mode: 'withName',
})
</script>
