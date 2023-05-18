<template>
<Interact
    :resizable="true"
    :resizeOption="{
            edges: { left: true, right: false, bottom: false, top: false }
        }"
    :style="style"
    :class="{infoContainer:true, infoOpened:!infoOpened}"
    @resizemove="resizeMove"
>
<!-- doc preview and name -->
<div class="infoHeaderSection">
    <div class="headerTopRow">
        <div class="name">{{ doc.name }}</div>
        <SvgIcon :src="'icons/close.svg'" @click="$emit('close')"/>
    </div>
</div>
<el-tabs v-if="detail"  class="tabContainer" v-model="currentTab" >
    <el-tab-pane :label="$t('rightDetail_info')" name="info">
        <div class="infoTagContainer">
            <div class="infoPreviewContainer">
                <BrowseInfoPreview :doc="detail" @update="docUpdated"/>
            </div>
            <BrowseInfoDocInfo :doc="detail" :premission="premission"/>
<!--     move info picture to it own tag or download tag       -->

            
<!--            <BrowseInfoAcl :doc="detail" />-->
<!--            -->
        </div>
    </el-tab-pane>
    <el-tab-pane :label="$t('rightDetail_activities')" name="activities">
        <BrowseInfoActivities v-if="currentTab === 'activities'" :doc="detail" />
    </el-tab-pane>
    <el-tab-pane v-if="!detail.isFolder" :label="$t('convert_convert')" name="convert">
        <BrowseInfoPicture :doc="detail" />
        <BrowseInfoConvert v-if="currentTab === 'convert'" :doc="detail" />
    </el-tab-pane>
    <el-tab-pane v-if="!detail.isFolder" :label="$t('rightDetail_related')" name="relate">
        <BrowseInfoRelate v-if="currentTab === 'relate'"  :doc="detail" />
    </el-tab-pane>
</el-tabs>
  <div v-else v-loading="loading" class="loadingContainer"></div>
</Interact>
</template>

<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import {DocDetail} from "dp-api";
import {getDocumentDetail} from "~/utils/browseHelper";

const props = defineProps<{
    doc: any,
    infoOpened:boolean
}>()
const {user} = useUser();
const { doc } = toRefs(props)
const currentTab = ref('info')
const maxWidth = 600;
const minWidth = 120;
const w = ref(400);
const h = ref(0);
const x = ref(0);
const y = ref(0);

const style = computed(() => {
    if(!props.infoOpened) return {
        width: '0px',
        height: "100%"
    }
    let result:any = {};
    if(w.value) {
    result.width = `${w.value}px`
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
const premission = ref<any>();

async function docUpdated() {
  loading.value = true;
  // @ts-ignore
  detail.value = null; // set detail to null to reset all tab
  // check doc is Folder or not, if is folder but tag is convert or relate, switch back to info
  if(doc.value.isFolder && ['convert', 'relate'].includes(currentTab.value)) {
    currentTab.value = 'info'
  }

  // get detail
  const response = await getDocumentDetail(doc.value.id, user.value.username);
  detail.value = response.doc;
  premission.value = response.permission;
  //scroll to top
  const tabContent = document.querySelector('#browseInfoSection .infoTagContainer');
  if(tabContent) {
    tabContent.scrollTop = 0;
  }
  loading.value = false;
}

watch(doc, async() => {
    if(!doc.value) return;
  docUpdated()
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
  }
}
.infoContainer {
    margin-left: var(--app-padding);
    padding: var(--app-padding);
    background: var(--color-grey-0000);
    height: 100%;
    user-select: none;
    -ms-touch-action: none;
    touch-action: none;
    overflow: hidden;
    display: grid;
    grid-template-rows: min-content 1fr;
    border-radius: 12px;
    &.infoOpened{
        padding:0;
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
        .el-tabs__content{
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
        }
    }
}
</style>
