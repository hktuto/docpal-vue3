<template>
    <div class="ai-chat-container">
        <AiChatContent ref="AiChatContentRef" 
            :loading="state.loading" 
            :chatRecord="state.chatRecord"
            :idOrPath="idOrPath"
            v-bind="state.aiInit"
            @aiInput="(value: string) => state.searchParams.question = value"> </AiChatContent>
        <div>
            <el-button v-if="showAddCurrentContext" class="ai-new-topic" type="primary" :icon="Plus" text @click="state.searchParams.idOrPath = route.query.path">{{ $t('ai.addCurrentContext')  }}</el-button>
            <el-button class="ai-new-topic" type="primary" :loading="state.newTopicLoading" :icon="Plus" text @click="handleNewTopic">{{ $t('ai.newTopic')  }}</el-button>
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
import { Plus } from '@element-plus/icons-vue';
import { useResizeObserver } from '@vueuse/core'
import { AiChatInitApi, AiAaskQuestionApi } from 'dp-api'
import { aiChatRecord } from '../../utils/aiChat'

const props = defineProps(['idOrPath'])
const emits = defineEmits(['close'])

const userId:string = useUser().getUserId()
const route = useRoute()
const state = reactive<any>({
    searchParams: {
        question: ''
    },
    loading: false,
    newTopicLoading: false,
    fullScreen: false,

    aiInit: {
        maxWordCount: 2000,
        questionList: [],
        topicId: ''
    },
    chatRecord: []
})
const showAddCurrentContext = computed(() => {
    return route.path.includes('/browse') && !state.searchParams.idOrPath
})
const AiChatContentRef = ref()

async function handleEnter() {
    state.loading = true
    try {
        const searchParams = { ... state.searchParams }
        const chatRecord1 = new aiChatRecord({
            author: userId,
            question: state.searchParams.question,
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
            type: _chatRecord2.questionType === 'explain' && !_chatRecord2.answer ? 'notFound' : _chatRecord2.questionType,
            question: searchParams.question,
            answer: _chatRecord2.answer
        })
        // state.chatRecord.pop()
        state.chatRecord.push(chatRecord2) // 分开写，避免接口异常带来bug
    } catch (error) {
        console.log('error', error);
        const chatRecordOdd = new aiChatRecord({
            author: 'AI',
            type: error.message.includes('timeout') ? 'timeout' : 'notFound'
        })
        state.chatRecord.push(chatRecordOdd)
    }
    setTimeout(() => {
        state.loading = false
    }, 50)
}
function handleFullScreen() {
    let drawer = props.idOrPath ?  document.getElementsByClassName('ai-file-drawer')[0] : document.getElementById('drawer')
    if(!!drawer) drawer.requestFullscreen()
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
    state.newTopicLoading = true
    try {
        state.aiInit = await AiChatInitApi()
    } catch (error) {
        state.aiInit = {
            maxWordCount: 2000,
            questionList: [],
            topicId: ''
        }
    }
    if(props.idOrPath) state.searchParams.idOrPath = props.idOrPath
    state.newTopicLoading = false
}
function handleNewTopic() {
    state.searchParams.idOrPath = ''
    state.chatRecord = []
    init()
}
onMounted(() => {
    init()
    nextTick(() => {
        useResizeObserver(AiChatContentRef, (entries) => {
            if(!isFullscreen()) state.fullScreen = false
        })
    })
})
watch(() => props.idOrPath, (value) => {
    if(value) handleNewTopic()
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
