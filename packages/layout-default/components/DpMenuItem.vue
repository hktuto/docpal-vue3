<template>
    <template v-if="menu && menu.children && menu.children.length > 0">
        <el-sub-menu :index="menu[nameKey]" popper-class="sub-menu-popper">
            <template #title>
                <SvgIcon v-if="menu && menu.icon" class="icon" :src="menu.icon"></SvgIcon>
                <span>{{$t(menu[nameKey])}}</span> 
            </template>
            <template v-for="(item) in menu.children" :key="menu[indexKey]">
                <DpMenuItem :menu="item"></DpMenuItem>
            </template>
        </el-sub-menu>
    </template>
    <template v-else>
        <el-menu-item :index="menu[nameKey]" :key="menu[nameKey]"> 
            <SvgIcon v-if="menu && menu.icon" class="icon" :src="menu.icon"></SvgIcon>
            <span>{{$t(menu[nameKey])}}</span> 
        </el-menu-item>
    </template>
</template>

<script lang="ts" setup>
import type { TMenuOptions } from '../TreeMenu/index.vue'
const props = withDefaults(defineProps<{
    menu: MenuItem,
    options: TMenuOptions
}>(),{
})
const route = useRoute()
const nameKey = props.options?.nameKey ? props.options.nameKey : 'name'
const indexKey = props.options?.indexKey ? props.options.indexKey : 'url'
function isSubSelected (menu) {
    // console.log('isSubSelected', menu);
    // console.log(menu.children.find(item => item.url === route.path));
    // return menu.children.find(item => item.url === route.path)
}
function isMenuSelected (menu) {
    // return menu.url === route.path
}
</script>
<style lang="scss" scoped>
.sub-menu-popper {
    .el-menu-item {
        gap: var(--app-padding);
    }
}
</style>

