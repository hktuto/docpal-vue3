<template>
    <NuxtLayout class="fit-height withPadding">
        <div class="grid-layout">
            <Tree ref="treeRef" :rootDataGetApi="rootDataGet"
                    :leafDataGetApi="leafDataGet"
                    @loadFinish="handleClick"
                    @handleNodeClick="handleClick">
                <template #default="{ node, data }">
                    <div class="doc-container">
                        <BrowseItemIcon class="el-icon--left" :type="data.isFolder ? 'folder' : 'file'"/>
                        {{data.name}}
                    </div>
                </template>
            </Tree>
            <div class="main" v-loading="state.loading">
                <div v-if="state.doc" class="topAction" >
                    <h3>{{state.doc.name}}
                        <!-- <ExportButton v-show="folderCurItem.isFolder" class="el-icon--right" :export-id="folderCurItem.id" :export-name="folderCurItem.name"></ExportButton> -->
                    </h3>
                    <el-select v-if="state.doc.properties" 
                        v-model="state.doc.properties['sec:clearanceLevel']" clearable 
                        placeholder="Clearance Level"
                        @change="clearanceLevelChange" >
                        <el-option v-for="o in state.options" :key="o" :label="o" :value="o"/>
                    </el-Select>
                </div>
                <div class="main-content" v-if="state.doc.name" >
                    <AclInherentTable v-if="state.doc.name !== 'Root'" :tableData="inheritedList" :doc="state.doc" @refresh="getAcls"></AclInherentTable>
                    <AclLocalTable :tableData="localList" :doc="state.doc" @refresh="getAcls"></AclLocalTable>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { GetChildThumbnail, GetDocDetailApi, patchDocumentApi } from 'dp-api'

import { getAclsApi } from 'dp-api/src/endpoint/admin-acl'
import type Node from 'element-plus/es/components/tree/src/model/node'
interface Tree {
  name: string,
  leaf?: boolean,
}
const state = reactive({
    doc: {},
    acls: {
        inherited: [],
        local: []
    },
    loading: false,
    options: [ 'classified', 'confidential','normal' ]
})
const treeRef = ref()
async function leafDataGet (pageParams) {
    const res = await GetChildThumbnail(pageParams)
    return res
}
async function rootDataGet () {
    const res = await GetDocDetailApi()
    return [{ ...res, name: 'Root'}]
}
async function handleClick (doc) {
    treeRef.value.treeRef.setCurrentKey(doc.logicPath)
    state.loading = true
    state.doc = deepCopy(doc)
    const res = await GetDocDetailApi(state.doc.id)
    state.doc = { ...res, ...doc }
    await getAcls()
    state.loading = false
}
async function getAcls () {
    state.acls = await getAclsApi(state.doc.id)
}
async function clearanceLevelChange (value) {
    try { 
        const form = {
            idOrPath: state.doc.id,
            properties: {
                        'sec:clearanceLevel':value || null
            }
        }
        dpLog(form);
        await patchDocumentApi(form);
        if(state.doc.properties) state.doc.properties['sec:clearanceLevel'] = value || null;
        ElMessage.success('success')
    } catch (error) {
        // ElMessage.error('error')
    }
}

// #region module: table data
    const inheritedList = computed(() => {
        const result = state.acls.inherited.reduce((prev,item) => {
        const exitItem = prev.find(prevItem => prevItem.userId === item.userId)
        if (exitItem) {
            exitItem.permission = item.permission
            permissionFilter(exitItem, item.permission, item.id)
        } else {
            permissionFilter(item, item.permission, item.id)
            prev.push(item)
        }
        return prev
        }, [])
        result.sort((a,b)=> (a.userId.localeCompare(b.userId) ));
        return deepCopy(result)
    })
    const localList = computed(() => {
      const result = state.acls.local.reduce((prev,item) => {
        const exitItem = prev.find(prevItem => prevItem.userId === item.userId)
        if (exitItem) {
          permissionFilter(exitItem, item.permission, item.id)
        } else {
          item.print = false
          item.read = false
          item.write = false
          item.manage = false
          item.loading = false
          item.printLoading = false
          permissionFilter(item, item.permission, item.id)
          prev.push(item)
        }
        return prev
      }, [])
      
      result.sort((a,b)=> (a.userId.localeCompare(b.userId) ));
      return JSON.parse(JSON.stringify(result)) 
    })
    function isRead (permission) {
      return ['Read', 'ReadWrite', 'ManageRecord', 'ManageLegalHold', 'Everything'].includes(permission)
    }
    function isWrite (permission) {
      return ['ReadWrite', 'ManageRecord', 'ManageLegalHold', 'Everything'].includes(permission)
    }
    function isManage (permission) {
      return ['Everything'].includes(permission)
    }
    function isPrint (permission) {
      return ['Print'].includes(permission)
    }
    function permissionFilter (aclItem, permission, id) {
      if(permission === 'Print') {
        aclItem.print = isPrint(permission)
        aclItem.printPermission = permission
        if (!aclItem.dpId) aclItem.dpId = []
        aclItem.dpId.push(id)
      } else {
        aclItem.acePermission = permission
        aclItem.aceId = id
        aclItem.read = isRead(permission)
        aclItem.write = isWrite(permission)
        aclItem.manage = isManage(permission)
      }
    }
// #endregion
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
            display: flex;
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
        border-left: 1px solid #ddd;
        padding: 0 var(--app-padding);
        display:grid;
        grid-template-rows: min-content 1fr;
        gap: var(--app-padding);
        height: 100%;
        overflow: hidden;
        .topAction {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        &-content {
           overflow: auto; 
           padding: var(--app-padding);
        }
    }
}
</style>