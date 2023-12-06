<script setup lang="ts">
const props = defineProps<{
  pdfPath: string,
  json: any
}>()

const state = reactive({
  currentPage: 1,
  totalPages: 1,
});
const drawerOpened = ref(false)
function switchPage(page: number){
  state.currentPage = page
}

function renderPage(){

}

function highLightText() {
}

defineExpose({
  switchPage,
  highLightText
})


</script>

<template>
  <div class="viewerContainer">
    <div class="readerContainer">
      <canvas id="chevalierPdfReader"></canvas>
    </div>
    <div :class="{viewDrawer:true , drawerOpened}">

    </div>
  </div>
</template>

<style scoped lang="scss">
.viewerContainer{
  width:100%;
  height: 100%;
  display: block;
  position: relative;
  .viewerDrawer{
    position: absolute;
    top:0;
    right:0;
    width:
  }
}
</style>
