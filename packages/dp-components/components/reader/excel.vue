<template>
    <VueOfficeExcel :src="src"></VueOfficeExcel>
</template>

<script lang="ts" setup>
import VueOfficeExcel from '@vue-office/excel'
import '@vue-office/excel/lib/index.css'
const props = defineProps<{
    src: string
}>();
</script>
<style lang="scss" scoped>
.vue-office-excel {
    width: 100%;
    height: 100%;
}
</style>
