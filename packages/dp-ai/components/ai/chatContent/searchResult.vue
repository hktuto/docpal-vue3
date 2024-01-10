<template>
    <div class="ai-search-result-container">
        <div class="ai-search-result-header">
            {{ $t('ai.iHaveFound') }}
            <b>{{ searchResult.length }}</b>
            {{ $t('ai.documentsMatch') }}
        </div>
        <div class="ai-search-result-main">
            <div v-for="item in searchResult" :key="item.payload.id">
                <Reader class="ai-search-result-reader" v-bind="state.previewMap[item.payload.id]"></Reader>
                <div class="ai-search-result-reader--text ellipsis" :title="item.payload['ecm:title']"> {{ item.payload['ecm:title'] }} </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { GetDocumentPreview } from "dp-api";
const props = defineProps(['searchResult'])

const state = reactive<any>({
    previewMap: {}
})
function getPreviewFile(list) {
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
    
}
watch(props.searchResult, (val) => {
    if(!!val) {
        getPreviewFile(val)
    }
}, {
    immediate: true
})
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
.ai-search-result-main {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: var(--app-padding);
}
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
}
</style>
