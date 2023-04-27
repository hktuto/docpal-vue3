<template>
    <div class="collection" v-show="doc && (collections.length > 0 || doc.canWrite)">
    <div class="collectionTitle">
      <span class="title">{{ $t('rightDetail_collection') }}</span>
      <div class="icon" v-show="doc.canWrite">
        <BrowseInfoCollectionAdd
          :doc="doc"
          :exitList="collections"
          @handleAdd="(id) => documentCollectionGet(id)"
        ></BrowseInfoCollectionAdd>
        <!-- <img class="cursorPointer" src="/icons/fold.svg" /> -->
      </div>
    </div>
    <div>
      <el-tag  v-for="(item) in collections" :key="item.path" effect="dark"
            :closable="doc.canWrite" 
            @close="handleDelete(item)">
            {{ item.name }}
      </el-tag>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ElMessageBox } from 'element-plus'
import {getCollectionDocApi } from 'dp-api'
const props = defineProps<{
    doc: any
}>()
const { doc } = toRefs(props)
const { t } = useI18n()
const collections = reactive([])

    async function handleDelete (collection) {
      const action = await ElMessageBox.confirm(`${t('msg_confirmWhetherToDelete')}`,{
        confirmButtonText: `${t('dpButtom_confirm')}`,
        cancelButtonText: `${t('dpButtom_cancel')}`
      }).catch((action) => { return action })
      if (action !== 'confirm') return
      const index = collections.findIndex((item) => item.id === collection.id)

      const param = {
        documents: [{ idOrPath: props.doc.id }],
        collection: { idOrPath: collection.path },
      }
      const res = await removeCollectionApi(param)
      if (!res) return
      collections.splice(index, 1)
    }
    const documentCollectionGet = (idOrPath: string, isForce?: boolean) => {
      collections.splice(0, collections.length)

      getCollectionDocApi({ idOrPath }).then((res) => {
        if (res instanceof Array) collections.push(...res)
      })
    }
    watch(
      doc,
      (val) => {
        if (val) {
          getCollectionDocApi(val.id)
        }
      },
      { immediate: true }
    )
</script>

<style lang="scss" scoped>
.collection {
  display: flex;
  flex-direction: column;
  // border-bottom: 1px solid var(--color-grey-200);
  .collectionTitle {
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
}
.el-tag {
  border-radius: 15px;
  margin: calc(var(--app-padding) / 3) calc(var(--app-padding) / 2);
}
</style>