<template>
<el-dialog v-model="state.visible" :title="$t('folderCabinet.uploadList')"
    :close-on-click-modal="false"
    class="scroll-dialog"
    >
    <div v-for="item in state.uploadList">
        <div>{{item.name}}</div>
        <el-tree ref="treeRef" :data="item.treeData" :props="state.defaultProps"
            nodeKey="id" default-expand-all :expand-on-click-node="false"
            @node-click="handleNodeClick" >
            <template #default="{ node, data }">
                <div class="tree-item">
                    <div >
                        <SvgIcon v-if="data.folder" src="/icons/folder-general.svg"></SvgIcon>
                        <SvgIcon v-else src="/icons/file-general.svg"></SvgIcon>
                        <span>
                            {{data.label}}
                        </span>
                    </div>
                    <div style="--icon-size: 18px">
                        {{data.status}}
                    </div>
                </div>
            </template>
        </el-tree>
    </div>

    <template #footer>
        <el-button :loading="state.loading" @click="handleConfirm">{{$t('common_confirm')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import {  } from 'dp-api'
const uploadListAdd = inject('uploadListAdd')

const state = reactive({
    loading: false,
    visible: false,
    uploadList: []
})
// #region module: init
    function handleConfirm () {
        state.visible = false
    }
    async function handleOpen(uploadList) {
        console.log(uploadList);
        
        state.visible = true
        state.uploadList = uploadList
    }
// #endregion

defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>
.tree-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    & > div {
        display: flex;
        align-items: center;
        gap: calc(var(--app-padding) / 3);
    }
}
</style>
