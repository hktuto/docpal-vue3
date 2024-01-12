<template>
    <div class="ai-content--support" :style="`--support-align: ${props.position}; --support-cursor: ${ noInput ? 'default' : 'pointer' }`">
        <small>{{ $t('ai.helpTip') }}</small>
        <template v-if="mode === 'card'">
            <el-card v-for="item in supportList" @click="handleClick(item)">{{ item }}</el-card>
        </template>
        <template v-else>
            <div style="width: 100%">
                <el-tag v-for="item in supportList" @click="handleClick(item)">{{ item }}</el-tag>
            </div>
        </template>
    </div>
</template>
<script lang="ts" setup>
const props = withDefaults(defineProps<{
    supportList: string[],
    noInput: boolean,
    position: string,
    mode: 'card' | 'tag'
}>(),{
    position: 'center',
    noInput: false,
    mode: 'card'
})
const emits = defineEmits(['aiInput'])

function handleClick(value) {
    if (props.noInput) return
    emits('aiInput', value)
}
</script>
<style lang="scss" scoped>
.el-tag {
    margin: 0 5px 5px 0;
    cursor: var(--support-cursor, none);
}
.ai-content--support {
    display: flex;
    flex-direction: column;
    align-items: var(--support-align, center);
    gap: var(--app-padding);
    width: 100%;
    .el-card {
        cursor: var(--support-cursor, default);
        width: 100%;
        :deep .el-card__body {
            padding: var(--app-padding);
        }
    }
}
</style>
