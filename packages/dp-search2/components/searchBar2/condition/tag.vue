<template>
    <el-tag
        v-for="tag in dynamicTags"
        :key="tag.key"
        class="mx-1"
        closable
        @click="handleClick(tag)"
        @close="handleClose(tag)"
        @mouseover="changeHoverEle(tag, $event)"
        >
        <!-- @mouseleave="visible = false" -->
        <!-- size="large" -->
        {{ $t(tag.label) }}:  <b>{{ tag.str }}</b>
    </el-tag>
    <!-- :visible="visible" -->
    <el-popover
        ref="popoverRef"
        :virtual-ref="tagRef"
        virtual-triggering
        placement="bottom-start"
        :width="250"
        popper-class="searbar-card-container"
        trigger="click"
    >
        <SearchBar2CardKeyword v-if="currentTag && currentTag.key === 'paramsInTextSearch'"
            :textSearchType="textSearchType"
            :keyword="currentTag.value"
            @confirm="handleChange"></SearchBar2CardKeyword>
        <SearchBar2CardCheckbox v-else-if="currentTag && conditionStore[currentTag.key]" 
            :tag="currentTag"
            :condition="conditionStore[currentTag.key]"
            @confirm="handleChange"></SearchBar2CardCheckbox>
    </el-popover>
</template>
<script lang="ts" setup>
import { ClickOutside as vClickOutside } from 'element-plus';
const props = defineProps(['dynamicTags', 'conditionStore', 'textSearchType'])
const emits = defineEmits(['handleClose', 'change'])

const currentTag = ref()
const visible = ref(false);  //控制tooltip显示或隐藏
const popoverRef = ref()
const hide = (evt: any) => {
	visible.value = false
}
const tagRef: Ref<HTMLElement | null> = ref(null);
function changeHoverEle(tag: any, evt: any) {
    tagRef.value = evt.currentTarget;
    currentTag.value = tag
    // visible.value = true;
}
function handleClose(tag: any) {
    emits('handleClose', tag)
    popoverRef.value.hide()
}
function handleClick(tag: any) {
    visible.value = true
    currentTag.value = tag
}
function handleChange(data: any) {
    emits('change', { ...data })
    popoverRef.value.hide()
}
</script>
<style lang="scss">
.searbar-card-container {
    overflow: hidden !important;
}
</style>