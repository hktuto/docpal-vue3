<template>
    <div class="ai-chat-container">
        <AiChatContent ref="AiChatContentRef" 
            :loading="state.loading" 
            :chatRecord="state.chatRecord"
            v-bind="state.aiInit"
            @aiInput="(value: string) => state.searchParams.question = value"> </AiChatContent>
        <div>
            <el-button class="ai-new-topic" type="primary" :icon="Plus" text >{{ $t('ai.topic')  }}</el-button>
            <AiChatBox v-model="state.searchParams.question" :loading="state.loading" @enter="handleEnter"/>
        </div>
        <div class="ai-chat-tools" style="--icon-color: var(--color-grey-500)">
            <template v-if="!state.fullScreen">
                <SvgIcon src="/icons/tools/fullScreen.svg" @click="handleFullScreen"></SvgIcon>
                <SvgIcon src="/icons/close.svg" @click="emits('close')"></SvgIcon>
            </template>
            <template v-else>
                <SvgIcon src="/icons/tools/exitFullScreen.svg" @click="handleExitFullScreen"></SvgIcon>
            </template>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useResizeObserver } from '@vueuse/core'
import { AiChatInitApi, AiAaskQuestionApi } from 'dp-api'
import { aiChatRecord } from '../../utils/aiChat'

const emits = defineEmits(['close'])

const userId:string = useUser().getUserId()
const state = reactive<any>({
    searchParams: {
        question: ''
    },
    loading: false,
    fullScreen: false,

    aiInit: {
        maxWordCount: 2000,
        questionList: [],
        topicId: ''
    },
    chatRecord: []
})
const AiChatContentRef = ref()
async function handleEnter() {
    state.loading = true
    try {
        const searchParams = { ... state.searchParams }
        const chatRecord1 = new aiChatRecord({
            author: userId,
            text: state.searchParams.question,
        })
        const chatRecordLoading = new aiChatRecord({
            author: 'ai',
            type: 'loading'
        })
        state.chatRecord.push(chatRecord1, chatRecordLoading)
        state.searchParams.question = ''

        const _chatRecord2 = await AiAaskQuestionApi(searchParams)
        const chatRecord2 = new aiChatRecord({
            author: 'AI',
            searchResult: _chatRecord2.searchResult,
            id: _chatRecord2.answerId,
            type: _chatRecord2.questionType
        })
        state.chatRecord.pop()
        state.chatRecord.push(chatRecord2) // 分开写，避免接口异常带来bug
        const chatRecordOdd = new aiChatRecord({
            author: 'AI',
            type: 'odd'
        })
        state.chatRecord.push(chatRecordOdd)
    } catch (error) {
        console.log('errrrrrrrrrrrrrrr');
        state.chatRecord.pop()
        const chatRecordOdd = new aiChatRecord({
            author: 'AI',
            type: 'odd'
        })
        state.chatRecord.push(chatRecordOdd)
    }
    setTimeout(() => {
        state.loading = false
    }, 50)
}
function handleFullScreen() {
    document.getElementById('drawer')?.requestFullscreen()
    state.fullScreen = true
}
function handleExitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen()
    }
}
function isFullscreen() {
    return  !! (
        document.fullscreenElement ||
        document.mozFullScreen ||                         
        document.webkitIsFullScreen ||       
        document.webkitFullScreen || 
        document.msFullScreen 
    );
}
async function init() {
    try {
        state.aiInit = await AiChatInitApi()
    } catch (error) {
        state.aiInit = {
            maxWordCount: 2000,
            questionList: [],
            topicId: ''
        }
    }
}
onMounted(() => {
    init()
    nextTick(() => {
        useResizeObserver(AiChatContentRef, (entries) => {
            if(!isFullscreen()) state.fullScreen = false
        })
    })
})
</script>
<style lang="scss" scoped>
.ai-chat-container {
    height: 100%;
    overflow: hidden;
    display: grid;
    grid-template-rows: 1fr min-content;
    padding: 26px var(--app-padding) var(--app-padding);
    gap: var(--app-padding);
}
:fullscreen .ai-chat-container {
    width: 60vw;
    margin: auto;
}

.ai-chat-tools {
    position: absolute;
    top: var(--app-padding);
    right: var(--app-padding);
    display: flex;
    gap: 5px;
}
</style>
