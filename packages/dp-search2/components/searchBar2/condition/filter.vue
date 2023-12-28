<template>
    <el-input v-model="state.inputValue" :suffix-icon="Search" size="small"
        clearable 
        @change="handleChange"
        @keyup.enter="handleChange"
        @blur="handleChange">filter</el-input>
</template>
<script lang="ts" setup>
import { Search  } from '@element-plus/icons-vue';
const emits = defineEmits(['change'])

const state = reactive({
    inputValue: ''
})
function handleChange() {
    emits('change', state.inputValue)
}
</script>
<style lang="scss" scoped>
</style>