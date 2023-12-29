<template>
    <div class="browseDetailContainer">
      <teleport to="body">
        <div v-if="show && doc" class="dialog">
            <div id="modalHeader">
              <div class="fileNameContainer">
                <div class="fileName">{{ doc.name }}
                  <el-tag v-if="doc.properties && doc.properties['file:content'] && doc.properties['file:content']['mime-type']" class="doc-extension" effect="dark">{{ mime.extension(doc.properties['file:content']['mime-type']) }}</el-tag>
                  <el-tag effect="dark">{{ editMode ? 'edit' : 'readonly' }}</el-tag>
                </div>
              </div>
              <div class="actions">
                <template v-if="options.showHeaderAction" >
                  <CollapseMenu @openedChange="mobileActionsOpenedChanged">
                    <template #default="{collapse}">
                      <!-- {{AllowTo({feature:'Read', permission })}} -->
                      <BrowseActionsHold :doc="doc" :permission="permission"/>
                      <BrowseActionsEdit ref="BrowseActionsEditRef" v-if="AllowTo({feature:'ReadWrite', permission })" :doc="doc" @success="handleRefresh"/>
                      <BrowseActionsSubscribe v-if="allowFeature('SUBSCRIBE')" :doc="doc" />
                      <div v-show="AllowTo({feature:'ReadWrite', permission })" :class="{actionDivider:true, collapse}"></div>
                      <BrowseActionsReplace :doc="doc" v-if=" AllowTo({feature:'ReadWrite', permission })" @success="handleRefreshPreview"/>
                      <!-- <BrowseActionsReplace :doc="doc" v-if=" AllowTo({feature:'ReadWrite', permission }) && !doc.isCheckedOut" @success="handleRefresh"/> -->
                      <BrowseActionsDownload v-if="AllowTo({feature:'Read', permission })"  :doc="doc"  />
                      <BrowseActionsDelete v-if="AllowTo({feature:'ReadWrite', permission })" :doc="doc" @delete="itemDeleted" @success="handleRefresh"/>
                      <BrowseActionsCopyPath v-if="AllowTo({feature:'ReadWrite', permission })" :doc="doc" />
                      <BrowseActionsOffice v-if="AllowTo({feature:'ReadWrite', permission })" :doc="doc" @submit="editMode = !editMode"/>
                      <div v-show="AllowTo({feature:'ReadWrite', permission })" class="actionDivider"></div>
                      <BrowseActionsShare  v-if="allowFeature('SHARE_EXTERNAL') && AllowTo({feature:'ReadWrite', permission })" :doc="doc" :hideAfterClick="true" />

                      <!-- {{AllowTo({feature:'Read', permission })}} -->
                      <!-- <SvgIcon src="/icons/close.svg" round ></SvgIcon> -->
                      
                    </template>
                  </CollapseMenu>
                  <div v-show="AllowTo({feature:'ReadWrite', permission })" :class="{actionDivider:true, collapse}"></div>
                  <BrowseActionsInfo  :doc="doc" @click="infoOpened = !infoOpened"/>
                  <div  :class="{actionDivider:true, collapse}"></div>
                </template>
                <SvgIcon class="closeBtn" src="/icons/close-only.svg" :content="$t('close')" round @click="closePreview"></SvgIcon>
              </div>
            </div>
            <div class="content">
                <div v-if="readerType && !editMode" :class="{preview:true, mobileActionOpened}" >
                    <LazyCollaboraViewer v-if="readerType === 'collabora'" ref="PreviewRef" :docId="doc.id" fileType="nuxeo" :readonly="true"/>
                    <LazyHtmlViewer v-if="readerType === 'html'" ref="PreviewRef" :doc="doc" />
                    <LazyPdfViewer v-if="readerType === 'pdf'" ref="PreviewRef" :doc="doc" :options="{loadAnnotations:true  && allowFeature('DOC_ANNOTATION'), print: permission.print && allowFeature('DOC_PRINT'), readOnly: !AllowTo({feature:'ReadWrite', permission }) || !allowFeature('DOC_ANNOTATION')}" />
                    <LazyVideoPlayer v-else-if="readerType === 'video'" ref="PreviewRef" :doc="doc" />
                    <LazyOtherPlayer v-else-if="readerType === 'other'" ref="PreviewRef" :doc="doc"></LazyOtherPlayer>
                </div>
                <div v-else-if="editMode" :class="{preview:true, mobileActionOpened}">
                  <LazyCollaboraViewer  ref="PreviewRef" :docId="doc.id" fileType="nuxeo" :readonly="false"/>
                </div>
                <h2 v-else class="noSupportContainer" >
                    {{ $t('msg_thisFormatFileIsNotSupported') }}
                </h2>
                <div class="info">
                  
                  <BrowseInfo v-if="options.showInfo" :doc="doc" :permission="permission" :infoOpened="infoOpened" :hidePreview="true" @close="infoOpened = false" />
                </div>
            </div>
        </div>
      </teleport>
    </div>
</template>

