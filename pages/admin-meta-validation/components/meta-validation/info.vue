<template>
<el-card>
    <template #header><div>{{$t('common_info')}}</div></template>
    <div class="flexContent">
        <div>{{$t('tableHeader_name')}}</div>
        <div class="ellipsis" :title="docType.name">{{docType.name}}</div>
    </div>
    <div class="flexContent">
        <div class="ellipsis">{{$t('docType_fileType')}}</div>
        <div class="ellipsis">
             {{docType.isFolder ? $t('common_folder') : $t('common_file')}}
        </div>
    </div>
</el-card>
</template>

<script lang="ts" setup>
const props = defineProps<{
    docType: object,
}>()
</script>

<style lang="scss" scoped>
.flexContent {
  display: grid;
  grid-template-columns: 5rem 1fr;
  column-gap: 0.5rem;
  line-height: 2rem;
  div:first-of-type {
    color: var(--color-grey-500);
  }
}
</style>