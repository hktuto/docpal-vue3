<script setup lang="ts">
import {GetDocumentPreview} from "dp-api";

const props = defineProps<{
  searchResult: any
}>()

const state = reactive<any>({
  previewMap: {}
})

const emits = defineEmits(['openPreview','openDirectory','scrollBottom'])

function getPreviewFile(list:any[]) {
  list.forEach(async(item) => {
    try {
      state.previewMap[item.payload.id] = {
        blob: null,
        name: '',
        id: '',
        path: '',
        loading: false,
        options: {
          noDownload: true,
          print: false,
          loadAnnotations: false,
          readOnly: true
        }
      }
      state.previewMap[item.payload.id].blob = await GetDocumentPreview(item.payload.id)
    } catch (error) {
    }
  })
  emits('scrollBottom')
}

function openDetail(item:any){
  console.log(item)
  emits('openPreview', item.payload.id)
}

function openParent(item:any){
  emits('openDirectory', item.payload['ecm:parentId'])
}

watch(props.searchResult, (val:any) => {
  if(!!val) {
    getPreviewFile(val)
  }
}, {
  immediate: true
})
</script>

<template>
  <div class="searchResultListContainer">
    <div v-for="item in searchResult" :key="item.payload.id" class="frame">
      <Reader class="ai-search-result-reader" v-bind="state.previewMap[item.payload.id]"></Reader>
      <div class="ai-search-result-reader--text ellipsis" :title="item.payload['ecm:title']"> 
        <SvgIcon src="/icons/folder-normal.svg" @click="openParent(item)"></SvgIcon>
        <div class="name"  @click="openDetail(item)">{{ item.payload['ecm:title'] }} </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ai-search-result-reader {
  width: 250px;
  height: 400px;
  box-shadow: 0 4px 8px rgb(0 0 0 / 10%);
  :deep h2 {
    margin: unset;
  }
}
.ai-search-result-reader--text {
  width: 250px;
  padding: var(--app-padding) 0;
  --icon-size:1rem;
  display: flex;
  gap: var(--app-padding);
  .name{
    cursor: pointer;
  }
}
.searchResultListContainer {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: var(--app-padding);
}
.frame{
  display:grid;
  grid-template-rows:1fr min-content;
}
</style>