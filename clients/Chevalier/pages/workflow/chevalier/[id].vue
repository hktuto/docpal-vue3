<script setup lang="ts">
import {getChevalierBatch} from "~/utils/chevaliierHelper";

const router = useRouter()
const route = useRoute()
const state = reactive({
  batchIndex: route.params.id,
  selectedDocsIndex: 0,
  selectedDocs:{}
})
const batchDialogVisible = ref(false)

const { data, error } = await useAsyncData('chevalier',  async() => await getChevalierBatch(state.batchIndex))

async function getSelectedDocData () {
    return data.value.docs[state.selectedDocsIndex]
}

function changeSelected(row:any) {
  state.selectedDocsIndex = data.value.docs.findIndex((d) => d.name === row.name);
  console.log(state.selectedDocsIndex)
  batchDialogVisible.value = false;
}

const docsTable = computed(() => {
  // always show RPF as first row
  const rpf = data.value.docs.find((d) => d.name === 'PRF')
  if (rpf) {
    const newArr = [rpf, ...data.value.docs.filter((d) => d.name !== 'PRF')]
    return newArr.map((d) => ({
      selected: state.selectedDocs.name === d.name,
      name: d.name,
      total: d.total
    }))
  }
  // return data.value.docs
})

const displayTotal = computed(() => {
  let total = 0;
  const allDoc = data.value.docs.filter((d) => d.name !== 'PRF')
  allDoc.map((d) => {
    total += d.total
  })
  console.log(total);
  console.log(data.value.docs.find((d) => d.name === 'PRF').total)
  return (total - data.value.docs.find((d) => d.name === 'PRF').total).toFixed(2);
})

watch(() =>state.selectedDocsIndex, async() => {
    state.selectedDocs = await getSelectedDocData()

},{
  immediate:true
})

</script>

<template>
  <NuxtLayout class="fit-height withPadding ">
    <div v-if="state.selectedDocs.json" class="chevalierContainer">
      <div class="left">
        <div class="header" @click="batchDialogVisible = true">
            <h1>Batch Index: {{state.batchIndex}}</h1>
        </div>
        <h2>{{state.selectedDocs.name}}</h2>
        <ChevalierFields :documents="state.selectedDocs.json.analyzeResult.documents" />
      </div>
      <div class="right">
        <div class="previewContainer">

        </div>
      </div>
    </div>
    <ElDialog v-model="batchDialogVisible" append-to-body distory-on-close>
      <ElTable :data="docsTable"  @row-click="changeSelected">
        <ElTableColumn
          width="40px"

        >
          <template #default="scope">
            <SvgIcon v-if='scope.row.selected' src="/icons/file-general.svg" />
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="Name"
          prop="name"
        />
        <ElTableColumn
          label="Path"
          prop="total"
        />
      </ElTable>
      <div class="totalR">
        Differents: {{displayTotal}}
      </div>
    </ElDialog>
  </NuxtLayout>
</template>

<style scoped lang="scss">
.chevalierContainer{
  display: grid;
  grid-template-columns: 2fr minmax(400px, 1fr);
  gap: var(--app-padding);
  height: 100%;
  overflow: hidden;
}
.left{
  overflow: hidden;
  position: relative;
  display: grid;
  grid-template-rows: min-content min-content 1fr;
}
h1,h2 {
  margin:0;
}
</style>
