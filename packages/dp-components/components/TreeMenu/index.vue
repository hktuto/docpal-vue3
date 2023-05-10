<template>
    <el-menu
        v-bind="options"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect"
    >
        <TreeMenuItem v-for="item in menu" :menu="item" v-bind="options"></TreeMenuItem>
    </el-menu>
</template>

<script lang="ts" setup>
export type TMenuItem = {
    index: string,
    name: string,
    children: TMenuItem[]
}
export type TMenuOptions = {
    defaultActive: string,
    defaultOpeneds: string[],
    indexKey: string,
    nameKey: string
}
const props = defineProps<{
    menu: TMenuItem[],
    options: TMenuOptions
}>()
const emits = defineEmits([
    'open', 
    'close',
    'select',
])
const handleOpen = (key: string, keyPath: string[]) => {
    // console.log(key, keyPath)
    emits('open', key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    // console.log(key, keyPath)
    emits('close', key, keyPath)
}
const handleSelect = (key: string, keyPath: string[]) => {
    // console.log(key, keyPath)
    emits('select', key)
}
</script>
