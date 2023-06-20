<script setup lang="ts">

import {useUpload} from "~/compositbles/upload";
import {getJsonApi} from "dp-api";
const formJson = getJsonApi('office/officeUpload.json')
const FromRendererRef = ref();
const {status, Upload, form} = useUpload()

</script>

<template>
  <div class="UploadContainer">
    <FromRenderer ref="FromRendererRef" :form-json="formJson" >
      <template v-slot:tableForm>
        <span>
          testing
        </span>
      </template>
    </FromRenderer>
    <el-button v-if="status === 'NOT_STARTED'" type="primary" size="large" @click="Upload">Upload</el-button>
  </div>
</template>

<style scoped lang="scss">

</style>