<template>
<div :class="getClass()">
    <el-button :icon="state.shrink ? ArrowRightBold : ArrowLeftBold" circle 
        @click="handleShrink"/>
</div>
</template>
<script lang="ts" setup>
import { ArrowRightBold, ArrowLeftBold } from '@element-plus/icons-vue'
const props = defineProps<{
    targetDom: any,
}>()
const state = reactive({
    shrink: false
})
function getClass () {
    if (state.shrink) return 'shrink-btn-container is-shrink'
    else return 'shrink-btn-container'
}
function handleShrink () {
    state.shrink = !state.shrink
    const dom = props.targetDom
    if (state.shrink) {
        dom.style.width = '48px'
        dom.style.minWidth = '20px'
    } else {
        dom.style.width = ''
        dom.style.minWidth = ''
    }
}
onMounted(() => {
    nextTick(() => {
        props.targetDom.style.position = 'relative'
    })
})
</script>

<style lang="scss" scoped>
.shrink-btn-container {
    position: absolute;
    right: 0px;
    top: 5px;
}
.shrink-btn-container.is-shrink{
    width: 100%;
    height: 100%;
    background-color: #fff;
}
</style>