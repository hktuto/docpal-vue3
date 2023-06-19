<script setup lang="ts">

import {useUpload} from "~/compositbles/upload";

const {status, Upload, form} = useUpload()

</script>

<template>
  <div class="UploadContainer">
    <el-button v-if="status === 'NOT_STARTED'" type="primary" size="large" @click="Upload"> Upload</el-button>
  </div>
</template>

<style scoped lang="scss">

</style>