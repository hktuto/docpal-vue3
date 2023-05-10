<template>
    <template v-if="menu.children && menu.children.length > 0">
        <el-sub-menu :index="menu[indexKey]">
            <template #title>{{menu[nameKey]}}</template>
            <template v-for="(item) in menu.children" :key="menu[indexKey]">
                <TreeMenuItem :menu="item"></TreeMenuItem>
            </template>
        </el-sub-menu>
    </template>
    <template v-else>
        <el-menu-item :index="menu[indexKey]">{{menu[nameKey]}}</el-menu-item>
    </template>
</template>

<script lang="ts" setup>
import type { TMenuItem, TMenuOptions } from '../TreeMenu/index.vue'
const props = defineProps<{
    menu: TMenuItem,
    options: TMenuOptions
}>()
const nameKey = props.options?.nameKey ? props.options.nameKey : 'name'
const indexKey = props.options?.indexKey ? props.options.indexKey : 'index'
</script>
