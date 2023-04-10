<template>
    <div v-show="state.visible" ref="FileRightClickPopoverRef" class="fileRightClick-container">
        <el-menu :default-active="state.defaultActive" @select="handleSelect">
            <el-menu-item index="docActionAddFolder" v-show="canWrite && state.doc.isFolder">{{$t('filePopover_newFolder')}}</el-menu-item>
            <el-menu-item index="docActionAddFile" v-show="canWrite && state.doc.isFolder">{{$t('filePopover_uploadFolder')}}</el-menu-item>
            <el-menu-item index="docActionRename">{{$t('filePopover_rename')}}</el-menu-item>
            <el-menu-item index="docActionCopy">{{$t('filePopover_copy')}}</el-menu-item>
            <el-menu-item index="docActionCut" v-show="canWrite">{{$t('filePopover_cut')}}</el-menu-item>
            <el-menu-item index="docActionPaste" v-show="canWrite && state.copyItem.path">{{$t('filePopover_paste')}}</el-menu-item>
            <el-menu-item index="docActionDelete" v-show="canWrite"> {{$t('filePopover_delete')}}</el-menu-item>
            <el-menu-item index="docActionRefresh">{{$t('common_refresh')}}</el-menu-item>
        </el-menu>
    </div>
</template>

<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import { GetChild } from 'dp-api'
const props = defineProps<{
    permission?: any,
}>()
const emits = defineEmits(['rightActionClick']);
const state = reactive({
    visible: false,
    defaultActive: [],
    canWriteList: ['Everything', 'ManageLegalHold', 'ManageRecord', 'ReadWrite'],
    doc: {},
    copyItem: {}
})
const FileRightClickPopoverRef = ref()
const canWrite = computed(() => {
    if(!props.permission) return false
    return state.canWriteList.includes(props.permission.permission)
})
function handleRightClick (detail: any) {
    state.visible = true
    state.doc = {
        path: detail.idOrPath,
        isFolder: detail.isFolder
    }
    setTimeout(() => {
        state.defaultActive = []
        FileRightClickPopoverRef.value.style.left = detail.pageX + 'px'
        FileRightClickPopoverRef.value.style.top = detail.pageY + 'px'
        const popoverHeight = FileRightClickPopoverRef.value.offsetHeight
        const popoverWidth = FileRightClickPopoverRef.value.offsetWidth
        const windowHeight = window.innerHeight
        const windowWidth = window.innerWidth
        // 如果鼠标下边放不下菜单，就把top的值的改了
        if (detail.pageY + popoverHeight > windowHeight) {
            const top = detail.pageY - popoverHeight
            FileRightClickPopoverRef.value.style.top = top + 'px'
        }
        if (detail.pageX + popoverWidth > windowHeight) {
            const left = detail.pageX - popoverWidth
            FileRightClickPopoverRef.value.style.left = left + 'px'
        }
    })
}
function hidePopover () {
    if (!state.visible) return
    const event = window.event
    const driverList = [
        // 'driver-close-btn',
        // 'driver-prev-btn',
        // 'driver-next-btn',
        'driver-popover-title',
        'driver-popover-item',
        'driver-popover-description',
        'driver-class',
        'driver-highlighted-element-stage',
        'driver-clearfix driver-popover-footer',
        'driver-page-overlay'
    ]
    // @ts-ignore
    // 只有右击事件不响应隐藏事件
    if (event.button !== 2) {
        if(!FileRightClickPopoverRef.value) return
        // driver点击时不响应隐藏事件
        if(driverList.includes(event.target.className || event.target.id)) return
        state.visible = false
    }
}
function handleSelect (command: string) {
    if(command === 'docActionCopy' || command === 'docActionCut') state.copyItem.path = state.doc.path
    const data = state.doc
    const ev = new CustomEvent(command,{ detail: data })
    document.dispatchEvent(ev)
    emits('rightActionClick', command)
}
onMounted(() => {
    useEventListener(document, 'fileRightClick', (evt) => handleRightClick(evt.detail))  
    useEventListener(document, 'mouseup', hidePopover)  
})
</script>
<style lang="scss" scoped>
.fileRightClick-container {
    box-shadow: var(--el-box-shadow-light);
    position: fixed;
    z-index: 9999;
    width: 180px;
    .el-menu-item {
        height: unset;
        line-height: unset;
        padding: var(--app-padding);
    }
}
</style>