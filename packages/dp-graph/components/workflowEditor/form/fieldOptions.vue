<script lang="ts" setup>
  import {FormObject} from "../../../utils/formEditorHelper";

  const props = defineProps<{
    field: FormObject
  }>();
  
  
  
</script>

<template>
  <div class="optionButton">
    <SvgIcon src="/icons/setting.svg" />
  </div>
</template>

<style scoped lang="scss">

</style>