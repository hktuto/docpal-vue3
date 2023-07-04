<template>
<div v-loading="state.loading">
    <h3>{{state.activeDoc.label}}</h3>
    <el-tree :data="state.treeData" :props="state.defaultProps"
        @node-click="handleNodeClick" >
        <template #default="{ node, data }">
            <div class="tree-item">
                <div >
                    <SvgIcon v-if="data.folder" src="/icons/folder-general.svg"></SvgIcon>
                    <SvgIcon v-else-if="data.folder === false" src="/icons/file-general.svg"></SvgIcon>
                    <span :class="getCss(data)">
                        {{data.label || data.title || data.name}}
                    </span>
                </div>
                <div style="--icon-size: 18px">
                    <SvgIcon v-if="showAddButton(data)" src="/icons/add.svg"
                        @click="handleAddFile(data)"></SvgIcon>
                    <SvgIcon v-if="data.isDoc" src="/icons/menu/trash.svg"
                        @click="handleDeleteFile(data)"></SvgIcon>
                    <SvgIcon v-if="data.isDoc" src="/icons/menu/trash.svg"
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
import { GetCabinetResultApi, MatchingTemplateApi } from 'dp-api'
const route = useRoute()
const state = reactive({
    id: '',
    treeData: [],
    defaultProps: {
        children: 'children',
        label: 'label'
    },
    loading: false,
    activeDoc: {},
    docMap: {}
})
// #region module: tree
    function handleNodeClick () {}
// #endregion
    async function init (docItem: any, templateId: string) {
        state.loading = true
        state.activeDoc = docItem
        try {
            const data = await MatchingTemplateApi(docItem.id)
            if(data.children) {
                addDocToChildren(data.children)
                state.treeData = data.children
            }
        } catch (error) {
            state.treeData = []
        }
        state.loading = false
    }
    function addDocToChildren(children, rootId) {
        if (children) 
            children.forEach(item => {
                addDocToChildren(item.children, item.rootId)
                if(item.documents) {
                    if(!item.children) item.children = []
                    const documents = item.documents.reduce((prev, docItem) => {
                        if (!docItem.isFolder) {
                            docItem.isDoc = true
                            prev.push(docItem)
                        }
                        else {
                            state.docMap[docItem.id] = docItem
                        }
                        return prev 
                    }, [])
                    item.children.push(...documents)
                }
                if(!item.rootId && rootId) item.rootId = rootId
            })
    }
// #region module: style
    function getCss(data) {
        if(data.folder === true || data.isDoc) return ''
        return data.complete ? '' : 'color__danger'
    }
    function showAddButton(data) {
        return data.folder === false &&
                !(!data.multiple && data.children && data.children.length > 0)
    }
// #endregion
// #region module: actions
    const fileUploaderRef = ref()
    function handleAddFile (treeItem) {
        state.treeItem = treeItem
        fileUploaderRef.value.click()
    }
    function uploadHandler(e) {
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
// #endregion
defineExpose({ init })
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

}
</style>
