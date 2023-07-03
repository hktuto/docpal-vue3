<template>
    <div v-for="(item, index) in displayMeta" :key="item.metaData"  class="infoSection">
      <div class="infoTitle">{{ $t(item.metaData) }}</div>
      <div class="infoContent">
        <template v-if="!doc.canEdit">
          <span v-if="item.dataType === 'date'">{{ displayTime(item.value) }}</span>
          <span v-else>{{ item.value }}</span>
        </template>
        <template v-else>
          <BrowseInfoMetaEditField :item="item"  @change="itemUpdate"/>
        </template>
      </div>
    </div>
</template>

<script lang="ts" setup>
    import {patchDocumentApi} from "dp-api";
    import {ElMessage} from "element-plus";

    const props = defineProps<{doc:any}>();
    const displayMeta = ref<any[]>([])
    const { displayTime } = useTime();
    const { doc } = toRefs(props)
    const hasMeta = ref(false)
    const { t } = useI18n()
    const emit = defineEmits(['update'])
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
      hasMeta.value = doc.value.displayMeta.length > 0
      displayMeta.value = metaStructureByProperties(doc.value.displayMeta, doc.value.properties)
    }



    async function itemUpdate({key, value}:any) {
      await patchDocumentApi({
        idOrPath: doc.value.id,
        name: doc.value.name,
        properties: {[key] : value},
      })
      emit('update')
      updateDisplayMeta()
      ElMessage.success(t('msg_successfullyModified'))
    }

    watch(doc, async (newValue) => {
      if (newValue) updateDisplayMeta()
    }, { immediate: true, deep: true })

</script>



<style lang="scss" scoped>



</style>
