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
import { GetCabinetResultApi, GetCabinetTemplateApi } from 'dp-api'
const props = defineProps<{
    treeData: Object
}>();
const state = reactive({
    defaultProps: {
        children: 'children',
        label: 'label',
    },
    treeItem: {},
    isCheck: true
})
const treeRef = ref()
function getData () {
    state.isCheck = true
    // console.log(treeRef);
    const nodeMap = treeRef.value.store.nodesMap
    return Object.values(nodeMap).reduce((prev, item) => {
        const data = item.data
        if (data.folder === true) {
            const params = {
                name: data.label,
                idOrPath: data.relativePath,
                type: data.documentType
            }
            prev.push(params)
        } else if(data.raw) {
            const params = {
                document: {
                    name: data.label,
                    idOrPath: data.relativePath,
                    type: data.documentType,
                },
                files: data.raw
            }
            prev.push(params)
        }
        return prev
    }, [])
}
function getCss(data) {
    if(!state.isCheck) return ''
    if(data.folder === false && data.children.length === 0) {
        return 'lack-item'
    }
}
function showAddButton(data) {
    return data.folder === false &&
            !(!data.multiple && data.children.length > 0)
}
function checkData () {
    let result = true
    return result
    // console.log(treeRef, 'checkData');
    // const nodeMap = treeRef.value.store.nodesMap
    //     Object.values(nodeMap).forEach(item => {
    //         console.log(item.data);
    //         console.log(item.data.folder === false);
    //         if (item.data.folder === false && item.data.children && item.data.children.length === 0) {
    //             item.isLack = true
    //             result = false
    //         }
    //     })
    // console.log({nodeMap});
    
    // return result
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
            relativePath: state.treeItem.relativePath,
            documentType: state.treeItem.documentType
        }
        treeRef.value.append(param, state.treeItem)
    })
    e.target.value = '' // 解决不能上传相同文件问题
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
.lack-item {
    color: red;
}
</style>
