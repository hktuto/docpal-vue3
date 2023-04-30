<template>
    <div :class="{ meta: true, noContent: !hasMeta }" v-if="hasMeta">
    <div class="metaTitle">
      <span class="title">{{ $t('rightDetail_meta') }}</span>
      <BrowseMetaEditDialog :doc="doc" />
    </div>
    <div v-if="doc.displayMeta" style="overflow: hidden;">
      <table class="tableItem">
        <tr v-for="(value, key) in displayMeta" :key="key" v-show="value">
          <th class="tableItemTitle">{{ $t(key)}}</th>
          <td class="tableItemContent">{{ value }}</td>
        </tr>
      </table>
    </div>
     
  </div>
</template>

<script lang="ts" setup>
    const props = defineProps<{doc:any}>();
    const displayMeta = ref<object>({})
    const { displayTime } = useTime();
    const { doc } = toRefs(props)
    const hasMeta = ref(false)

    const metaStructureByProperties = (metaList: any[], properties: string) => {
      if(!properties || !metaList) return {}
      return  metaList.reduce((p, item) => {
                if (item.display) p[item.metaData] = properties[item.metaData] || ''
                if (item.dataType === 'date') p[item.metaData] = displayTime(p[item.metaData])
                return p
              }, {})
    }
    
    function updateDisplayMeta() {
      if(!doc.value.displayMeta) return;
      hasMeta.value = doc.value.displayMeta.length > 0
      displayMeta.value = metaStructureByProperties(doc.value.displayMeta, doc.value.properties)
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
