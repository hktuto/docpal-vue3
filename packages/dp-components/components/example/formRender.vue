<template>
    <div class="filterContainer">
        <FromRenderer :form-json="formJson" />
    </div>
</template>

<script lang="ts" setup>
import { getJsonApi } from 'dp-api'
const formJson = ref()
onMounted(() => {
    formJson.value = getJsonApi('search.json')
    console.log(formJson.value)
})
</script>

<style lang="scss" scoped>
</style>