<template>
    <Browse>
        <template #headerLeft>
            <div class="pageHeaderContainer">
                <!-- <el-icon class="el-icon--left cursorPointer icon__hover" @click="handleBack"><ArrowLeftBold /></el-icon> -->
                {{$t('file_smartFolder')}}
            </div>
        </template>
        <template #breadcrumb>
            <SmartFolderBreadCrumb :breadcrumbs="state.breadcrumbs"></SmartFolderBreadCrumb>
        </template>
    </Browse>
</template>


<script lang="ts" setup>
import { ArrowLeftBold, ArrowRight } from '@element-plus/icons-vue'
import Browse from '../../../client-browse/pages/browse/index.vue'
import { GetBreadcrumb } from 'dp-api'
const props = withDefaults(defineProps<{
    breadcrumbs: string,
}>(), {
  breadcrumbs: []
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
    router.push(path)
}
function checkRoute() {
    if(!route.query.rootId) goRoute('/smartFolder')
    else if(!route.query.path) goRoute(`/smartFolder/${state.rootId}`)
}
watch(() => route.query, async(nq) => {
    if (!nq) {
        checkRoute()
        return
    }
    const breadcrumbList = await GetBreadcrumb(nq.path)
    if(!state.rootPath && state.rootId) {
        const rootItem = breadcrumbList.find(item => item.id === state.rootId)
        state.rootPath = rootItem.path
    }
    state.breadcrumbs = breadcrumbList.reduce((prev, item) => {
        if(item.path.includes(state.rootPath)) prev.push({
            path: `/smartFolder/${state.rootId}`,
            name: item.name,
            query: {
                ...route.query,
                path: item.path
            }
        })
        return prev
    }, [])
    state.breadcrumbs.unshift(...props.breadcrumbs)
},{immediate:true, deep: true})
onMounted(async() => {
    state.rootId = route.query.rootId
    checkRoute()
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
