<template>
    <div class="breadCrumbContainer">
        <!-- {{data}} -->
        <div v-loading="pending" class="breadContainer">
            
            <div class="breadItem pointer" @click="navigate(rootPath)" >
                <img
                    width="24"
                    height="24"
                    src="/icons/breadcrumb_home.svg"
                />
            </div>
            <div v-if="displayBread && displayBread.length > 0" class="divider">
                <ElIcon><ArrowRight/></ElIcon>
            </div>
            <template v-for="(item,index) in displayBread" :key="displayBread.id">
                <div  :class="{breadItem:true, pointer: index < displayBread.length - 1 }" @click="navigate(item.path)">
                    {{item.name}}
                </div>
                <div v-if="index < displayBread.length - 1" class="divider">
                    <ElIcon><ArrowRight/></ElIcon>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {Back, ArrowRight} from '@element-plus/icons-vue'
import { GetBreadcrumb } from 'dp-api'
const router = useRouter();
const props = withDefaults(defineProps<{
    path:string,
    rootPath: string
}>(),{
    path:'/',
    rootPath: '/'
})

const { data, refresh, pending } = useAsyncData(() => GetBreadcrumb(props.path));

const displayBread = computed(() => data.value?.filter(d => d.isFolder)|| []);

watch(props, () => refresh())

function goParent() {
    const path = data.value[data.value.length - 2]? data.value[data.value.length - 2].path : props.rootPath;
    router.push({
        path:'/browse',
        query:{
            path
        }
    })
}

function navigate(path) {
    router.push({
        path:'/browse',
        query:{
            path
        }
    })
}

defineExpose({
    goParent
})
</script>

<style lang="scss" scoped>
.breadCrumbContainer{
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    gap : calc(var(--el-component-size-small) / 3 );
}
.breadContainer{
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    gap: calc(var(--el-component-size-small) / 3 );
}
.breadItem{
    padding: 6px;
    &.pointer{
        border-radius: 4px;
        &:hover{
            background: var(--el-color-primary);
            color: var(--el-color-white);
        }
    }
}
</style>