<template>
    <div class="related">
    <div class="relatedTitle">
      <span class="title">{{ $t('rightDetail_related') }}</span>
      <div class="icon">
        <img
          class="cursorPointer"
          :src="`/icons/list.svg`"
          @click="viewType = 'table'"
        />
        <img
          class="cursorPointer"
          :src="`/icons/tree.svg`"
          @click="viewType = 'map'"
        />
      </div>
    </div>
    <div class="relatedContent">
      <RelateTable v-if="viewType === 'table'" :related="relatedChildren" />
      <RelateMap
        v-if="viewType === 'map'"
        :doc="doc"
        :related="relatedChildren"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getRelatedChild } from 'dp-api'
const props = defineProps<{
    doc: any
}>()
const emit = defineEmits<{
    'hide-relate'(): void
    'show-relate'(): void
}>()
 const relatedChildren = ref()
    const viewType = ref('table')

    const getRelated = async () => {
      const allChildren = await getRelatedChild(props.doc.id)
      if (allChildren.length === 0) {
        emit('hide-relate')
      } else {
        emit('show-relate')
      }
      // find related
      const related = allChildren.find((d) => d.name === 'related') || {
        children: [],
      }
      const empty: any = {}
      relatedChildren.value = related.children.reduce(
        (result: any, current) => {
          if (result[current.type]) {
            result[current.type].push(current)
          } else {
            result[current.type] = [current]
          }
          return result
        },
        empty
      )
    }
    watch(
      () => props.doc,
      async (newDoc) => {
        if (newDoc.path) {
          await getRelated()
        }
      },
      {
        immediate: true,
      }
    )
</script>


<style lang="scss" scoped>
.related {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  min-width: 320px;
  .relatedContent {
    flex: 1 0 auto;
  }
  .relatedTitle {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .title {
      font-family: Roboto;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 22px;
      color: var(--color-grey-500);
    }
  }
}
</style>
