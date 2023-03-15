<template>
<div class="commentInputBox">
    <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        v-model="_text"
        :placeholder="$t('comments_placeholder')"
        resize="none"
        @keydown.enter.native="keyDown"
        ></el-input>
    <div class="commentInputBox_ribbon">
        <el-button type="primary" size="small" class="buttonText" @click="handleAdd" :loading="loading">{{
            $t('comments_buttonText')
        }}</el-button>
    </div>
</div>
</template>
<script lang="ts" setup>
const emit = defineEmits(['handleAdd'])
const props = defineProps<{
    text?: string
}>()
const state = reactive({
    _text: '',
    loading: false
})
function keyDown (e) {
    if(e.ctrlKey && e.keyCode === 13) {   //用户点击了ctrl+enter触发
        state._text += '\n';
    } else { //用户点击了enter触发
        handleAdd()
    }
}
function handleAdd () {
    const s = state._text.replace(/[\ +\n\r]/g,'')
    if (!s) {
        state._text = ''
        return
    }
    if (state.loading) return
    state.loading = true
    emit('handleAdd', state._text, () => { state.loading = false })
}
const { _text, loading } = toRefs(state)
watch(() => props.text, (newValue) => {
    state._text = newValue || ''
}, { immediate: true })
</script>
<style lang="scss" scoped>
.commentInputBox {
  border-radius: 5px;
  background-color: var(--color-grey-050);
  padding: var(--app-padding);
  :deep(.el-textarea__inner) {
    border: unset;
    box-shadow: unset;
    background-color: unset;
  }
  &_ribbon {
    text-align: right;
  }
}
</style>