<template>
<el-progress type="circle" :percentage="percentage" :format="format" :width="80" color="#17B2C0">
    <template #default="{ percentage }">
        <span class="percentage-value"> {{ props.options.completedNum }} / {{props.options.total}} </span>
        <span class="percentage-label">{{ options.curName }}</span>
    </template>
</el-progress>
</template>

<script lang="ts" setup>
export type progressType = {
    total: number,
    completedNum: number,
    title?: string,
    curName?: string,
    delay: number
}
const props = withDefaults(defineProps<{
    noticeId?: string
    options: progressType
}>(), {
    options: {
        total: 0,
        completedNum: 0,
        delay: 0
    }
})
const emit = defineEmits(["close"]);

const percentage = computed(() => {
    return (props.options.completedNum / props.options.total) * 100
})
function format(p) {
    return `${ props.options.completedNum }/${ props.options.total }`
}
watch(() => props.options.completedNum, (newValue) => {
    if (newValue === props.options.total) {
        setTimeout(() => {
            emit("close", props.noticeId);
        }, props.options.delay)
    }
})
</script>

<style scoped lang="scss">
</style>