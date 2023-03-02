<template>
    <div class="pageHeaderContainer">
        {{$t(currentRouteMenuName)}}
    </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const { menu } = useAppConfig();
const currentRouteMenuName = ref("");

function getMenuItemFromPathName(name: string) {
    const item = menu.find( item => item.routeName === name);
    currentRouteMenuName.value = item?.name || "";
}


watch( route , (newRoute) => {
    getMenuItemFromPathName(route.name)
},{
    immediate: true
})
</script>

<style lang="scss" scoped>
.pageHeaderContainer{
    font-size: 1.4rem;
    line-height: 1.2;
    font-weight: 900;
    white-space: nowrap;
    background: -webkit-linear-gradient(45deg, var(--primary-color), #0094f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>