<script lang="ts" setup>
import {FormObject} from "../../../utils/formEditorHelper";
const formFieldEditorOpened = ref(false);
const props = defineProps<{
  field: FormObject
}>();
const emit = defineEmits(['submit'])
</script>

<template>
  <div class="optionButton">
  <SvgIcon src="/icons/setting.svg" @click="formFieldEditorOpened = true"/>
    <ElDialog v-model="formFieldEditorOpened"  append-to-body  destroy-on-close>
      <WorkflowEditorFormFieldOptions 
          v-model:formFieldEditorOpened="formFieldEditorOpened" 
          :field="field" 
          @close="formFieldEditorOpened = false"
          @submit="(newVal) => $emit('submit', newVal)"
      />
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">

</style>