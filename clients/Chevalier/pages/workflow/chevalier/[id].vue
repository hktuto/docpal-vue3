<script setup lang="ts">
import {getChevalierBatch} from "~/utils/chevaliierHelper";
import {Content} from "../../../components/Chevalier/chevalierType";

const router = useRouter()
const route = useRoute()
const reader = ref()
const submitting = ref(false)
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
  console.log(data.value.docs)
  if (rpf) {
    const newArr = [rpf, ...data.value.docs.filter((d) => d.name !== 'PRF')]
    return newArr.map((d) => ({
      selected: state.selectedDocs.name === d.name,
      name: d.name,
      total: d.json.analyzeResult.documents[0].fields[d.totalKey].valueNumber || d.json.analyzeResult.documents[0].fields[d.totalKey].content
    }))
  }
  // return data.value.docs
})

const displayTotal = computed(() => {
  let total = 0;
  const allDoc = data.value.docs.filter((d) => d.name !== 'PRF')
  allDoc.map((d) => {
    total += Number(d.json.analyzeResult.documents[0].fields[d.totalKey].valueNumber || d.json.analyzeResult.documents[0].fields[d.totalKey].content)
  })
  
  const PRF = data.value.docs.find((d) => d.name === 'PRF')
  let PRF_total = PRF.json.analyzeResult.documents[0].fields[PRF.totalKey].valueNumber || PRF.json.analyzeResult.documents[0].fields[PRF.totalKey].content
  console.log("PRF_total", PRF_total, PRF.totalKey)
  if(typeof PRF_total === 'string' && PRF_total.includes('$')){
    PRF_total = PRF_total.replace('$', '').replaceAll(',','')
  }
  return (total - PRF_total).toFixed(2);
})

async function submitDoc(){
  
  submitting.value = true
  try{
    // netvigate to browse
    const path = `/default-domain/Chevalier/${state.batchIndex}/AHPFC3A0018`
    router.push({
      path: `/browse?path=${path}`,
      query: {
        path: path
      }
    })
  }catch(e){
  }
  submitting.value = false
}


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
            <h1>Batch Index: {{state.batchIndex}} <SvgIcon style="display:inline" src="/icons/file-general.svg" /></h1>
        </div>
        <h2>{{state.selectedDocs.name}}</h2>
        <ChevalierFields v-model:documents="data.docs[state.selectedDocsIndex].json.analyzeResult.documents" />
      </div>
      <div class="right">
        <ChevalierPdfReader ref="reader" :data="data.docs[state.selectedDocsIndex]" />
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
      <div class="actions">
        
      <div :class="{total:true, success: displayTotal === 0.00 || displayTotal === '0.00'}">
        Different: {{displayTotal}}
      </div>
        <ElButton v-if="displayTotal === 0.00 || displayTotal === '0.00'" v-loading="submitting" @click="submitDoc">Submit</ElButton>
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
.header{
  cursor: pointer;
  display: inline-block;
}
.total {
  color: red;
  font-size: 1.2rem;
  font-weight: bold;
  &.success{
    color: var(--color-grey-1000);
  }
}
</style>
