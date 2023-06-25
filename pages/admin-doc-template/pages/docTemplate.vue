<template>
    <NuxtLayout class="fit-height withPadding">
        <div class="grid-layout" >
            <DocTemplateTree ref="treeRef" :rootDataGetApi="rootDataGet"
                    :leafDataGetApi="leafDataGet"
                    @loadFinish="handleClick"
                    @rootLoadFinish="handleClick"
                    @handleNodeClick="handleClick"
                    @node-contextmenu="(e,d)=>handleRightClick(e,d)"
                    @contextmenu="(e)=>handleRightClick(e,state.rootDoc, true)">
                <template #default="{ node, data }">
                    <div class="doc-container ellipsis">
                        <BrowseItemIcon class="el-icon--left" :type="data.isFolder ? 'folder' : 'file'"/>
                        {{data.name}}
                    </div>
                </template>
            </DocTemplateTree>
            <div class="main" v-loading="state.loading">
                <div class="flex-x-between">
                    <div>{{state.doc.name}}</div>
                    <div class="flex-x-between" v-if="!state.doc.isFolder">
                        <el-button type="text" @click="handleDownload">Download original</el-button>
                        <!-- <BrowseActionsDelete :doc="state.doc" @success="handleRefreshDelete"/> -->
                    </div>
                    <!-- <el-button text :loading="state.loading"></el-button> -->
                </div>
                <template v-if="!state.doc.isFolder">
                    <Reader ref="ReaderRef" v-bind="state.previewFile" ></Reader>
                </template>
                <template v-else>
                    <SvgIcon src="/icons/folder-selected.svg" class="svg-container"></SvgIcon>
                </template>
            </div>
        </div>
        <LazyBrowseRightClick :permission="state.permission"></LazyBrowseRightClick>
        <BrowseActionsPaste v-show="false" @success="handleRefreshPaste"/>
        <BrowseActionsUpload v-show="false" @success="handleRefresh"/>
        <BrowseActionsNewFolder v-show="false" @success="handleRefresh"/>
        <BrowseActionsDelete v-show="false" @success="handleRefreshDelete"/>
        <BrowseActionsEdit v-show="false" @success="handleRefreshParent"/>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    GetChild,
    GetDocDetailApi,
    GetDocumentPreview,
    patchDocumentApi,
    GetBreadcrumb,
    DownloadDocApi } from 'dp-api'

import { getAclsApi } from 'dp-api/src/endpoint/admin-acl'
import { useEventListener } from '@vueuse/core'
interface Tree {
  name: string,
  leaf?: boolean,
}
const state = reactive({
    loading: false,
    doc: {},
    rootDoc: {
        path: '/default-domain/templates'
    },
    rightDoc: {},
    previewFile: {
        blob: null,
        name: '',
        id: '',
        loading: false,
        options: {
            noDownload: true,
            print: false,
            loadAnnotations: false,
        }
    },
    permission: {
        permission: "Everything"
    }
})
const router = useRouter()
const treeRef = ref()
async function leafDataGet (pageParams) {
    const res = await GetChild(pageParams.idOrPath)
    return res
}
async function rootDataGet () {
    const res = await GetDocDetailApi(state.rootDoc.path)
    state.rootDoc = res
    return [{ ...res }]
}
async function handleClick (doc) {
    try {
        treeRef.value.treeRef.setCurrentKey(doc.id)
        state.doc = deepCopy(doc)
        if(!state.doc.isFolder) {
            state.loading = true
            await getPreviewFile(state.doc)
        }
    } catch (error) {

    }
    setTimeout(() => {
        state.loading = false
    }, 200)
}
const ReaderRef = ref()
async function getPreviewFile (doc) {
    state.previewFile.loading = true
    try {
        state.previewFile.id = doc.id
        state.previewFile.name = doc.name
        state.previewFile.blob = await GetDocumentPreview(doc.id)
    } catch (error) {
    }
    state.previewFile.loading = false
}
async function getParentPath (path) {
    const res = await GetBreadcrumb(path)
    const paths = res.reduce((prev, item) => {
        prev.push(item.path)
        return prev
    }, [])
    paths.pop()
    return paths[paths.length - 1]
}
async function handleRefreshParent (doc) {
    const data = await leafDataGet({idOrPath: doc.parentRef})
    await treeRef.value.treeRef.updateKeyChildren(doc.parentRef, data)
}
async function handleRefresh (doc) {
    const data = await leafDataGet({idOrPath: doc.id})
    await treeRef.value.treeRef.updateKeyChildren(doc.id, data)
}
async function handleRefreshPaste (doc, action) {
    if(action === 'cut') handleRefreshParent(doc)
    handleRefresh(doc)
}
async function handleRefreshDelete(doc) {
    handleRefreshParent(doc)
    if(doc.id === state.previewFile.id) {
        const nodesMap = treeRef.value.treeRef.store.nodesMap
        state.previewFile = {}
        treeRef.value.treeRef.setCurrentKey(doc.parentRef)
    }
}
async function handleDownload () {
    const response = await DownloadDocApi(state.previewFile.id)
    downloadBlob(response, state.previewFile.name)
}
function handleRightClick (event, data, isEmpty: boolean = false) {
    event.preventDefault()
    event.stopPropagation();
    const detail = {
        doc: { ...data },
        isFolder: data.isFolder,
        idOrPath: data.path,
        pageX: event.pageX,
        pageY: event.pageY,
    }
    if (isEmpty || data.path === state.rootDoc.path) detail.actions = {
        cut: false,
        copy: false,
        rename: false,
        delete: false
    }
    state.rightDoc = data
    const ev = new CustomEvent('fileRightClick',{ detail })
    document.dispatchEvent(ev)
}
onMounted(() => {
    useEventListener(document, 'docActionRefresh', (event) => handleRefresh(event.detail))
})
</script>

<style lang="scss" scoped>
.grid-layout{
    height: 100%;
    overflow: hidden;
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: var(--app-padding);
    .el-tree {
        overflow: auto;
        .doc-container {
            display: grid;
            grid-template-columns: min-content 1fr;
            overflow: hidden;
            align-items: center;
            :deep(img) {
                width: 26px;
            }
        }
    }
    :deep(.el-tree-node__content) {
        height: 32px;
    }
    .main {
        display: grid;
        grid-template-rows: min-content 1fr;
        &>div{
            margin-bottom: var(--app-padding);
        }
        .svg-container {
            margin-bottom: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            --icon-size: 6rem;
        }
    }
}
</style>
