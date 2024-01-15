<template>
    <el-drawer
        v-model="state.openAiDrawer"
        :show-close="false"
        :modal="false"
        custom-class="ai-file-drawer"
    >
        <AiChat :idOrPath="$route.query.path" @close="state.openAiDrawer = false"></AiChat>
    </el-drawer>
</template>
<script lang="ts" setup>
const props = defineProps(['doc'])
const state = reactive<any>({
    openAiDrawer: false
})
function open() {
    console.log('ooop');
    state.openAiDrawer = true
}
defineExpose({open})
</script>
<style lang="scss">
.ai-file-drawer {
    .el-drawer__header {
        margin-bottom: unset;
        padding: unset;
    }
    .el-drawer__body {
        background: var(--ask-ai-bg);
    }
}
</style>