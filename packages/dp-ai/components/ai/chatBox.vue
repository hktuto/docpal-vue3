<template>
<div class="commentInputBox">
    <el-input
        v-model="message"
        type="textarea"
        :rows="3"
        :placeholder="$t('ai.askMeAnything')"
        resize="none"
        :maxlength="state.maxLen"
        @keydown.enter.native="keyDown"
        />
    <div class="commentInputBox_ribbon">
        <span class="commentInputBox_ribbon_len">{{ message.length }} / {{ state.maxLen }}</span>
        <el-button type="primary" circle text class="buttonText" @click="handleEnter" :disabled="loading">
            <SvgIcon src="/icons/tools/send.svg"></SvgIcon>
        </el-button>
    </div>
</div>
</template>
<script lang="ts" setup>
const emits = defineEmits(['enter', 'update:modelValue'])
const props = defineProps<{
    modelValue?: string,
    loading: boolean
}>()
const state = reactive({
    test: '1',
    maxLen: 2000
})
const message = computed({ 
    get: () => props.modelValue, 
    set: (value) => emits('update:modelValue', value) 
}) 
function keyDown (e) {
    if(e.ctrlKey && e.keyCode === 13) {   //用户点击了ctrl+enter触发
        state._text += '\n';
    } else { //用户点击了enter触发
        handleEnter()
    }
}
function handleEnter () {
    if (props.loading || !message.value) return
    emits('enter')
}
</script>
<style lang="scss" scoped>
.commentInputBox {
    border-radius: 5px;
    background-color: #fff;
    padding: var(--app-padding) 2px 2px;
    :deep(.el-textarea__inner) {
        border: unset;
        box-shadow: unset;
        background-color: unset;
    }
    &_ribbon {
        display: flex;
        justify-content: end;
        align-items: center;
        &_len {
            font-size: 12px;
            color: var(--color-grey-500);
        }
    }
    .buttonText {
        background: transparent;
        &:hover, &:focus {
            background: transparent;
        }
    }
}
</style>
