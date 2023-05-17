<template>
   <div class="infoSection" v-show="tags.length > 0 || doc.canWrite">
     <div class="infoTitle">{{ $t('rightDetail_tags') }}</div>
    <div class="infoContent">
      <VueTagsInput
          element-id="tags"
          v-model="tags" :only-from-suggestions="false"
          :existing-tags="allTags"
          :add-on-space="false" :add-on-comma="true" :add-on-blur="true"
          :placeholder="$t('tip.input')"
          :typeahead="true"
          :disabled="!doc.canWrite"
          @tag-removed="handleTagsRemoved"
          @tag-added="handleTagsAdded"
        />

    </div>
  </div>
</template>

<script lang="ts" setup>
import '@james090500/vue-tagsinput/dist/style.css';
import {DocumentAddTags, PatchTags, SearchTagByName} from 'dp-api'
import { ElMessage } from 'element-plus'
const props = defineProps<{
  doc: any
}>()
const { doc } = toRefs(props)
const { t} = useI18n()

// TODO : add api
// const { patchTags } = UseTags()
const emit = defineEmits(['update'])
async function handleTagsAdded(tagSelected:any) {
  // if tagSelected is already in props.doc.properties['nxtag:tags'] return
  if (props.doc.properties['nxtag:tags'].some((item:any) => item.label === tagSelected.value )) {
    return
  }
  const param = {
        documentIdOrPath: props.doc.id,
        labels: [tagSelected.value],
      }
  await DocumentAddTags(param)
  ElMessage.success(t('msg_successfullyModified') as string)
  emit('update')
}
async function handleTagsRemoved(e:any){
  console.log('handleDocumentTagsChange',tags.value)
  const param = {
        documentIdOrPath: props.doc.id,
        labels: tags.value.map((item:any) => item.value),
      }
  await PatchTags(param)
  ElMessage.success(t('msg_successfullyModified') as string)
  emit('update')
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
