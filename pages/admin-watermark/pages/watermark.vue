<template>
    <NuxtLayout class="fit-height withPadding">
      <template v-if="list.length === 0">
        <WatermarkEmpty @update="getList" />
      </template>
      <template v-else>
        <div class="listContainer">
          <WatermarkList :list="list" :selected-id="$route.query.id" @update="getList" @remove="deleteItem"/>
          <WatermarkDetail v-if="detail" :detail="detail" @update="getDetail(detail.id)"/>
        </div>
      </template>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { getWatermarkTemplates } from 'dp-api'
const route = useRoute();
const router = useRouter()
const detail = ref<WatermarkTemplateDetail>(null);
const { getWatermarkTemplateDetail, removeWatermarkTemplate, list } = useWatermark()
async function getList(dummy: boolean = false) {
  list.value = await getWatermarkTemplates();
}
async function deleteItem(id: string) {
  await removeWatermarkTemplate(id)
  await getList();
  if(list.value.length > 0){
    router.push({
      path: '/watermark',
      query: { id: list.value[0].id }
    })
  }
}
async function getDetail(id: string) {
  try {
    detail.value = await getWatermarkTemplateDetail(id);
    if(detail.value.type === 'dynamic') detail.value.contentType = detail.value.content
  }catch(error) {
    detail.value = null
  }
}

watch(() => route.query.id, (newId) => {
  if(route.query.id){
    getDetail(route.query.id as string);
  }
  getList();
},{
  immediate: true
})

</script>

<style lang="scss" scoped>
.pageContainer{
  height: 100%;
  padding: calc( var(--app-padding) * 2);
  position: relative;
}
.listContainer{
  height: 100%;
  width: 100%;
  padding: 0;
  display: grid;
  grid-template-columns: min-content 1fr;
  gap: var(--app-padding);
  overflow: hidden;
  position: relative;
}
</style>
