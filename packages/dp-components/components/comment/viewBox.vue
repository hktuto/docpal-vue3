<template>
<div class="commentViewBox">
    <CommentCard v-for="item in commentList" :key="item.id" :commentInfo="item" :replyItem="state.replyItem"
        canDelete canReply
        @handleReplyBox="handleReplyBox"
        @handleReplyDelete="handleReplyDelete(item)">
        <CommentInputBox v-show="inputShow(item)" 
            :class="{'commentInputBox-cur': state.replyItem && state.replyItem.id }"
            v-model="item.replyText" 
            @handleAdd="handleAddReply"></CommentInputBox>
        <div class="replyListBox" v-show="item.replyListShow">
            <CommentCard  v-for="(rItem) in item.children" :key="rItem.id" :commentInfo="rItem"
                    canDelete
                    @handleReplyDelete="handleReplyDelete(rItem, item)" />
        </div>
    </CommentCard>
</div>
</template>
<script lang="ts" setup>
import anime from 'animejs'
const props = defineProps<{
    commentList: any,
}>()
const state = reactive({
    replyItem: null
})
const emits = defineEmits(['handleReply','handleReplyDelete'])
function inputShow (row) {
    return state.replyItem && state.replyItem.id === row.id
}
// 回复成功后仅重新加载该commentId下的commentList(children)
function hideReplyBox (children, clearReplyText = true) {
    // const _commentInfo = props.commentList.find(item => item.id = state.replyItem.id)
    state.replyItem.children = children
    state.replyItem.replyListShow = true
    state.replyItem.replyInputShow = false
    setTimeout(() => {
        state.replyItem = null
    })
}
function handleAddReply (text, cb) {
    const param = {
        parentId: state.replyItem.id,
        text: text
    }
    emits('handleReply', param, (children) => {
        cb()
        hideReplyBox(children)
    })
}
function handleReplyBox (commentInfo) {
    if (commentInfo.replyInputShow) {
        state.replyItem = commentInfo
    } else {
        state.replyItem = null
        handleScroll()
    }
}
function handleScroll () {
    nextTick(() => {
        const viewBox = document.getElementsByClassName('commentViewBox')[0]
        const inputBox = document.getElementsByClassName('commentInputBox-cur')[0]
        // @ts-ignore
        if ((viewBox.scrollTop + viewBox.offsetHeight) < (inputBox.offsetTop + inputBox.scrollHeight)) {
            // @ts-ignore
            const scrollTop = inputBox.offsetTop + inputBox.scrollHeight * 2
            anime({
                targets: '.commentViewBox',
                duration: 200,
                scrollTop,
                easing:'easeInSine',
            })
        }
    })
}
function handleReplyDelete (item, parentItem) {
    emits('handleReplyDelete', item, parentItem)
}
</script>
<style lang="scss" scoped>
.commentViewBox {
    height: 100%;
    overflow: auto;
    .replyListBox {
        background-color: var(--color-grey-050);
        padding: 0 var(--app-padding);
    }
    :deep(.commentCard_slot) {
        .commentInputBox {
            margin: var(--app-padding) 0;
        }
    }
}
</style>


