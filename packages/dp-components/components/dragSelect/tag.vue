<template>
    <el-tag ref="tagRef" :closable="!element.noDelete"
        v-click-outside="onClickOutside"
        @click="initForm"
        @close="handleClose()">{{ element[itemKey] }}</el-tag>
    <el-popover
        ref="popoverRef"
        placement="bottom"
        title="Title"
        :width="300"
        trigger="click"
        :virtual-ref="tagRef"
        virtual-triggering>
        <FromRenderer ref="FromRendererRef" :form-json="formJson" @formChange="handleFormChange"/>
    </el-popover>
</template>

<script lang="ts" setup>
import { unref } from 'vue'
import { ClickOutside as vClickOutside } from 'element-plus'
import { getJsonApi } from 'dp-api'
const props = withDefaults(defineProps<{
    element: any,
    itemKey: string,
}>(), {
    itemKey: 'metaData',
})
const emits = defineEmits([
    'close', 'change'
])
const tagRef = ref()
const popoverRef = ref()
const FromRendererRef = ref()
const formJson = getJsonApi('admin/dragSelect.json')
const onClickOutside = () => {

  unref(popoverRef).popperRef?.delayHide?.()
}
function handleClose () {
    emits('close', props.element)
}
function handleChange () {
    emits('change', props.element)
}
function initForm() {
    nextTick(() => {
        FromRendererRef.value.vFormRenderRef.setFormData(props.element)
    })
}
function handleFormChange (formData) {
    const label = formData.fieldName[0]
    const value = formData.fieldName[1]
    props.element[label] = value
}
</script>
<style lang="scss" scoped>
</style>
