<template>
    <div class="colorSwitchContainer">
        <ElIcon @click="toggleColor">
            <Sunny v-if="colorMode.value === 'light'" />
            <Moon v-else />
        </ElIcon>
    </div>
</template>

<script lang="ts" setup>
import { Sunny, Moon } from '@element-plus/icons-vue'
const colorMode = useColorMode();
function toggleColor() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<style lang="scss" scoped>
.colorSwitchContainer{
    padding: calc(var(--app-padding) / 2);
    border-radius: var(--el-border-radius-base);
    border: 1px solid var(--color-grey-800); 
    background-color: transparent;
    transform: all .5s ease-in-out;
    &:hover{
        background-color: var(--color-grey-800);
        color: var(--color-grey-000);
    }
}
</style>