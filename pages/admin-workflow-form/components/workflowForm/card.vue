<template>
<el-card @dblclick.stop="handleDbClick()">
    <div class="title ellipsis">{{data.name}}</div>
    <div class="subTitle">{{$t('task')}}1</div>
    <div class="taskListContainer">
        <div v-for="(item, index) in data.userTasks" class="ellipsis" :title="item.name" 
            @click.stop="taskClick(item)"
            @dblclick.stop="handleDbClick(item)">{{item.name}}</div>
    </div>
</el-card>
</template>


<script lang="ts" setup>
const props = defineProps<{
    data: object
}>()
const router = useRouter()
// TODO copy
function taskClick(row) {
}
function handleDbClick(row) {
    if (!row) row = props.data.userTasks[0]
    router.push(`/workflowForm/${props.data.key}?taskId=${row.id}`)
}
</script>

<style lang="scss" scoped>
.el-card {
    background-color: var(--card-bg) !important;
    height: 200px;
    display: grid;
    :deep(.el-card__body) {
        display: grid;
        grid-template-rows: min-content min-content 1fr;
        overflow: hidden;
        .title {
            color: var(--primary-color);
            font-size: 1.5rem;
            cursor: pointer;
        }
        .subTitle {
            color: var(--primary-color);
            opacity: 0.7;
            padding: calc(var(--app-padding) / 2) 0;
        }
        .taskListContainer {
            overflow: auto;
            & > div{
                padding: calc(var(--app-padding) / 3) 0;
                color: var(--color-b3);
                &:hover {
                    color: var(--el-color-primary-light-3);
                }
            }
        }
    }
}
</style>