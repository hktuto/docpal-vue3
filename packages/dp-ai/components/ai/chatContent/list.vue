<template>
    <div class="ai-chat-record-container">
        <template v-for="item in chatRecord">
            <div v-if="item.type === 'question'"  :key="item.id" class="ai-chat--question">{{ item.question }}</div>
            <div v-else-if="item.type === 'search'" :key="item.id" class="ai-chat--search">
                <AiChatContentAiAction placeholder="ai.searchingFor">
                    <b>{{ item.question }}</b>
                </AiChatContentAiAction>
                <AiChatContentSearchResult :searchResult="item.searchResult" @scrollBottom="$emit('scrollBottom')"/>
            </div>
            <div v-else-if="item.type === 'explain'"  :key="item.id" class="ai-chat--explain">
                <div>{{ item.answer }}</div>
                <el-button v-if="!state.commentedList.includes(item.id)" :loading="state.commentLoading" @click="handleAddToComment(item.id)">{{ $t('ai.addTocomment') }}</el-button>
            </div>
            <AiChatContentAiAction v-else-if="item.type === 'loading'" placeholder="ai.generatingAnswer"/>
            <AiChatContentAiAction v-else :placeholder="`ai.${item.type}`"/>
            <AiChatContentSupport v-if="item.type === 'notFound'" :supportList="item.supportList"
                :noInput="true">
                <!-- mode="tag" position="start" -->
            </AiChatContentSupport>
        </template>
        <br/>
    </div>
</template>
<script lang="ts" setup>
import { AddAiCommentApi } from 'dp-api'
import { ElMessage } from 'element-plus'
const emits = defineEmits(['scrollBottom'])
const props = withDefaults(defineProps<{
    chatRecord: any
}>(),{
    chatRecord: []
})

const state = reactive<any>({
    commentLoading: false,
    commentedList: []
})

async function handleAddToComment(id) {
    state.commentLoading = true
    try {
        const result = await AddAiCommentApi(id)

        if (result === 'success') ElMessage.success($t('dpMsg_success'))
        else ElMessage.error(result)
        
        state.commentedList.push(id)
        sessionStorage.setItem('commentedList', state.commentedList)
        const ev = new CustomEvent('refreshComment')
        document.dispatchEvent(ev);
    } catch (error) {
        ElMessage.error('error')
    }

    setTimeout(() => {
        state.commentLoading = false
    }, 1000);
}
onMounted(() => {
    const commentedList = sessionStorage.getItem('commentedList')
    if(!!commentedList) state.commentedList = commentedList || []
})
watch(props.chatRecord, () => {
  setTimeout(() => {
    emits('scrollBottom')
  },500)
})
</script>
<style lang="scss" scoped>
.ai-chat-record-container {
    display: flex;
    flex-direction: column;
    gap: var(--app-padding);
}
.ai-chat--question {
    max-width: 80%;
    background-color: var(--primary-color);
    padding: var(--app-padding);
    color: var(--color-grey-050);
    text-align: left;
    border-radius: 4px;
    align-self: end;
    word-break: break-all; 
}
.ai-chat--explain {
    div:first-child {
        background-color: var(--primary-color);
        padding: var(--app-padding);
        color: var(--color-grey-050);
        text-align: left;
        border-radius: 4px;
        word-break: break-all; 
    }
    .el-button {
        margin-top: var(--app-padding);
    }
}
</style>