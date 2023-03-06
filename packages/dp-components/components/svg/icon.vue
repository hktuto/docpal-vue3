<template>
    <InlineSvg :src="src"/>
</template>

<script lang="ts" setup>
import InlineSvg from 'vue-inline-svg';
const props = defineProps<{
    src: string
}>()
</script>

<style lang="scss" scoped>
</style>
