<script lang="ts" setup>
import {FormObject} from "../../../utils/formEditorHelper";
const formFieldEditorOpened = ref(false);
const props = defineProps<{
  field: FormObject
}>();
const emit = defineEmits(['submit'])

function fieldUpdate(newVal:FormObject) {
  newVal.attr_field_valid = checkFieldValid(newVal);
  emit('submit', newVal)
}

function checkFieldValid(field: FormObject):boolean {
  // if field.attr_readable return true
  if(field.attr_readable === false) return true;
  // if field type is undefined return false
  return !!field.attr_field_type;
}

</script>

<template>
  <div class="optionContainer" @click="formFieldEditorOpened = true">
    <div :class="{ fieldName:true, required:field.attr_field_required, valid: field.attr_field_valid}" >
      {{field.attr_name}}
    </div>
  <SvgIcon src="/icons/setting.svg" />
    <ElDialog v-model="formFieldEditorOpened"  append-to-body  destroy-on-close>
      <WorkflowEditorFormFieldOptions 
          v-model:formFieldEditorOpened="formFieldEditorOpened" 
          :field="field" 
          @close="formFieldEditorOpened = false"
          @submit="fieldUpdate"
      />
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
.optionContainer{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  --icon-size: .6rem;
  --icon-color: currentColor;
  gap: .5rem;
  flex: 1 0 auto;
  cursor: pointer;
    
    
}

.fieldName{
  font-weight: bold;
  color: red;
  &.valid{
    color: var(--color-grey-800);
  }
  &.required{
    &::after{
      content: '*';
    }
  }
}
</style>