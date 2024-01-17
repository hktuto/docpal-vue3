<template>
    <div id="ai-chat-content" class="ai-chat-content" style="--icon-color: var(--primary-color)">
        <SvgIcon class="logo" src="/icons/logo/docpal-ai.svg"></SvgIcon>
        <div class="ai-init-help">
            <AiChatContentSupport v-if="!idOrPath" :supportList="questionList"
                @aiInput="(value) => emits('aiInput', value)" >
            </AiChatContentSupport>
            <small>{{ $t('ai.mistakesHelpTip') }}</small>
        </div>
        <AiChatContentList :chatRecord="chatRecord" @scrollBottom="scrollBottom"></AiChatContentList>
    </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
    questionList: any,
    chatRecord: any,
    idOrPath: string
}>(),{
    questionList: [],
    chatRecord: []
})
const emits = defineEmits(['aiInput'])
const scrollDownInterval = ref<any>()


function scrollBottom(){
  // scroll ai-chat-content to bottom
  const aiChatContent = document.getElementById('ai-chat-content')
  if (aiChatContent) {
    // set an interval to scrolldown aiChatContent
    scrollDownInterval.value = setInterval(() => {
      if(aiChatContent.scrollTop === aiChatContent.scrollHeight){
        console.log("clean")
        clearInterval(scrollDownInterval.value)
      }
      aiChatContent.scrollTop = aiChatContent.scrollHeight
    }, 300)
    
  }
}
</script>
<style lang="scss" scoped>
.ai-chat-content {
    position: relative;
    overflow: auto;
    padding-right: 4px;
  scroll-behavior: smooth;
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