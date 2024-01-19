<template>
<div class="commentCard-container">
    <div class="commentCard">
        <div class="commentCard_avatars"> {{ getInitials(commentInfo.author) }} </div>
        <div class="commentCard_name ellipsis"> {{ commentInfo.author }} </div>
        <div class="commentCard_date"> {{ formatDate(commentInfo.creationDate) }} </div>
        <div class="commentCard_text">
            <span v-if="commentInfo.to" class="commentCard_text_to" >{{$t('comments_reply')}}  {{ commentInfo.to }}: </span>
            <span v-html="commentInfo.text"></span>
        </div>
        <div class="commentCard_ribbon"> 
            <el-button v-if="canReply" class="commentCard_ribbon_reply" @click="replyBoxShow" type="text" :icon="ChatSquare">
                {{ commentInfo.replyInputShow ? $t('dpTool_stow') :  $t('dpTool_reply') }}
            </el-button>
            <el-button v-if="commentInfo.children && commentInfo.children.length > 0" 
                    :class="['commentCard_ribbon_replyNum', commentInfo.replyListShow ? 'rotateLast' : 'rotateFirst']" 
                    @click="handleReplyNum" type="plain" link :icon="CaretBottom">
                {{commentInfo.children.length}}
            </el-button>
            <el-popover
                placement="top"
                width="20rem"
                trigger="click"
                v-model:visible="state.popoverShow">
                <template #reference>
                    <el-button v-if="userId === commentInfo.author && canDelete" type="danger" link @click="state.popoverShow = false" :icon="Delete"></el-button>
                </template>
                <p>{{$t('msg_confirmWhetherToDelete')}}</p>
                <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="state.popoverShow = false">{{$t('cancelText')}}</el-button>
                    <el-button type="primary" size="mini" @click="$emit('handleReplyDelete')">{{$t('dpButtom_confirm')}}</el-button>
                </div>
                
                <!-- class="commentCard_ribbon_reply el-icon-delete color__danger__hover el-icon--left el-icon--right cursorPointer" -->
            </el-popover>
            

        </div>
    </div>
    <div class="commentCard_slot">
      <slot></slot>
    </div>
</div>
</template>
<script lang="ts" setup>
import { ChatSquare, CaretBottom, Delete } from '@element-plus/icons-vue'
const props = defineProps<{
    commentInfo: Object,
    replyItem: Object,
    canReply: boolean,
    canDelete: boolean
}>()
const emits = defineEmits([
    'handleReplyDelete',
    'handleReplyBox',
    'handleReplyListShow'
])
const state = reactive({
    popoverShow: false
})
const userId:string = useUser().getUserId()
function getInitials (name) {
    const secondChar = name.length > 1 ? name.substring(1, 2) : ''
    return name.substring(0,1).toUpperCase() + secondChar
}
function handleReplyNum () {
    props.commentInfo.replyListShow = !props.commentInfo.replyListShow
}
function replyBoxShow () {
    props.commentInfo.replyInputShow = !props.commentInfo.replyInputShow
    emits('handleReplyBox', props.commentInfo)
}
</script>
<style lang="scss" scoped>
.commentCard {
    padding: var(--app-padding) var(--app-padding) var(--app-padding) 0;
    display: grid;
    grid-template-columns: min-content 1fr min-content;
    grid-template-rows: repeat(4, min-content);
    grid-column-gap: var(--app-padding);
    grid-row-gap: 0px;
    position: relative;
    &_avatars { 
        grid-area: 1 / 1 / 3 / 2; 
        width: 2.2rem;
        height: 2.2rem;
        border-radius: 50%;
        background-color: var(--primary-color);
        color: var(--color-grey-000);
        line-height: 2.2rem;
        text-align: center;
        align-self: center;
    }
    &_text { 
        grid-area: 3 / 2 / 4 / 4; 
        font-family: Roboto;
        font-style: normal;
        font-weight: normal;
        // font-size: 0.75rem;
        line-height: 1.5rem;
        color: var(--color-grey-900);
        &>span {
            white-space: break-spaces;
            word-break: break-word;
        }
        &_to{
            color: var(--color-grey-500);
        }
    }
    &_name { 
        grid-area: 1 / 2 / 2 / 3; 
        font-weight: bold;
        font-size: 14px;
    }
    &_date { 
        grid-area: 2 / 2 / 3 / 3;
        font-weight: normal;
        font-size: 8px;
        color: var(--color-grey-500);
    }
    &_ribbon { 
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        align-items: center;
        height: 32px;
        &_reply, &_replyNum {
            padding: unset;
            outline: unset;
            white-space: nowrap;
            &>span {
                margin-left: unset!important;
            }
        }
        &_reply {
            display: none;
        }
        &_replyNum {
            color: var(--color-grey-400);
        }
        .el-button + .el-button {
            margin-left: var(--app-input-padding);
        }
    }
    
    &_slot { 
        margin: var(--app-padding) var(--app-padding) var(--app-padding) 2rem;
    }
    &:hover { 
        .commentCard_ribbon_reply {
        display: block;
        }
    }
}
.rotateFirst {
    :deep(.el-icon)  {
        transform: rotate(180deg);
        transition: all 0.5s;
    }
}
.rotateLast {
    :deep(.el-icon) {
        transition: all 0.5s;
    }
}
</style>