<template>
<div class="o-auto">
    <el-timeline>
        <el-timeline-item v-for="(item, index) in activityList" :key="index"
            :timestamp="formatDate(item.time)" placement="top">
            <el-card>
                <h4>{{item.activityName}}</h4>
                <p> {{ item.assignee }} @
                    {{ formatDate(item.time) }}</p>
            </el-card>
        </el-timeline-item>
    </el-timeline>
</div>
</template>
<script lang="ts" setup>
const props = defineProps<{
    activityList: Array
}>()
</script>
<style lang="scss" scoped>
.o-auto {
    height: 100%;
    overflow: auto;
}
.el-timeline {
    padding: var(--app-padding);
}
</style>
