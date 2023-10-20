<template>
    <div class="preview-container"
        :style="`--img-size:${state.imgSize}px;`" @contextmenu="(event) => handleRightClick(doc, event, true)">
        <div class="preview-main">
            <div v-if="list.length === 0" class="emptyList">
                empty list
            </div>
            <div v-for="item in list" :key="item.id"
                class="doc-container"
                @dblclick="handleDblclick(item)" 
                @contextmenu.stop="(event) => handleRightClick(item, event)" >
                <template v-if="item.blobUrl">
                    <img :src="item.blobUrl" class="thumbnail" @error="imgError"  @dblclick="handleDblclick(item)"/>
                </template>
                <template v-else>
                    <BrowseItemIcon class="folderIcon" :type="item.isFolder ? 'folder' : 'file'" status="general" :mimeType="item.mimeType"  />
                    <DropzoneContainer v-if="item.isFolder" :doc="item" class="folderDropzone backgroundDrop"></DropzoneContainer>
                    <div v-else class="clickActor backgroundDrop"></div>
                </template>
                <div class="name">{{item.name}}</div>
            </div>
        </div>
        
    </div>
</template>

<script lang="ts" setup>
import { DocumentThumbnailGetApi, TABLE, defaultTableSetting } from 'dp-api'
import {openFileDetail} from "~/utils/browseHelper";
const route = useRoute()
const router = useRouter()
const props = defineProps<{doc:true,list:any[]}>();
const {list} = toRefs(props)
const emit = defineEmits([
    'select-change'
])

const state = reactive<State>({
    loading: false,
    imgSize: 100
})

function imgError(event) {

    event.target.src = '/icons/file-general.svg'
}
// #region module: page 

    async function getList () {
        state.loading = true
        try {
          for (const item of list.value) {
                if (!item.isFolder) {
                    try{
                        const blob = await DocumentThumbnailGetApi(item.id)
                        if (!!blob) {
                            const urlCreator = window.URL || window.webkitURL
                            item.blobUrl = urlCreator.createObjectURL(blob)
                        } 
                    }catch(err){
                        item.blobUrl = ""
                    }
                    const blob = await DocumentThumbnailGetApi(item.id)
                    if (!!blob) {
                        const urlCreator = window.URL || window.webkitURL
                        item.blobUrl = urlCreator.createObjectURL(blob)
                    } 
                }
            }
        } catch (error) {
            
        }
        state.loading = false
    }

    watch(
        list,
        async () => {
          getList()
        },
        { immediate: true }
    )
// #endregion
function handleDblclick (row:any) {
    console.log(row);
  if(!row.isFolder) {
    openFileDetail(row.path, {
      showInfo:true,
      showHeaderAction:true
    })
  }else{
    router.push({
      query: { path: row.path, isFolder: row.isFolder}
    })
  }
}
function handleRightClick (item, event, isEmpty: boolean = false) {
    event.preventDefault();
    const data = {
        isFolder: true,
        idOrPath: item.path,
        pageX: event.pageX,
        pageY: event.pageY,
        doc: item,
    }
    if (isEmpty) data.actions = {
        cut: false,
        copy: false,
        rename: false,
        delete: false
    }
    const ev = new CustomEvent('fileRightClick',{ detail: data })
    document.dispatchEvent(ev)
}
</script>
<style lang="scss" scoped>
.preview-container {
    height: 100%;
    display: grid;
    grid-template-rows: 1fr min-content;
    row-gap: var(--app-padding);
    .preview-main {
        overflow: auto;
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-items: flex-start;
        align-content: flex-start;
        gap: calc(var(--app-padding) * 2);
        color: var(--color-grey-700);
        > *{
            width: calc(var(--img-size) + var(--app-padding) * 2);
          position: relative;
        }
    }
}
.footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.doc-container {
    .thumbnail {
        aspect-ratio: 1/1;
        background: var(--color-grey-0000);
        border-radius: 0.5rem;
        overflow: hidden;
        width: 100%;
        position: relative;
    }
    .name {
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        word-break: break-all;
    }
}
.iconContainer {
    :deep(img) {
        aspect-ratio: 1/1;
        border-radius: 0.5rem;
        overflow: hidden;
        width: 100%;
        position: relative;
    }
}
.folderIcon{
    --icon-size: 100%;
    z-index: 2;
}
.backgroundDrop{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;

}
</style>