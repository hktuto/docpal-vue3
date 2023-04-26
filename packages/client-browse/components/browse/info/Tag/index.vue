<template>
   <div class="tags" v-show="tags.length > 0 || doc.canWrite">
    <div class="tagsTitle">
      <span class="title">{{ $t('rightDetail_tags') }}</span>
      <div class="icon" v-show="doc.canWrite">
        <BrowseInfoTagAdd
          :doc="doc"
          @handleAdd="handleDocumentTagsAdd"
        ></BrowseInfoTagAdd>
        <!-- <img class="cursorPointer" src="/icons/fold.svg" /> -->
      </div>
    </div>
    <div>
      <el-tag  v-for="(tag, i) in tags" :key="i" effect="dark"
            :closable="doc.canWrite" 
            @close="handleDocumentTagsDelete(tag)">
            {{ tag.label }}
      </el-tag>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {PatchTags } from 'dp-api'
import { ElMessageBox } from 'element-plus'
const props = defineProps<{
  doc: any
}>()
const { t} = useI18n()

// TODO : add api
// const { patchTags } = UseTags()

const tags = computed(() => {
      const data = props.doc?.properties?.['nxtag:tags'] || []
      return data
    })

const handleDocumentTagsAdd = (tagSelected) => {
      console.log(tagSelected)
      const tags = props.doc.properties['nxtag:tags']
      tagSelected.forEach((item) => {
        tags.push({ label: item })
      })
      handleUpdate('edit')
    }

    async function handleDocumentTagsDelete (tags) {
      const action = await ElMessageBox.confirm(`${t('msg_confirmWhetherToDelete')}`,{
        confirmButtonText: `${t('dpButtom_confirm')}`,
        cancelButtonText: `${t('dpButtom_cancel')}`
      }).catch((action) => { return action })
      if(action !== 'confirm') return

      const nxtag = props.doc.properties['nxtag:tags']
      const index = nxtag.findIndex(item => item.label === tags.label)
      nxtag.splice(index, 1)
      const labels = []
      nxtag.forEach((item) => { labels.push(item.label) })
      const param = {
        documentIdOrPath: props.doc.id,
        labels,
      }
      const res = await PatchTags(param)
      if(!res) {
          nxtag.push(tags)
      }
      handleUpdate('edit')
    }
    function handleUpdate (handleType) {
      const ev = new CustomEvent('tree-node-update', {
        detail: { doc: props.doc, handleType },
      })
      window.dispatchEvent(ev)
    }

</script>



<style lang="scss" scoped>
.tags {
  display: flex;
  flex-direction: column;
  // border-bottom: 1px solid var(--color-grey-200);
  .tagsTitle {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 0.625rem;
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