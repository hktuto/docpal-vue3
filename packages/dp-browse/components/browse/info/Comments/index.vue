<template>
  <div class="comments" v-loading="state.loading">
    <!-- <span class="title">{{ $t('rightDetail_comments') }}</span> -->
    <CommentViewBox :commentList="state.commentList" 
                    :disabled="disabled"
                    @handleReply="handleReply"
                    @handleReplyDelete="handleReplyDelete"></CommentViewBox>
    <CommentInputBox id="commentRootInput" v-if="!disabled" v-model="state.commentInfo.text" @handleAdd="handleAddComment"></CommentInputBox>
  </div>
</template>

<script lang="ts" setup>
import anime from 'animejs'
import { useEventListener } from '@vueuse/core'
import { CommentsGetApi, CommentsDeleteApi, CommentsAddApi } from 'dp-api'
const props = defineProps<{
    doc: any,
    disabled: boolean
}>()
const state = reactive({
    loading: false,
    commentList: [],
    commentInfo: {
        text: '',
    }
})
async function handleAddComment (text, cb) {
    const res = await CommentsAddApi({
        text,
        documentIdOrPath: props.doc.id
    })
    if (!res) return
    state.commentInfo.text = ''
    await handleCommentsGet()
    cb()
}
async function handleReply(params: any, cb) {
    params.documentIdOrPath = props.doc.id
    const res = await CommentsAddApi(params)
    if (!res) return
    const resData = await CommentsGetApi({ documentIdOrPath: props.doc.id, parentId: params.parentId }) 
    cb(resData)
}
async function handleReplyDelete (item, parentItem) {
    const res = await CommentsDeleteApi({ commentId: item.id})
    if (!res) return
    if (!parentItem) {
        handleCommentsGet()
    } else {
        const resData = await CommentsGetApi({ documentIdOrPath: props.doc.id, parentId: parentItem.id }) 
        parentItem.children = resData
    }
}
async function handleCommentsGet () {
    state.loading = true
    try {
        const res = await CommentsGetApi({ documentIdOrPath: props.doc.id}) 
        if (!res) return
        for(const item of res) {
            if (item.parentId === props.doc.id) item.parentId = ''
            item.children = []
            item.children = await CommentsGetApi({ documentIdOrPath: props.doc.id, parentId: item.id }) 
        }
        state.commentList = res
        handleScroll()
    } catch (error) {
        
    }
    state.loading = false
}
function handleScroll () {
    nextTick(() => {
        const viewBox = document.getElementsByClassName('commentViewBox')[0]
        anime({
            targets: '.commentViewBox',
            duration: 200,
            scrollTop: viewBox.scrollHeight,
            easing:'easeInSine',
        })
    })
}
useEventListener(document, 'refreshComment', handleCommentsGet)
watch(() => props.doc, (val) => {
    if (val) handleCommentsGet()
}, { immediate: true })

</script>

<style lang="scss" scoped>
.comments {
    height: 100%;
    overflow: hidden;
    display: grid;
    grid-template-rows: 1fr min-content;
    gap: var(--app-padding);
}
</style>
