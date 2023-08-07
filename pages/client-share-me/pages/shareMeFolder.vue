<template>
    <Browse>
        <template #headerLeft>
            <div class="pageHeaderContainer">
                <!-- <el-icon class="el-icon--left cursorPointer icon__hover" @click="handleBack"><ArrowLeftBold /></el-icon> -->
                {{$t(title)}}
            </div>
        </template>
        <template #breadcrumb>
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{ path: backPath }">{{$t(title)}}</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(item,index) in state.breadcrumbs" :key="item.path"
                    @click="goRoute(item.path, index === state.breadcrumbs.length - 1)">{{item.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </template>
    </Browse>
</template>


<script lang="ts" setup>
import { ArrowLeftBold, ArrowRight } from '@element-plus/icons-vue'
import Browse from '../../client-browse/pages/browse/index.vue'
import { GetBreadcrumb } from 'dp-api'
const props = withDefaults(defineProps<{
    backPath: string,
    routePath: string,
    title: string,
}>(), {
  backPath: 'shareMe',
  routePath: 'shareMeFolder',
  title: 'file_share_me'
})
const router = useRouter()
const route = useRoute()

const state = reactive({
    rootPath: '', // 预览根目录路径
    rootId: '', // 预览根目录id，由于后端不返路径，需通过id获取路径
    breadcrumbs: []
})
function handleBack () {
    router.push(props.backPath)
}
function goRoute (path, disabled: boolean = false) {
    if(disabled) return
    router.push(`${props.routePath}?path=${path}`)
}
watch(route, async(newRoute, oldRoute) => {
    if (!newRoute.query.path) {
        if (state.rootPath) goRoute(state.rootPath)
        else if (state.rootId) goRoute(state.rootId)
        return
    }
    const breadcrumbList = await GetBreadcrumb(newRoute.query.path)
    if(!state.rootPath && state.rootId) {
        const rootItem = breadcrumbList.find(item => item.id === state.rootId)
        state.rootPath = rootItem.path
    }
    state.breadcrumbs = breadcrumbList.reduce((prev, item) => {
        if(item.path.includes(state.rootPath)) prev.push({
            path: item.path,
            name: item.name
        })
        return prev
    }, [])
},{immediate:true, deep: true})

onMounted(async() => {
    state.rootId = sessionStorage.getItem('shareFolderId')
    if(!route.query.path) goRoute(state.rootId)
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

:deep(.el-breadcrumb) {
    font-size: 18px;
    .el-breadcrumb__item {
        .el-breadcrumb__inner {
            cursor: pointer;
            color: var(--color-grey-700);
            font-weight: bold;
            &:hover {
                color: var(--primary-color);
            }
        }
        &:last-child {
            .el-breadcrumb__inner {
                cursor: text;
                font-weight: unset;
                color: var(--color-grey-600);
            }
        }
    }
}
</style>
