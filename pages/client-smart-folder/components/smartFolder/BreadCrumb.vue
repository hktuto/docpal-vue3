<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="(item,index) in breadcrumbs" :key="item.path"
            @click="goRoute(item)">
            <SvgIcon v-if="item.icon" :src="item.icon"></SvgIcon>
            {{item.name}}
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>


<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
type breadcrumbItem = {
    name: string,
    path: string,
    icon: string,
    query: any
}
const props = withDefaults(defineProps<{
    breadcrumbs: breadcrumbItem[]
}>(), {
  breadcrumbs: []
})

const router = useRouter()
const route = useRoute()
function goRoute (bItem, index) {
    if(bItem.disabled || index === props.breadcrumbs.length - 1) return
    router.push({
        path: bItem.path,
        query: bItem.query ? bItem.query : {}
    })
}
</script>

<style lang="scss" scoped>
.el-breadcrumb {
    font-size: 18px;
    font-weight: 500;
    .el-breadcrumb__item {
        :deep(.el-breadcrumb__inner) {
            cursor: pointer;
            color: var(--color-grey-700);
            font-weight: bold;
            &:hover {
                color: var(--primary-color);
            }
        }
        &:last-child {
            :deep(.el-breadcrumb__inner) {
                line-height: 24px;
                cursor: text;
                font-weight: unset;
                color: var(--color-grey-600);
            }
        }
    }
}
</style>