<script lang="ts" setup>
import {onKeyStroke, useEventListener} from '@vueuse/core'
import { Permission } from '~/utils/permissionHelper';
import {DocDetail} from "dp-api";
import {FileDetailOptions} from "~/utils/browseHelper";
import * as mime from 'mime-types'
import { getMineTypeFromDocument } from '../../utils/browseHelper';
const auth = useUser();
const userId:string = useUser().getUserId()
const mobileActionOpened = ref(false);
const show = ref(false);
const doc = ref<DocDetail>()
const permission = ref<Permission>();
const infoOpened =ref(false);
const editMode = ref(false);
const options = ref<FileDetailOptions>({
  showInfo: false,
  showHeaderAction: false,
})
const emit = defineEmits(['close'])
const { public:{feature} } = useRuntimeConfig();
const { allowFeature } = useLayout()
const readerType = computed(() => {
  try {
    if(!doc.value) return "";
    const properties = doc.value.properties as any
    const mineType = getMineTypeFromDocument(doc.value);
    if(!mineType) return "pdf"; // set to pdf for testing
    // check if it is excel
    if(mineType.includes('application/vnd.ms-excel')) {
      return 'collabora';
    }
    if(mineType.includes('application/vnd.ms-powerpoint')) {
      return 'collabora';
    }
    if(mineType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      return 'collabora';
    }
    if(mineType.includes('application/vnd.openxmlformats-officedocument.presentationml.presentation')) {
      return 'collabora';
    }
    if(mineType.includes('application/vnd.ms-word')) {
      return 'collabora';
    }
    if(mineType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      return 'collabora';
    }
    if(mineType.includes('application/vnd.collabora') || mineType.includes('application/vnd.collabora-project')) {
      return 'collabora';
    }
    if(mineType.includes('text/plain')) {
      return 'collabora';
    }
    if(mineType.includes('text/html')) {
      return 'html';
    }
    if(mineType.includes('image/tiff')) {
      return 'other';
    }
    if(mineType.includes('image') || mineType.includes('pdf') || mineType.includes('document') || mineType.includes('text') || mineType.includes('photoshop') || mineType.includes('psd') || mineType.includes('illustrator')  ) {
      return 'pdf';
    }
    if(mineType.includes('video')) {
        return 'video';
    }
    if (mineType.includes('audio')) {
        return 'other';
    }
    return '';
  } catch (error) {
    return ''
  }
});
function handleRefresh() {
  getData(doc.value.path)
}
const PreviewRef = ref()
function handleRefreshPreview() {
  if(PreviewRef.value) PreviewRef.value.refresh()
  handleRefresh()
}
async function openPreview({detail}:any) {
  cancelAxios()
  show.value = false
  options.value = detail.options
  show.value = true
  await getData(detail.pathOrId)
  if (detail.options?.openEdit) openEdit()
}
const BrowseActionsEditRef = ref()
async function openEdit() {
  BrowseActionsEditRef.value.openDialog(doc.value)
}
async function getData (docId) {
  const response = await getDocumentDetailSync(docId, userId);
  doc.value = response.doc
  permission.value = response.permission
}
function mobileActionsOpenedChanged(bool:boolean) {
  mobileActionOpened.value = bool
}

function closePreview(){
  cancelAxios()
  show.value = false;
  doc.value = null
  permission.value = null;
}

onKeyStroke("Escape", (e) => {
    if(show.value) {
        show.value = false;
        emit('close')
    }
})

useEventListener(document, 'openFilePreview', openPreview )
useEventListener(document, 'closeFilePreview', closePreview)
useEventListener(document, 'checkIsPdf', () => {
  if(readerType.value === 'pdf') {
    const ev = new CustomEvent('isDocPdf')
    document.dispatchEvent(ev)
  }else{
    const ev = new CustomEvent('notDocPdf')
    document.dispatchEvent(ev)
  }
})
watch(show, (isShow) => {
  if(isShow) {
    document.body.classList.add('noScroll')
  }else{
    document.body.classList.remove('noScroll')
    editMode.value = false
  }
})
</script>

<style lang="scss" scoped>
.dialog{
    position: fixed;
    left:0;
    top:0;
    width: 100vw;
    height: 100%;
    z-index: 5;
    background-color: rgba(0,0,0,0.8);
    display: grid;
    grid-template-rows: min-content 1fr;
}
#modalHeader{
    display: grid;
    grid-template-columns: 1fr min-content;
    gap: var(--app-padding);
    padding-inline: var(--el-component-size-small);
    padding-top: var(--app-padding);
    color: var(--color-grey-0000);
    align-content: center;
    .actions {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: calc(var(--app-padding) / 2 );
    }
    @media(max-width: 640px) {
      .actions {
        flex-flow: row nowrap;
      }
    }
}
.header{
    min-height: 40px;;
}
.content{
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr min-content;
    padding: var(--el-component-size-small);
    overflow: hidden;
    position: relative;
    @media (max-width: 640px) {
      grid-template-columns: 1fr;
      .info {
        position: absolute;
        z-index: 2;
        top: var(--app-padding);
        left: var(--app-padding);
        width: calc( 100% - var(--app-padding) * 2);
        height: calc( 100% - var(--app-padding) * 2);
      }
    }
    .info {
        transition: width .2s ease-in-out;
        overflow: hidden;
    }
  
}
.noSupportContainer {
    color: var(--color-grey-0000);
    display: flex;
    justify-content: center;
    align-items: center;
}
.header{
    width: 100%;
    padding: var(--app-padding);
    display: grid;
    grid-template-columns: min-content 1fr min-content;
    gap: var(--app-padding);
    border-bottom: 1px soild var(--el-text-color-regular);
}
.fileNameContainer {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: calc(var(--app-padding) / 2 );
}
.fileName{
    font-size: var(--el-font-size-large);
    text-align: left;
    color: #fff !important;
    word-break: break-all;
    display: flex;
    gap: var(--app-padding);
    align-items: center;
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
.preview{
  overflow: hidden;
  &.mobileActionOpened{
    pointer-events: none;
  }
}
.closeBtn{
  --icon-color: var(--color-grey-900);
}
</style>
