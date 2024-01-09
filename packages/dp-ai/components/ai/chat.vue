<template>
    <div>
        <AiChatBox v-model="state.inputValue"/>
    </div>
</template>
<script lang="ts" setup>
const state = reactive<any>({
    inputValue: ''
})
</script>
<style lang="scss" scoped>
</style>