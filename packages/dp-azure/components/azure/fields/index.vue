<script setup lang="ts">
import { Document } from '../chevalierType'
const props = defineProps<{
  documents: Document[]
}>()
const emit = defineEmits(['update:documents'])
function selectField(field:Field) {
  if(field.type === 'array') return
  const ev = new CustomEvent('draw-step', {detail: field})
  document.dispatchEvent(ev)
}
function valChange(newValue, key) {
  if(!props.documents[0].fields[key]) {
    props.documents[0].fields[key] = {}
  }
  props.documents[0].fields[key].content = newValue
  if(props.documents[0].fields[key].type === 'number') {
    props.documents[0].fields[key].valueNumber = newValue
  }
  emit('update:documents', props.documents)
}
</script>

<template>
  <div class="fieldsContainer">

    <template v-for="doc in documents" :key="doc.docType">

      <template v-for="(value,key) in doc.fields" :key="key">
        <div :class="{fieldContainer:true, [value.type]:true}" >

          <div class="label" @click="() => {
            selectField(value);
          }">{{key}}</div>
          <AzureFieldsString v-if="value.type  === 'string'"  :field="value" @change="(val) => valChange(val,key)"/>
          <AzureFieldsNumber v-else-if="value.type  === 'number'"  :field="value" @change="(val) => valChange(val,key)"/>
          <AzureFieldsDate v-else-if="value.type  === 'date'"  :field="value" @change="(val) => valChange(val,key)"/>
          <AzureFieldsArray v-else-if="value.type === 'array'" :field="value" @change="(val) => valChange(val,key)"/>
        </div>
      </template>
    </template>
  </div>

</template>

<style scoped lang="scss">
.fieldsContainer{
  display: flex;
  flex-flow: row wrap;
  gap: var(--app-padding);
  justify-content: flex-start;
  align-items: flex-start;
  overflow: auto;
  height: 100%;
  .fieldContainer{
    flex: 1 0 250px;
    &.array {
      flex: 1 0 100%;
    }
  }
  .label{
    font-size: 1rem;
    font-weight: bold;
  }
}
</style>
