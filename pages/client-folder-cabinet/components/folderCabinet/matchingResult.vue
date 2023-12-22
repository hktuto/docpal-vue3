<template>
<div v-loading="state.loading">
    <h3>{{state.activeDoc.label}}</h3>
    <el-tree ref="treeRef" :data="state.treeData" :props="state.defaultProps"
        default-expand-all :expand-on-click-node="false"
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
                    <div v-if="showFolderError(data)" class="color__danger size12">{{$t('msg.NoOtherFilesAllowed')}}</div>
                    <div v-if="showError(data)" class="color__danger size12">{{$t('onlyOneFileAllow')}}</div>
                    <SvgIcon v-if="showAddButton(data)" src="/icons/file/newFolder.svg"
                        @click="handleAddFile(data)"></SvgIcon>
                    <SvgIcon v-if="data.isDoc" src="/icons/menu/trash.svg"
                        @click="handleDeleteFile(data)"></SvgIcon>
                    <SvgIcon v-if="data.isDoc" src="/icons/eye.svg" :content="$t('common_preview')"
                        @click="handlePreview(data)"></SvgIcon>
                    <SvgIcon v-if="data.isDoc" :src="'/icons/replace.svg'" :content="$t('tip.replace')" 
                        @click="handleOpenReplaceDialog(data)"/>
                </div>
            </div>
        </template>    
    </el-tree>
    <BrowseActionsReplaceDialog ref="BrowseActionsReplaceDialogRef" 
        @update="refresh" />
    <FolderCabinetCreateUploadFileDialog ref="UploadFileDialogRef" 
        @success="refresh" />
</div>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
    GetCabinetResultApi, 
    MatchingTemplateApi, 
    trashApi, 
    replaceFileDocumentApi } from 'dp-api'
const route = useRoute()
const state = reactive({
    id: '',
    treeData: [],
    defaultProps: {
        children: 'children',
        label: 'label'
    },
    loading: false,
    docMap: {},  // 存在的文件夹
    activeDoc: {},  // table选中项
    templateId: '', // tab选中项
    activeTreeItem: {} // tree选中项
})
const emits = defineEmits([
    'refresh'
])
// #region module: tree
    function handleNodeClick () {}
// #endregion

// #region module: init
    async function init (docItem: any, templateId: string) {
        state.loading = true
        state.activeDoc = docItem
        state.templateId = templateId
        try {
            const data = await MatchingTemplateApi(docItem.id)
            if(data.children) {
                addDocToChildren(data.children, data.documentPath)
                state.treeData = data.children
            }
        } catch (error) {
            state.treeData = []
        }
        state.loading = false
    }
    function addDocToChildren(children, documentPath) {
        if (children) 
            children.forEach(item => {
                addDocToChildren(item.children, item.documentPath)
                if(item.documents) {
                    if(!item.children) item.children = []
                    const documents = item.documents.reduce((prev, docItem) => {
                        if (!docItem.isFolder) {
                            docItem.isDoc = true
                            prev.push(docItem)
                        }
                        return prev 
                    }, [])
                    item.children.push(...documents)
                }
                if(!item.documentPath && documentPath) item.documentPath = documentPath
            })
    }
// #endregion

// #region module: style
    function showError (data) {
        if(data.folder === true || data.isDoc) return false
        return !data.multiple && data.children && data.children.length > 1
    }
    function showFolderError (data) {
        return false
        return data.folder === true && !data.complete
    }
    function getCss(data) {
        if(data.isDoc) return 'ellipsis'
        return data.complete ? 'ellipsis' : 'ellipsis color__danger'
    }
    function showAddButton(data) {
        return data.folder === false &&
                !(!data.multiple && data.children && data.children.length > 0)
    }
// #endregion

// #region module: actions
    function refresh() {
        state.loading = true
        // 有延时
        setTimeout(async() => {
            emits('refresh')
            await init(state.activeDoc, state.templateId )
            state.loading = false
        }, 1000)
    }
    const treeRef = ref()
    // #region module: handleAddFile
        const UploadFileDialogRef = ref()
        function handleAddFile (treeItem) {
            state.activeTreeItem = treeItem
            UploadFileDialogRef.value.handleOpen(treeItem)
        }
    // #endregion
    
    async function handleDeleteFile (data) {
        const action = await ElMessageBox.confirm(`${$t('msg_confirmWhetherToDelete')}`)
        if(action !== 'confirm') return
        await trashApi([{ idOrPath: data.path }])
        refresh()
    }
    function handlePreview(row) {
        openFileDetail(row.path, {
            showInfo:true,
            showHeaderAction: true
        })
    }
    const BrowseActionsReplaceDialogRef = ref()
    function handleOpenReplaceDialog(doc) {
        BrowseActionsReplaceDialogRef.value.handleOpen(doc)
    }
// #endregion
defineExpose({ init })
</script>

<style lang="scss" scoped>
.tree-item {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr min-content;
    & > div {
        display: flex;
        align-items: center;
        gap: calc(var(--app-padding) / 3);
    }
}
.size12 {
    font-size: 12px;
}
</style>
