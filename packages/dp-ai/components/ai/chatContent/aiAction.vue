<template>
    <div class="action-container">
        <SvgIcon class="el-icon--left" src="/icons/tools/answer.svg"></SvgIcon>
        <div class="action-content">
            {{ $t(placeholder) }}
            <slot></slot>
        </div>       
    </div>
</template>
<script lang="ts" setup>
const props = defineProps(['placeholder'])
</script>
<style lang="scss" scoped>
.action-container {
    display: flex;
    align-items: flex-start;
}
.action-content {
    word-break: break-all;
    line-height: 24px;
    :deep b {
        display: contents;
    }
}
</style>