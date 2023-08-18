<template>
    <div class="browseDetailContainer">
      <teleport to="body">
        <div v-if="show && doc" class="dialog">
            <div id="modalHeader">
              <div class="fileNameContainer">
                <div class="fileName">{{ doc.name }}</div>
              </div>
              <div v-if="options.showHeaderAction" class="actions">
                
                <CollapseMenu @openedChange="mobileActionsOpenedChanged">
                  <template #default="{collapse}">
                    <!-- {{AllowTo({feature:'Read', userPermission:permission.permission, holdStatus })}} -->
                    <BrowseActionsHold :doc="doc" />
                    <BrowseActionsEdit v-if="AllowTo({feature:'ReadWrite', userPermission: permission.permission, holdStatus })" :doc="doc" @success="handleRefresh"/>
                    <BrowseActionsSubscribe  :doc="doc" />
                    <div v-show="AllowTo({feature:'ReadWrite', userPermission: permission.permission })" :class="{actionDivider:true, collapse}"></div>
                    <BrowseActionsReplace :doc="doc" v-if=" AllowTo({feature:'ReadWrite', userPermission: permission.permission, holdStatus })" @success="handleRefresh"/>
                    <!-- <BrowseActionsReplace :doc="doc" v-if=" AllowTo({feature:'ReadWrite', userPermission: permission.permission }) && !doc.isCheckedOut" @success="handleRefresh"/> -->
                    <BrowseActionsDownload v-if="AllowTo({feature:'Read', userPermission: permission.permission, holdStatus })"  :doc="doc"  />
                    <BrowseActionsDelete v-if="AllowTo({feature:'ReadWrite', userPermission: permission.permission, holdStatus })" :doc="doc" @delete="itemDeleted" @success="handleRefresh"/>
                    <BrowseActionsCopyPath v-if="AllowTo({feature:'ReadWrite', userPermission:permission.permission })" :doc="doc" />
                    <BrowseActionsOffice v-if="AllowTo({feature:'ReadWrite', userPermission:permission.permission, holdStatus })" :doc="doc" />
                    <div v-show="AllowTo({feature:'ReadWrite', userPermission: permission.permission })" class="actionDivider"></div>
                    <BrowseActionsShare v-if="AllowTo({feature:'ReadWrite', userPermission: permission.permission })" :doc="doc" :hideAfterClick="true" />
    
                     <!-- {{AllowTo({feature:'Read', userPermission:permission.permission, holdStatus })}} -->
                    <!-- <SvgIcon src="/icons/close.svg" round ></SvgIcon> -->
                    
                  </template>
                </CollapseMenu>
                <div v-show="AllowTo({feature:'ReadWrite', userPermission: permission.permission })" :class="{actionDivider:true, collapse}"></div>
                <BrowseActionsInfo  :doc="doc" @click="infoOpened = !infoOpened"/>
                <div  :class="{actionDivider:true, collapse}"></div>
                <div class="actionIconContainer" @click="closePreview">
                  <el-icon >
                    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path></svg>
                  </el-icon>
                </div>
              </div>
            </div>
            <div class="content">
                <div :class="{preview:true, mobileActionOpened}" v-if="readerType">
                    <LazyHtmlViewer v-if="readerType === 'html'" :doc="doc" />
                    <LazyPdfViewer v-if="readerType === 'pdf'" :doc="doc" :options="{loadAnnotations:true, print: permission.print, readOnly: !AllowTo({feature:'ReadWrite', userPermission:permission.permission, holdStatus })}" />
                    <LazyVideoPlayer v-else-if="readerType === 'video'" :doc="doc" />
                    <LazyOtherPlayer v-else-if="readerType === 'other'" :doc="doc"></LazyOtherPlayer>
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

const auth = useUser();
const userId:string = useUser().getUserId()
const mobileActionOpened = ref(false);
const show = ref(false);
const doc = ref<DocDetail>()
const permission = ref<Permission>();
const infoOpened =ref(false);
const options = ref<FileDetailOptions>({
  showInfo: false,
  showHeaderAction: false,
})
const emit = defineEmits(['close'])
const holdStatus = computed( () => (doc.value?.holdStatus) || '')

const readerType = computed(() => {
    if(!doc.value) return "";
    const properties = doc.value.properties as any
    const mineType:string = properties["file:content"] && properties["file:content"]["mime-type"] ? properties["file:content"]["mime-type"] : '';
    if(!mineType) return "pdf"; // set to pdf for testing
    if(mineType.includes('text/html')) {
      return 'html';
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
});

async function openPreview({detail}:any) {
  show.value = false
  options.value = detail.options
  // const response = await getDocumentDetail(detail.pathOrId, userId)
  const response = await getDocumentDetailSync(detail.pathOrId, userId);

  doc.value = response.doc
  permission.value = response.permission
  show.value = true
}

function mobileActionsOpenedChanged(bool:boolean) {
  mobileActionOpened.value = bool
}

function closePreview(){
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
  &.mobileActionOpened{
    pointer-events: none;
  }
}
</style>
