<script setup lang="ts">
  import {CreateDocumentApi} from "dp-api";

  const props = defineProps<{
    items : any[]
  }>()
  
  const uploadQueue = ref<any[]>(props.items);
  const state = ref('uploading')
  
  const emits = defineEmits(['finish'])
  
  async function upload(i) {
    console.log(props.items[i])
    try{
      props.items[i].status = 'loading'
      // add blob to FormData
      const formData = new FormData();
      
      const document = {
        name: props.items[i].fileName,
        idOrPath: `${props.items[i].path}/${props.items[i].fileName}`,
        type: props.items[i].docType ,
        properties: props.items[i].metadata,
        emailId: props.items[i].emailId
      }
      
      formData.append('files', props.items[i].blob);
      formData.append('document', JSON.stringify(document))
      const result =  await CreateDocumentApi(formData)
      console.log(result);
      props.items[i].status = 'success'
      
      
    }catch(err) {
      console.log(err)
      props.items[i].status = 'fail'
    }
    if (i === props.items.length - 1) {
      emits('finish')
    }
    // upload
  }
  
  async function uploadAll() {
    for ( let i = 0; i < props.items.length; i++ ) {
      await upload(i)
    }
  }
  
  onMounted(() => {
    uploadAll();
  })
</script>

<template>
  <div class="uploadContainer">
   <el-loading />
  </div>
</template>

<style scoped lang="scss">
.uploadContainer{
  width: 100%;
  height:100%;
  display: grid;
  place-items: center;
}
</style>