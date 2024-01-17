<template>
    <div class="ai-search-result-container">
        <div class="ai-search-result-header">
          <div class="info">
            
            {{ $t('ai.iHaveFound') }}
            <b>{{ searchResult.length }}</b>
            {{ $t('ai.documentsMatch') }}
          </div>
          <div class="action">
            
          </div>
        </div>
        <div class="ai-search-result-main">
            <template v-if="viewType === 'preview'">
              <AiChatContentSearchResultList 
                  :searchResult="searchResult" 
                  @openDirectory="openDirectory" 
                  @openPreview="openDetail"
                  @scrollBottom="$emit('scrollBottom')"
              />
            </template>

        </div>
    </div>
</template>
<script lang="ts" setup>
import { GetDocumentPreview } from "dp-api";
const props = defineProps(['searchResult'])
const router = useRouter();
const viewType = ref<'preview' | 'table'>('preview')

const emits = defineEmits(['scrollBottom'])
const state = reactive<any>({
    previewMap: {}
})


function openDirectory(docId:string) {
  router.push({
    path:'/browse',
    query: {
      docId
    }
  })
}

function openDetail(path:string) {
  openFileDetail(path, {})
}


</script>
<style lang="scss" scoped>
.ai-search-result-container {
    margin-top: var(--app-padding);
    background-color: var(--color-grey-0000);
    padding: var(--app-padding);
    border-radius: 4px;
    .ai-search-result-header {
        padding-bottom: var(--app-padding);
    }
}


</style>
