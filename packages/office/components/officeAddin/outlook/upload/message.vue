<script setup lang="ts">

import {getJsonApi} from "dp-api";
import {ElNotification} from "element-plus";
const formJson = getJsonApi('office/officeUpload.json')

const props = defineProps<{
  item: any
}>();


const emits = defineEmits(['submit','back'])
function getMessage() {
  
}

function submit() {
  
}

function back() {
  emits('back')
}

</script>

<template>
  <div class="uploadContainer">
    <div class="title">
      Upload Email Message Only
    </div>
    
    <el-button @click="submit">Next</el-button>
    <el-button @click="back">back</el-button>
  </div>
</template>

<style scoped lang="scss">
.title{
  font-size: 1.2rem;
  color: var(--primary-color);
  line-height: 1.2;
}
</style>