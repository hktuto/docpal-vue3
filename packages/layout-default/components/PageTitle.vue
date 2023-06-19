<template>
    <div class="pageHeaderContainer">
        <el-icon v-if="backPath" class="el-icon--left cursorPointer icon__hover" @click="handleBack"><ArrowLeftBold /></el-icon>
        {{$t(title || currentRouteMenuName)}}
    </div>
</template>

<script lang="ts" setup>
import { ArrowLeftBold } from '@element-plus/icons-vue'
const props = defineProps<{
    backPath?: string,
    title?:string,
}>()
const route = useRoute();
const router = useRouter()
const { menu } = useAppConfig();
const currentRouteMenuName = ref("");

function getMenuItemFromPathName(name: string) {
    const item = menu.find( (item:any) => item.routeName === name);
    console.log(item);
    currentRouteMenuName.value = item?.name || "";
}
function handleBack () {
    if(props.backPath) router.push(props.backPath)
}

watch( route , (newRoute) => {
  console.log(route.name)
    getMenuItemFromPathName(route.name)
},{
    immediate: true
})
</script>

<style lang="scss" scoped>
.pageHeaderContainer{
    font-size: 1.4rem;
    line-height: 1.2;
    font-weight: 700;
    white-space: nowrap;
    background: linear-gradient( 45deg, var(--primary-color),  var(--secondary-color) , var(--primary-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 500% auto;
    filter: drop-shadow(0 0.1em .2em var(--primary-color-04));
    animation: textShine 5s ease-in-out infinite alternate;
}
@keyframes textShine {
    0% {
        background-position: 0% 50%;
    }
    100% {
        background-position: 100% 50%;
    }
}
</style>
