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
    </div>
</div>
</template>
<script lang="ts" setup>
const props = defineProps<{
    commentInfo: Object
}>()
function getInitials (name) {
    const secondChar = name.length > 1 ? name.substring(1, 2) : ''
    return name.substring(0,1).toUpperCase() + secondChar
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
        grid-area: 1 / 3 / 2 / 4;
        display: flex;
        align-items: center;
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
</style>