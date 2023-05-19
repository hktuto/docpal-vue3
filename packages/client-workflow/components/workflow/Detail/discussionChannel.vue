<template>
<div class="grid-layout">
    <el-button :class="['icon', state.expended? 'rotate': 'revert'] "
        @click="handelExpand" :icon="ArrowLeftBold" circle />
    <div :class="[{'discussionChannel--expand': state.expended }, 'discussionChannel']">
        <h4 class="title">{{ $t('common_discussionChannel') }}</h4>
        <div class="commentViewBox">
            <CommentCard v-for="(item) in state.commentList" :key="item.id" :commentInfo="item"></CommentCard>
        </div>
        <CommentInputBox @handleAdd="handleAddComment"/>
    </div>
</div>
</template>


<script lang="ts" setup>
import { getProcessCommentApi, sendProcessCommentsApi } from 'dp-api'
import { ArrowLeftBold } from '@element-plus/icons-vue'
const props = defineProps<{
    id: string
}>()
const userId:string = useUser().getUserId()
const state = reactive({
    expended: false,
    commentList: [],
})
function handelExpand () {
    state.expended = !state.expended
}
async function handleAddComment (text, callback) {
    const param = {
        processInstanceId: props.id,
        userId,
        text
    }
    const res = await sendProcessCommentsApi(param)
    callback()
    if (!res) return
    await getCommentList()
}
async function getCommentList () {
    const res = await getProcessCommentApi(props.id)
    state.commentList = res.map(item => ({
        text: item.text,
        creationDate: item.time,
        author: item.userId,
    })).reverse()
}
watch(() => props.id, (newValue) => {
    if (newValue) getCommentList()
}, { immediate: true })
</script>

<style lang="scss" scoped>
.grid-layout {
    display: grid;
    grid-template-columns: min-content 1fr;
}
.discussionChannel {
    width: 0;
    overflow: hidden;
    transition: all .5s;
    display: grid;
    grid-template-rows: min-content 1fr min-content;
    gap: var(--app-padding);
    &--expand {
        width: 380px;
        transition: all .5s;
    }
    h4 {
        line-height: 2rem;
        margin: unset;
        padding: unset;
    }
    .commentViewBox {
        overflow: auto;
    }
}
.rotate {
    transition: all 1s;
    transform:rotate(180deg);
}
.revert{
    transition: all 1s;
}
</style>
