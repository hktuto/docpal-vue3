<template>
    <div class="ai-chat-content" style="--icon-color: var(--primary-color)">
        <SvgIcon class="logo" src="/icons/logo/docpal-ai.svg"></SvgIcon>
        <div class="ai-init-help">
            <small>{{ $t('ai.helpTip') }}</small>
            <el-card v-for="item in questionList" @click="emits('aiInput', item)">{{ item }}</el-card>
            <small>{{ $t('ai.mistakesHelpTip') }}</small>
        </div>
        <AiChatContentList :chatRecord="chatRecord"></AiChatContentList>
    </div>
</template>

<script lang="ts" setup>
import {  } from 'dp-api'

const props = withDefaults(defineProps<{
    questionList: any,
    chatRecord: any
}>(),{
    questionList: [],
    chatRecord: []
})
const emits = defineEmits(['aiInput'])

const state = reactive<any>({
})

onMounted(() => {
})
defineExpose({})
</script>
<style lang="scss" scoped>
.ai-chat-content {
    position: relative;
    overflow: auto;
    padding-right: 4px;
}
// .ai-new-topic {
//     position: absolute;
//     bottom: 1px;
//     right: 50%;
//     transform: translate(50%, 0);
// }
.ai-init-help {
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    gap: var(--app-padding);
    align-items: center;
    text-align: center;
    .el-card {
        width: 100%;
        cursor: pointer;
        border-radius: 10px;
        :deep .el-card__body {
            text-align: left;
        }
    }
    small {
        color: var(--color-grey-500);
    }
}
.logo {
    padding: 16px;
    :deep .svg-icon {
        transform: scale3d(2.5, 2.5, 2.5);
        cursor: unset;
        &:hover {
            opacity: 1;
        }
    } 
}
</style>