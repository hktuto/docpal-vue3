<template>
<Interact
    rel="interactEl"
    :draggable="draggable"
    :resizable="true"
    :resizeOption="resizeOption"
    :style="style"
    :class="{infoContainer:true, infoOpened, draggable }"
    @resizemove="resizeMove"
    @dragmove="dragmove"
>
<!-- doc preview and name -->
<div class="infoHeaderSection">
    <slot name="header" />
    <div class="headerTopRow">
        <div class="name">{{ doc.name }} <BrowseActionsEdit ref="BrowseActionsEditRef" v-if="AllowTo({feature:'ReadWrite', permission })" :doc="doc" @success="handleRefresh"/></div>
        
        <SvgIcon :src="'/icons/close.svg'" @click="$emit('close')"/>
    </div>
</div>
<el-tabs v-if="detail"  class="tabContainer" v-model="currentTab" >
    <el-tab-pane :label="$t('rightDetail_info')" name="info">
        <div class="infoTagContainer">
            <div v-if="!hidePreview" class="infoPreviewContainer">
                <BrowseInfoPreview :doc="detail"  />
            </div>
            <BrowseInfoDocInfo :doc="detail" :permission="permission" @update="docUpdated"/>
        </div>
    </el-tab-pane>
    <el-tab-pane :label="$t('rightDetail_activities')" name="activities">
        <BrowseInfoActivities v-if="currentTab === 'activities'" :doc="detail" />
    </el-tab-pane>
    <el-tab-pane :label="$t('rightDetail_ocr')" name="ocr">
        <BrowseInfoOcr v-if="currentTab === 'ocr'" :doc="detail" />
    </el-tab-pane>
    <el-tab-pane v-if="allowFeature('DOC_COMMENT')" :label="$t('rightDetail_comments')" name="comments">
        <BrowseInfoComments v-if="currentTab === 'comments'" :doc="detail" :disabled="checkPermission(permission)"/>
    </el-tab-pane>
    <el-tab-pane v-if="!detail.isFolder" :label="$t('convert_convert')" name="convert">
        <BrowseInfoPicture v-if="allowFeature('DAM_FILE_CONVERTION')" :doc="detail" />
        <BrowseInfoConvert v-if="currentTab === 'convert'" :doc="detail" />
    </el-tab-pane>
    <!-- <el-tab-pane v-if="!detail.isFolder" :label="$t('rightDetail_related')" name="relate">
        <BrowseInfoRelate v-if="currentTab === 'relate'"  :doc="detail" />
    </el-tab-pane> -->
    <el-tab-pane v-for="slot in infoSlots" :key="slot.name" :label="$t(slot.name)" :name="slot.name">
      <component v-if="currentTab === slot.name" :is="slot.component" v-bind="{...$props, detail, permission}" />
    </el-tab-pane> 
</el-tabs>
  <div v-else v-loading="loading" class="loadingContainer">
    {{ detail }}
  </div>
</Interact>
</template>

<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import {deepCopy, DocDetail} from "dp-api";
import { getDocumentDetailSync } from '../../../utils/browseHelper';

const { infoSlots } = useBrowse()
const props = withDefaults(defineProps<{
    doc?: any,
    infoOpened?:boolean,
    hidePreview?:boolean,
    draggable?:boolean,
    resizeOption?: any,
    listData?: any,
    permission?: any,
}>(),{
    doc: null,
    infoOpened: false,
    hidePreview: false,
    draggable: false,
    resizeOption: {
        edges: { left: true, right: false, bottom: false, top: false }
    }
})
const interactEl = ref();
const userId:string = useUser().getUserId()
const { isMobile, allowFeature } = useLayout()
const { doc } = toRefs(props)
const currentTab = ref('info')
const maxWidth = 600;
const minWidth = 120;
const w = ref(400);
const h = ref(0);
const x = ref(0);
const y = ref(0);
const route = useRoute()
function checkPermission(permission) {
    if(!!permission?.hold?.status) {
        return ['A', 'L', 'P'].includes(permission.hold.status)
    }
    else if(!!permission?.retention?.status) {
        return ['A', 'D', 'P'].includes(permission.retention.status)
    }
    else return false 
}
const style = computed(() => {
    if(!props.infoOpened) return {
        width: '0px',
        height: "100%"
    }
    let result:any = {};
    if(w.value) {
      result.width = `${isMobile.value ? (window.innerWidth - 24) : w.value > (window.innerWidth - 24) ? (window.innerWidth - 24) : w.value}px`
    }

    if(props.draggable) {
        result.left = `${x.value}px`
        result.top = `${y.value}px`
    }
    return result
})
function resizeMove(event:any) {
    const min = Math.max(event.rect.width, minWidth)
    w.value = maxWidth ? Math.min(min, maxWidth) : min;
    x.value += event.deltaRect.left;
    y.value += event.deltaRect.top;
}
const loading = ref(false);
const detail = ref<DocDetail>();
const permission = ref<any>();

