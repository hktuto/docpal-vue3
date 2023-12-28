<template>
    <el-dropdown @command="handleCommand">
        <span class="assetType-container" style="--icon-size: 14px">
            <SvgIcon :src="getIcon(assetType)" class="el-icon--left"/> 
            {{ getCommand(assetType) }}
            <el-icon class="el-icon--right"> <arrow-down /> </el-icon>
        </span>
        <template #dropdown>
            <el-dropdown-menu style="--icon-size: 14px">
                <el-dropdown-item v-for="item in state.commandList" :key="item.icon" :command="item.command">
                    <SvgIcon :src="item.icon" class="el-icon--left"/> 
                    {{ getCommand(item.command) }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>
<script lang="ts" setup>
import { ArrowDown  } from '@element-plus/icons-vue';
const props = defineProps(['assetType'])
const emits = defineEmits(['update:assetType'])
const state = reactive({
    commandList: [
        { icon: '/icons/file/document.svg', command: '' },
        { icon: '/icons/file/picture.svg', command: 'Picture' },
        { icon: '/icons/file/video.svg', command: 'Video' },
        { icon: '/icons/file/audio.svg', command: 'Audio' }
    ]
})
function getCommand(command: string) {
    return command ? $t(`searchType_${command}`) : $t('search.allFiles')
}
function getIcon(assetType: string) {
    const commandItem = state.commandList.find(item => item.command === assetType)
    return commandItem ? commandItem.icon : '/icons/file/document.svg'
}
function handleCommand (command: string) {
    console.log(command)
    emits('update:assetType', command)
}
</script>
<style lang="scss" scoped>
.assetType-container {
    height: 32px;
    // line-height: 32px;
    display: flex;
    align-items: center;
    padding: 0 var(--app-padding);
    background-color: #EDF0F3;
    border-radius: 4px;
}
</style>