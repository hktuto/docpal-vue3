<template>
    <div class="breadCrumbContainer">
        <!-- {{data}} -->
        <div v-if="data && data.length > 0" class="upLevel">
            <ElButton type="info" :icon="Back" circle @click="backToParent"/>
        </div>
        <div v-loading="pending" class="breadContainer">
            <div v-for="item in data" :key="data.id" class="breadItem">
                {{item.name}}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {Back} from '@element-plus/icons-vue'
const router = useRouter();
const props = defineProps<{
    path:string
}>()

const { data, refresh, pending } = useAsyncData(() => getBreadcrumb(props.path));
watch(props, () => refresh())

async function backToParent() {
    router.push()
}
</script>

<style lang="scss" scoped>
.breadContainer{
    display: flex;
    gap: var(--el-component-size-small);
}
.breadItem{

}
</style>