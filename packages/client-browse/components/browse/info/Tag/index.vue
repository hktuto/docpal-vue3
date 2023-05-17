<template>
   <div class="infoSection" v-show="tags.length > 0 || doc.canWrite">
     <div class="infoTitle">{{ $t('rightDetail_tags') }}</div>
<!--    <div class="tagsTitle">-->
<!--      <span class="title">{{ $t('rightDetail_tags') }}</span>-->
<!--      <div class="icon" v-show="doc.canWrite">-->
<!--        <BrowseInfoTagAdd-->
<!--          :doc="doc"-->
<!--          @handleAdd="handleDocumentTagsAdd"-->
<!--        ></BrowseInfoTagAdd>-->
<!--        &lt;!&ndash; <img class="cursorPointer" src="/icons/fold.svg" /> &ndash;&gt;-->
<!--      </div>-->
<!--    </div>-->
    <div class="infoContent">
      <VueTagsInput
          element-id="tags"
          v-model="tags" :only-from-suggestions="false"
          :existing-tags="allTags"
          :add-on-space="false" :add-on-comma="true" :add-on-blur="true"
          :placeholder="$t('tip.input')"
          :typeahead="true"
          :disabled="!doc.canWrite"
          @tags-updated="handleDocumentTagsChanged"
        />
<!--      <el-tag  v-for="(tag, i) in tags" :key="i" effect="dark"-->
<!--            :closable="doc.canWrite"-->
<!--            @close="handleDocumentTagsDelete(tag)">-->
<!--            {{ tag.label }}-->
<!--      </el-tag>-->
    </div>
  </div>
</template>

<script lang="ts" setup>
import '@james090500/vue-tagsinput/dist/style.css';
import {PatchTags, SearchTagByName} from 'dp-api'
import { ElMessage } from 'element-plus'
const props = defineProps<{
  doc: any
}>()
const { doc } = toRefs(props)
const { t} = useI18n()

// TODO : add api
// const { patchTags } = UseTags()


async function handleDocumentTagsChanged(e:any){
  console.log('handleDocumentTagsChange',tags.value)
  const param = {
        documentIdOrPath: props.doc.id,
        labels: tags.value.map((item:any) => item.label),
      }
  await PatchTags(param)
  ElMessage.success(t('msg_successfullyModified') as string)
}
const tags = ref([]);
const allTags = ref([]);

async function getAllTags() {
  const response = await SearchTagByName('');
  allTags.value = response.map((item:string) => {
    return { value: item, key: item };
  });
}

watch(doc, () => {
    tags.value =( props.doc.properties['nxtag:tags'] || []).map((item:any) => ({
      key: item.label,
      value: item.label
    }))
},{immediate:true})

onMounted(() => getAllTags());
</script>



<style lang="scss" scoped>


.tags-input-root{
  font-size: 1rem;
  :deep {
    .tags-input-wrapper-default.active{
      border-color: var(--primary-color);
      box-shadow: none;
    }
  }
}
</style>