function dragmove(event:any) {
    x.value += event.dx;
    y.value += event.dy;
}

async function docUpdated(forceRefresh?: boolean = false) {
    if(props.listData && doc.value.id === props.listData.doc.id && !forceRefresh) {
        detail.value = deepCopy(props.listData.doc)
        permission.value = props.permission;
        return
    }
    loading.value = true;
    try {
        // @ts-ignore
        detail.value = null; // set detail to null to reset all tab
        // check doc is Folder or not, if is folder but tag is convert or relate, switch back to info
        if(doc.value.isFolder && ['convert', 'relate'].includes(currentTab.value)) {
            currentTab.value = 'info'
        }
        // get detail
        //   const response = await getDocumentDetail(doc.value.id, userId);
        const response = await getDocumentDetailSync(doc.value.id, userId);
        detail.value = response.doc;
        permission.value = response.permission;
        //scroll to top
        const tabContent = document.querySelector('#browseInfoSection .infoTagContainer');
        if(tabContent) {
            tabContent.scrollTop = 0;
        }
    } catch (error) {
        
    }
    loading.value = false;
}

watch(doc, async() => {
    if(!doc.value) return;
    docUpdated()
},{immediate:true})

defineExpose({
    interactEl
})
</script>

<style lang="scss" scoped>
.infoPreviewContainer{
    background: var(--color-grey-050);
    padding: var(--app-padding);
}
.infoHeaderSection{
  padding-block: var(--app-padding);
}
.headerTopRow{
  display: grid;
  grid-template-columns: 1fr min-content;
  gap: 12px;
  .name {
    font-weight: 800;
    font-size: 1.2rem;
    word-break: break-all;
    display: flex;
    flex-flow:row wrap;
    justify-content: flex-start;
    align-items: center;
    gap:clac(var(--app-padding));
  }
}
.infoContainer {
    margin-left: var(--app-padding);
    
    background: var(--color-grey-0000);
    height: 100%;
    user-select: none;
    -ms-touch-action: none;
    touch-action: none;
    overflow: auto;
    display: grid;
    grid-template-rows: min-content 1fr;
    border-radius: 12px;
    position: relative;
    padding:0;
    &.infoOpened{
        padding: var(--app-padding);
    }
    &.draggable{
        cursor: move;
        position: fixed;
    }
  @media (max-width: 640px) {
    margin-left: 0;
  }
}
.infoTagContainer{
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    gap: 6px;
    overflow: auto;
}
.tabContainer{
    width: 100%;
        height: 100%;
    overflow: hidden;
    position: relative;
        display: grid;
    grid-template-rows: min-content 1fr;
    :deep {
        .el-tab-pane{
            height: 100%;
            overflow: hidden;
        }
        .el-tabs__header {
            overflow: hidden;
        }
        .el-tabs__content{
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
        }
        .el-cascader{
            width: 100%;
        }
    }
}

.resize-drag {
  box-sizing: border-box;
  background: #41b883;

  /* To prevent interact.js warnings */
  user-select: none;
  -ms-touch-action: none;
  touch-action: none;
}
</style>
