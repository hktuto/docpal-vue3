<script setup lang="ts">
onMounted(() => {
  if(Office) {
    initOffice()
  }
})
const router = useRouter()
function initOffice(){
  Office.onReady((info:any) => {
    console.log(info)
    switch(info.host)  {
      case 'Word' :
        router.push('word');
        break;
    }
  })
}
</script>

<template>
  <NuxtLayout name="addin">
    Loading...
  </NuxtLayout>
</template>

<style scoped lang="scss">

</style>