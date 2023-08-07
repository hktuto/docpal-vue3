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
            <MetaEditForm ref="MetaFormRef" showNoData @meta-change="handleMetaChange"></MetaEditForm>
        </template>
        <template v-else>
            {{$t('tip.clickFolderOrFileToSetMeta')}}
        </template>
    </div>
    <MetaEditForm v-show="false" ref="MetaFormRef2"></MetaEditForm>
    <input  v-show="false" ref="fileUploaderRef"
                multiple
                type="file"
                @change="uploadHandler($event, 'fileUploader')"/>
</div>
</template>


<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
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
function getData (isValidate: boolean = false) {
    state.isCheck = true
    let msg = ''
    const nodeMap = Object.values(treeRef.value.store.nodesMap).reduce((prev, item) => {
        prev[item.data.id] = {
            ...item.data,
        }
        if (prev[item.data.id] && prev[item.data.id].metaList) {
            const _msg = MetaFormRef2.value.getValidateMsg(deepCopy(prev[item.data.id].metaList) , deepCopy(prev[item.data.id].properties) )
            if (_msg) msg += `<h4 class="msg-h4">${prev[item.data.id].label}:</h4>${_msg}`
        }
        delete prev[item.data.id].children
        return prev
    }, {})
    if (msg.length > 0 && isValidate) {
        ElMessageBox.confirm(msg, $i18n.t('dpTip_warning'), {
            dangerouslyUseHTMLString: true,
            confirmButtonText: $i18n.t('dpButtom_confirm'),
        })
        return false
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
}
function handleNodeClick (row) {
    state.selectedRow = row
    if (state.selectedRow.folder === false) return
    if (!state.selectedRow.properties) state.selectedRow.properties = {}
    // 用了 v-if，如果不用 nextTick 会报错
    nextTick(async() => {
        MetaFormRef.value.initMeta(state.selectedRow.documentType, state.selectedRow.properties)
    })
}
function handleMetaChange (properties: any) {
    state.selectedRow.properties = properties
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
        files.forEach(async(file) => {
            pList.push(append(file))
        })
        e.target.value = '' // 解决不能上传相同文件问题
        const res = await Promise.all(pList)
        state.treeItem.loading = false

        async function append(file) {
            const param = {
                id: new Date().valueOf() + num++,
                raw: file,
                label: file.name,
                parentId: state.treeItem.parentId,
                documentType: state.treeItem.documentType,
                properties: {},
                metaList: await MetaFormRef2.value.metaListGet(state.treeItem.documentType, {})
            }
            treeRef.value.append(param, state.treeItem)
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
