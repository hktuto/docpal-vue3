<template>
<div ref="CardRef" class="folder-cabinet-card">
    <div class="folder-cabinet-card-header ">
        <div :class="setting.folder ? 'folder-title' : 'file-title'">{{setting.label}}</div>
        <div class="flex-x-end" style="--icon-size: 14px; --icon-bg-size: 24px">
            <span v-if="setting.multiple" class="el-icon--left file-title">{{$t('multiple')}}</span>
            <span class="el-icon--left">{{$t(setting.documentType)}}</span>
            <slot name="actions">
                <SvgIcon class="el-icon--left" src="/icons/edit.svg" 
                    @click="handleEdit(setting, isRoot, parentSetting?.children)"/>
                <SvgIcon v-if="!isRoot"  class="el-icon--left" src="/icons/menu/trash.svg" 
                    @click="handleDelete(setting)"/>
                
                <el-dropdown v-if="setting.folder">
                    <SvgIcon class="el-icon--left" src="/icons/add.svg" />
                    <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="handleAdd(setting, false)">File</el-dropdown-item>
                        <el-dropdown-item @click="handleAdd(setting, true)">Folder</el-dropdown-item>
                    </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-icon v-if="!isRoot" :class="state.isCollapse ? 'rotate' : 'revert'" @click="handleCollapse"><ArrowDownBold /></el-icon>
            </slot>
        </div>
    </div>
    <FolderCabinetCard v-for="item in setting.children" :setting="item" :parentSetting="setting"></FolderCabinetCard>
     
</div>
</template>

<script lang="ts" setup>
import { ArrowDownBold } from '@element-plus/icons-vue'
import { tpFolderCabinetSetting, CreateCabinetTemplateApi } from 'dp-api'
const props = defineProps<{
    parentSetting: tpFolderCabinetSetting,
    setting: tpFolderCabinetSetting,
    isRoot: boolean
}>()
const emit = defineEmits([
    'update'
])
const state = reactive({
    isCollapse: false
})
const CardRef = ref()
const handleAdd = inject('handleAddChild')
const handleDelete = inject('handleDeleteChild')
const handleEdit = inject('handleEdit')

function handleCollapse () {
    if(state.isCollapse) {
        state.isCollapse = false
        CardRef.value.style.height = 'unset'
        CardRef.value.style.overflow = 'auto'
    } else {
        state.isCollapse = true
        CardRef.value.style.height = '50px'
        CardRef.value.style.overflow = 'hidden'
    }
}
onMounted(() => {
})
</script>

<style lang="scss" scoped>
.folder-cabinet-card {
    background-color: #fff;
    border: 1px solid #A8B5C1;
    border-radius: 3px;
    padding: var(--app-padding);
    margin-top: var(--app-padding);
    &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .folder-title {
        color: #0099FF;
    }
    .file-title {
        color: #13A24C;
    }
}
.rotate {
    transition: all 1s;
    transform:rotate(180deg);
}
.revert{
    transition: all 1s;
}
</style>
