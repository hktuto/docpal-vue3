<template>
<div>
    <el-tree ref="treeRef" :data="treeData" :props="state.defaultProps"
        nodeKey="id" 
        @node-click="handleNodeClick" >
        <template #default="{ node, data }">
            <div class="tree-item">
                <div >
                    <SvgIcon v-if="data.folder" src="/icons/folder-general.svg"></SvgIcon>
                    <SvgIcon v-else-if="data.folder === false" src="/icons/file-general.svg"></SvgIcon>
                    <span :class="{danger: data.lack}">

                        {{data.label}}
                    </span>
                </div>
                <div style="--icon-size: 18px">
                    <SvgIcon v-if="data.folder === false" src="/icons/add.svg"
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
import { GetCabinetResultApi, GetCabinetTemplateApi } from 'dp-api'
const props = defineProps<{
    treeData: Object
}>();
const state = reactive({
    defaultProps: {
        children: 'children',
        label: 'label',
    },
    treeItem: {}
})
const treeRef = ref()
function getData () {
    // console.log(treeRef);
}
function checkData () {
    let result = true
    console.log(treeRef, 'checkData');
    const nodeMap = treeRef.value.store.nodesMap
    try {
        Object.values(nodeMap).forEach(item => {
            if (item.data.folder === false && item.data.children.length === 0) {
                item.lack = true
                result = false
                throw new Error()
            }
        })
    } catch (error) {
        
    }
    return result
}
const fileUploaderRef = ref()
function handleAddFile (treeItem) {
    state.treeItem = treeItem
    fileUploaderRef.value.click()
}
function uploadHandler (e) {
    const files = Array.from(e.target.files) 
    files.forEach((file) => {
        const param = {
            id: new Date().valueOf(),
            raw: file,
            label: file.name,
            relativePath: state.treeItem.relativePath
        }
        treeRef.value.append(param, state.treeItem)
    })
    // e.target.value = '' // 解决不能上传相同文件问题
}
function handleDeleteFile (treeItem) {
    treeRef.value.remove(treeItem)
}
defineExpose({
    getData, checkData
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
.danger {
    color: red;
}
</style>
