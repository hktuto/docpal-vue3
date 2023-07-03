<template>
<div>
    <el-tree ref="treeRef" :data="treeData" :props="state.defaultProps"
        nodeKey="id" default-expand-all :expand-on-click-node="false"
        @node-click="handleNodeClick" >
        <template #default="{ node, data }">
            <div class="tree-item">
                <div >
                    <SvgIcon v-if="data.folder" src="/icons/folder-general.svg"></SvgIcon>
                    <SvgIcon v-else-if="data.folder === false" src="/icons/file-general.svg"></SvgIcon>
                    <span :class="getCss(data)">
                        {{data.label}}
                    </span>
                </div>
                <div style="--icon-size: 18px">
                    <SvgIcon v-if="showAddButton(data)" src="/icons/add.svg"
                        @click="handleAddFile(data)"></SvgIcon>
                    <SvgIcon v-if="data.raw" src="/icons/menu/trash.svg"
                        @click="handleDeleteFile(data)"></SvgIcon>
                </div>
            </div>
        </template>
    </el-tree>
    <input  v-show="false" ref="fileUploaderRef"
                multiple
                type="file"
                @change="uploadHandler($event, 'fileUploader')"/>
</div>
</template>


<script lang="ts" setup>
import { deepCopy, GetCabinetResultApi, GetCabinetTemplateApi } from 'dp-api'
const props = defineProps<{
    treeData: Object
}>();
const state = reactive({
    defaultProps: {
        children: 'children',
        label: 'label',
    },
    treeItem: {},
    isCheck: true,
})
const treeRef = ref()
function getData () {
    state.isCheck = true
    const nodeMap = Object.values(treeRef.value.store.nodesMap).reduce((prev, item) => {
        prev[item.data.id] = {
            ...item.data,
        }
        delete prev[item.data.id].children
        return prev
    }, {})
    const result = []
    Object.values(nodeMap).forEach((item) => {
        if(item.folder !== false) {
            const parent = nodeMap[item.parentId]
            if(!!parent) {
                if(!parent.children) parent.children = []
                parent.children.push(item)
            } else {
                result.push(item)
            }
        }
    })
    console.log({result});
    
    return result
}
// #region module: style
    function getCss(data) {
        if(!state.isCheck) return ''
        if(data.folder === false && data.children && data.children.length === 0) {
            return 'lack-item'
        }
    }
    function showAddButton(data) {
        return data.folder === false &&
                !(!data.multiple && data.children && data.children.length > 0)
    }
// #endregion

// #region module: tree actions
    const fileUploaderRef = ref()
    function handleAddFile (treeItem) {
        state.treeItem = treeItem
        fileUploaderRef.value.click()
    }

    let num = 1
    function uploadHandler (e) {
        const files = Array.from(e.target.files) 
        files.forEach((file) => {
            const param = {
                id: new Date().valueOf() + num++,
                raw: file,
                label: file.name,
                parentId: state.treeItem.parentId,
                documentType: state.treeItem.documentType
            }
            treeRef.value.append(param, state.treeItem)
        })
        e.target.value = '' // 解决不能上传相同文件问题
    }
    function handleDeleteFile (treeItem) {
        treeRef.value.remove(treeItem)
    }
// #endregion
defineExpose({
    getData
})
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
.lack-item {
    color: red;
}
</style>
