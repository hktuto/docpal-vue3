<template>
    <div class="pageHeaderContainer">
        <el-icon v-if="backPath" class="el-icon--left cursorPointer icon__hover" @click="handleBack"><ArrowLeftBold /></el-icon>
        {{$t(currentRouteMenuName)}}
    </div>
</template>

<script lang="ts" setup>
import { ArrowLeftBold } from '@element-plus/icons-vue'
const props = defineProps<{
    backPath?: string
}>()
const route = useRoute();
const router = useRouter()
const { menu } = useAppConfig();
const currentRouteMenuName = ref("");

function getMenuItemFromPathName(name: string) {
    const item = menu.find( item => item.routeName === name);
    currentRouteMenuName.value = item?.name || "";
}
function handleBack () {
    if(props.backPath) router.push(props.backPath)
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