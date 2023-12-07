<template>
<div class="new-item-child">
    <el-tree ref="treeRef" :data="treeData" :props="state.defaultProps"
        nodeKey="id" default-expand-all :expand-on-click-node="false"
        @node-click="handleNodeClick" >
        <template #default="{ node, data }">
            <div class="tree-item">
                <div >
                    <el-button v-if="data.loading" size="small" text circle :loading="data.loading"></el-button>
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
    <div>
        <template v-if="state.selectedRow && state.selectedRow.folder !== false ">
            {{state.selectedRow.label}}
            <MetaRenderForm ref="MetaFormRef" @formChange="handleMetaChange"></MetaRenderForm>
            <!-- <MetaEditForm ref="MetaFormRef" showNoData ></MetaEditForm> -->
        </template>
        <template v-else>
            {{$t('tip.clickFolderOrFileToSetMeta')}}
        </template>
    </div>
    <MetaRenderForm ref="MetaFormRef2" @formChange="handleMetaChange"></MetaRenderForm>
    <input  v-show="false" ref="fileUploaderRef"
                multiple
                type="file"
                @change="uploadHandler($event, 'fileUploader')"/>
</div>
</template>


<script lang="ts" setup>
import { ElMessageBox, ElMessage } from 'element-plus'
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
    selectedRow: {}
})
const treeRef = ref()
const MetaFormRef = ref()
const MetaFormRef2 = ref()
async function getData (isValidate: boolean = false) {
    state.isCheck = true
    try {
        const pList = []
        const nodeMap = Object.values(treeRef.value.store.nodesMap).reduce((prev, item) => {
            if (item.data.folder || 
                (!item.data.folder && item.data.raw)) {
                prev[item.data.id] = {
                    ...item.data,
                }
                const pItem = getErrorMessage(prev[item.data.id])
                pList.push(pItem)
                delete prev[item.data.id].children
            }
            return prev
        }, {})
        if (isValidate) {
            let errorMessage = await Promise.all(pList)
            errorMessage = errorMessage.filter(item => !!item)
            if(errorMessage.length > 0) {
                ElMessageBox.confirm(errorMessage.join('<br>'), $t('dpTip_warning'), {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: $t('dpButtom_confirm'),
                })
                throw new Error("error");
            } 
        }
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
        return result
    } catch (error) {
        
    }
    async function getErrorMessage (doc) {
        const _msg = await MetaFormRef2.value.getValidateMsg(doc.documentType , deepCopy(doc.properties) )
        if (_msg) return `<h4 class="msg-h4">${doc.label}:</h4>${_msg}`
        return ''
    }
}
function handleNodeClick (row) {
    state.selectedRow = row
    if (state.selectedRow.folder === false) return
    if (!state.selectedRow.properties) state.selectedRow.properties = {}
    // 用了 v-if，如果不用 nextTick 会报错
    nextTick(async() => {
        await MetaFormRef.value.init(state.selectedRow.documentType)
        MetaFormRef.value.setData(state.selectedRow.properties)
    })
}
function handleMetaChange(data) {
    // if(state.ready) state.selectedRow.properties = deepCopy(data.formModel)
    state.selectedRow.properties = deepCopy(data.formModel)
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
    async function uploadHandler (e) {
        const files = Array.from(e.target.files)
        state.treeItem.loading = true
        const pList = []
        const childData = getParentChildren(state.treeItem)
        files.forEach(async(file) => {
            pList.push(append(file))
        })
        e.target.value = '' // 解决不能上传相同文件问题
        const res = await Promise.all(pList)
        state.treeItem.loading = false
        
        async function append(file) {
            const index = childData.findIndex(item => item.label === file.name)
            if(index > -1) {
                ElMessage.warning('tip.fileExists')
                return
            }
            const param = {
                id: new Date().valueOf() + num++,
                raw: file,
                label: file.name,
                parentId: state.treeItem.parentId,
                documentType: state.treeItem.documentType,
                properties: {},
            }
            treeRef.value.append(param, state.treeItem)
        }
        function getParentChildren (curTreeItem) {
            if(!curTreeItem.parentId) return
            const pNode = treeRef.value.getNode(curTreeItem.parentId)
            const children = []
            getChild([pNode])
            return children
            function getChild(nodes) {
                nodes.forEach(node => {
                    if(!!node && !node.isLeaf) {
                        if(node.data && node.data.folder === false && node.data.children){
                            children.push(...node.data.children)
                        } 
                        if(node.childNodes) getChild(node.childNodes)
                    }
                })
            }
        }
    }
    function handleDeleteFile (treeItem) {
        treeRef.value.remove(treeItem)
    }
// #endregion
defineExpose({
    getData, treeRef
})
</script>

<style lang="scss" scoped>
.new-item-child {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--app-padding);
  @media( max-width: 640px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
}
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
.scroll-dialog {
    height: 50vh;
}

</style>
<style lang="scss">
.msg-h4 {
    margin: unset;
    padding: unset;
}
</style>
