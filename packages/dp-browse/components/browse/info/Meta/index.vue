<template>
    <div v-for="(item, index) in displayMeta" :key="item.metaData"  class="infoSection">
        <div class="infoTitle">{{ $t(item.metaData) }}</div>
        <div class="infoContent">
            <span v-if="item.dataType === 'date'">{{ formatDate(item.value, item.options.formatDate) }}</span>
            <BrowseInfoMetaDocumentType v-else-if="item.dataType === 'select' && item.options.dropdownType === 'documentType'"
                :data="item.value" />
            <span v-else-if="item.metaDataType ==='array' && item.value">{{ item.value.join(',') || '-'}}</span>
            <span v-else>{{ item.value || '-'}}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{doc:any, permission:any}>();
const { doc } = toRefs(props)
const emit = defineEmits(['update'])
const displayMeta = ref<any[]>([])
const metaStructureByProperties = (metaList: any[], properties: string) => {
    if(!properties || !metaList) return []
    return  metaList.reduce((p, item) => {
            if (item.display) {
                item.value = properties[item.metaData];
                p.push(item)
            }
                return p
            }, [])
}

function updateDisplayMeta() {
    if(!doc.value.displayMeta) return;
    displayMeta.value = metaStructureByProperties(doc.value.displayMeta, doc.value.properties)
}
watch(doc, async (newValue) => {
    if (newValue) updateDisplayMeta()
}, { immediate: true, deep: true })

</script>



<style lang="scss" scoped>



</style>
