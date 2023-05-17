<template>
    <div v-for="(item, index) in displayMeta" :key="item.metaData"  class="infoSection">
      <div class="infoTitle">{{ $t(item.metaData) }}</div>
      <div class="infoContent">
        <template v-if="!doc.canEdit">
          <span v-if="item.dataType === 'date'">{{ displayTime(item.value) }}</span>
          <span v-else>{{ item.value }}</span>
        </template>
        <template v-else>
          <BrowseInfoMetaEditField :item="item"  />
        </template>
      </div>
    </div>
</template>

<script lang="ts" setup>
    const props = defineProps<{doc:any}>();
    const displayMeta = ref<any[]>([])
    const { displayTime } = useTime();
    const { doc } = toRefs(props)
    const hasMeta = ref(false)

    const metaStructureByProperties = (metaList: any[], properties: string) => {
      console.log(metaList);
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
      console.log('displayMeta', displayMeta.value)
    }



    function itemUpdate(metaData: string, value: any) {
      console.log('itemUpdate', metaData, value)
      doc.value.properties[metaData] = value
      updateDisplayMeta()
    }

    watch(doc, async (newValue) => {
      if (newValue) updateDisplayMeta()
    }, { immediate: true, deep: true })

</script>



<style lang="scss" scoped>
::v-deep .headerIcons.small {
  height: 20px;
}
.meta {
  display: flex;
  flex-direction: column;
  // border-bottom: 1px solid var(--color-grey-200);
  padding: var(--app-padding) 0;
  &.noContent {
    // border-bottom: none;
    display: none;
  }
}
.metaTitle {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .title {
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 1.125rem;
    line-height: 1.375rem;
    color: var(--color-grey-500);
  }
}
.tableItem {
  font-style: normal;
  font-size: 0.875rem;
  border-collapse: separate;
  border-spacing: 0.625rem;
  white-space: nowrap;
  .tableItemTitle {
    font-weight: normal;
    color: var(--color-grey-500);
    text-align: left;
    vertical-align: baseline;
    line-height: 1.375rem;
  }
  .tableItemContent {
    font-weight: bold;
    line-height: 1.375rem;
    color: var(--color-grey-500);
    white-space: pre-wrap;
  }
}


</style>
