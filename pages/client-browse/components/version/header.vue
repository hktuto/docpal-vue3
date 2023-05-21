<template>
    <div v-if="doc" class="version-display">
    <div class="flex">
      v{{version}}<template v-if="doc.isCheckedOut">+ </template>
       - {{displayTime(doc.modifiedDate)}}
       <el-popover v-if="canRestore" v-model="popoverShow" placement="top">
         <div v-loading="loading">
            <p>{{$t('file_resetVersionTip')}} v{{version}}</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="popoverShow = false">{{$t('cancelText')}}</el-button>
              <el-button type="primary" size="mini" @click="handleRestore()">{{$t('confirm')}}</el-button>
            </div>
          </div>
          <template #reference>
            <img  class="cursorPointer el-icon--right" :src="'/icons/restore.svg'" round  />
          </template>
       </el-popover>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {restoreVersionApi} from 'dp-api'
const props = defineProps<{
    doc:any,
    canRestore: boolean
}>()

    const { displayTime } = useTime()

    const popoverShow = ref(false)
    const loading = ref(false)

    const version = computed(() => {
      const major_version = props.doc?.properties?.['uid:major_version'] || 0
      const minor_version = props.doc?.properties?.['uid:minor_version'] || 0
      return major_version + '.' + minor_version
    })

    function handleUpdate (handleType?: String) {
      const ev = new CustomEvent('tree-node-update', {
        detail: { doc: props.doc, handleType },
      })
      window.dispatchEvent(ev)
    } 
    async function handleRestore () {
      loading.value = true
      await restoreVersionApi({ idOrPath: props.doc.id, increment: "MAJOR" })
      loading.value = false
      popoverShow.value = false
    }

</script>



<style lang="scss" scoped>
.flex {
  display: flex;
  // justify-content: space-between;
  align-items: center;
  margin-bottom: var(--app-padding);
}
.version-display {
  overflow: hidden;
  display: grid;
  grid-template-rows: min-content 1fr;
}
main {
  height: 100%;
  overflow: auto;
}
</style>
