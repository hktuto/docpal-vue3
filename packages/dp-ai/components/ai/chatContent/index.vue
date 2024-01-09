<template>
    <div class="ai-chat-content">

        <el-button class="ai-new-topic" type="primary" :icon="Plus" text >{{ $t('ai.topic')  }}</el-button>
    </div>
</template>

<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue';

const state = reactive<any>({
    initData: []
})
onMounted(() => {
    state.initData = {}
})
defineExpose({})
</script>
<style lang="scss" scoped>
.ai-chat-content {
    position: relative;
}
.ai-new-topic {
    position: absolute;
    bottom: 1px;
    right: 50%;
    transform: translate(50%, 0);
}
</style>