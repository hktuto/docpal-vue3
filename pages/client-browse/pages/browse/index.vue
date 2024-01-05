<template>
<NuxtLayout>
    <template #headerLeft>
        <slot name="headerLeft"></slot>
    </template>
    <page-container>
        <div v-if="currentDocument" class="browsePageContainer">
            <div v-if="selectList.length === 0 && currentDocument.doc.path !== '/'"
                 class="browseHeader">
                 <slot name="breadcrumb">
                    <BrowseBreadcrumb :ref="(el) => breadCrumb = el" :path="routePath" rootPath="/" />
                </slot>
                <div id="browseHeaderRight" class="folderAction">
                    <CollapseMenu>
                        <template #default="{collapse}">

                            <template v-for="(group,key) in folderActions" :key="key">
                                <template v-for="item in group" :key="item.name">
                                <component :is="item.component" :doc="currentDocument.doc" :permission="currentDocument.permission"  @success="handleRefresh" @delete="itemDeleted" />
                                </template>
                                <div :class="{actionDivider:true, collapse}"></div>
                            </template>

                        </template>
                    </CollapseMenu>
                    <BrowseActionsInfo :doc="currentDocument.doc" :permission="currentDocument.permission" @click="infoOpened = !infoOpened"/>
                </div>
            </div>
            <div v-else-if="selectList.length !== 0" class="browseHeader--multi selectedAction">
                <div class="color__primary">{{$t('dpDocument_fileSelected')}}({{selectList.length}})</div>
                <CollapseMenu>
                    <el-button type="text" size="small" @click="handleClearSelected">{{$t('button.clearSelected')}}</el-button>
                  <template v-for="(group,key) in shareActions" :key="key">
                    <template v-for="item in group" :key="item.name">
                      <component :is="item.component" :doc="currentDocument.doc" :permission="currentDocument.permission" :selectedList="selectList"  @clearSelected="handleClearSelected" @success="handleRefresh" />
                    </template>
                    <div :class="{actionDivider:true, collapse}"></div>
                  </template>
                </CollapseMenu>
            </div>
            <BrowseList
                v-loading="loading"

                :doc="currentDocument.doc"
                :permission="currentDocument.permission"
                @select-change="handleSelectionChange"
            >
                <template  #default="{doc, permission}" >
                    <BrowseInfo v-if="currentDocument.doc && currentDocument.permission" :doc="selectList.length === 1 ? selectList[0] : doc" :listData="currentDocument" :permission="permission" :infoOpened="infoOpened" @close="infoOpened = false" />
                    <BrowseRightClick></BrowseRightClick>
                    <BrowseActionsEdit v-if="AllowTo({feature:'ReadWrite', permission })" v-show="false" :doc="currentDocument.doc" @success="handleRefresh"/>
                </template>
            </BrowseList>
        </div>

        <!-- global action -->
        <BrowseActionsPaste v-show="false" @success="handleRefresh"/>
        <BrowseActionsNewFolder v-show="false" @success="handleRefresh"/>
        <BrowseActionsUploadDoc v-show="false" @success="handleRefresh"/>
    </page-container>

</NuxtLayout>
</template>


<script lang="ts" setup>

import { DocDetail } from 'dp-api';
import { Permission } from '../../../../packages/dp-browse/utils/permissionHelper';
import {openFileDetail} from '../../../../packages/dp-browse/utils/browseHelper';
import {useBrowse} from "../../../../packages/dp-browse/composables/browse";
import {useRoute} from "vue-router";
import {useEventListener} from "@vueuse/core";
import {actions, ActionsFilter} from "../../../../packages/dp-browse/utils/browseActions";


// #region refs
const breadCrumb = ref();

const router = useRouter();
const { allowFeature } = useLayout()

const route = useRoute();
const {loading,actions,routePath, currentDocument,getDocDetail,handleRefresh} = useBrowse()



const { public:{feature} } = useRuntimeConfig();
const selectList = ref<any[]>([])
// #endregion
provide('selectList', selectList)

const infoOpened = ref(false);





function itemDeleted(){
     //  FIXME: item deleted may not be the current path
     breadCrumb.value.goParent();
}


function handleSelectionChange (rows:any) {
    selectList.value = [...rows]
}
function handleClearSelected() {
    const ev = new CustomEvent('setTableSelection')
    document.dispatchEvent(ev)
}


function detailClosed() {
    breadCrumb.value.goParent();
}

const folderActions = computed(() => {
  if(!currentDocument.value.doc || !currentDocument.value.permission) return {}
  return ActionsFilter(actions, currentDocument.value.permission, 'showInFolder')
})

const shareActions = computed(() => {
  if(!currentDocument.value.doc || !currentDocument.value.permission) return {}
  return ActionsFilter(actions, currentDocument.value.permission, 'showInShare')
})

useEventListener(document, 'docActionRefresh', (event) => handleRefresh())
useEventListener(document, 'tree-node-update', (event) => getDocDetail())

watch(()=>route, async() => {
  loading.value = true
  try {
    await getDocDetail()
  } catch (error) {

  }
  loading.value = false
},{immediate:true,deep:true});

</script>

<style lang="scss" scoped>
.browsePageContainer{
    display: grid;
    grid-template-rows: min-content 1fr;
    gap : 0;
    height: 100%;
    overflow: hidden;
    position: relative;

}
.browseHeader{
    display: grid;
    grid-template-columns: 1fr min-content;
    justify-content: flex-start;
    align-items: center;
    position: relative;
}
.browseHeader--multi {
    width: calc(100% - 10px);
    margin: 5px;
    display: grid;
    padding: 6px 16px;
    grid-template-columns: 1fr min-content;
    justify-content: flex-start;
    align-items: center;

    background: #fff;
    border-radius: 36px;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.3);
}
.fileName{
    font-size: 1.5rem;
    font-weight: 500;
    color: #fff;
}
.actions, #browseHeaderRight{
    display: flex;
    flex-flow: row nowrap;
    gap: var(--app-padding);
    justify-content: flex-start;
    align-items: center;
    font-size: 16px;
    --icon-size: 16px;

}
.actionDivider{
    height: calc( var(--icon-size) + 16px);
    width: 1px;
    background: var(--color-grey-100);
    &.collapse{
      width:100%;
      height: 1px;
    }
}
.fileNameContainer{
    display: flex;
    flex-flow: row nowrap;
    gap: var(--app-padding);
    align-items: center;
}
#browseInfoSection{
    overflow: hidden;
}
:deep {
    .actionIconContainer{
        font-size: var(--icon-size);
        background: var(--color-grey-150);
        padding: 8px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        color: var(--color-grey-950);
        cursor: pointer;
        &:hover{
            background: var(--color-grey-200);
        }
    }
}
#browseInfoSection {
    :deep {
        .infoContainer {
            padding-top: 0px;
        }
    }
}
</style>
