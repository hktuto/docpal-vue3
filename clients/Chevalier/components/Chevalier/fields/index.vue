<script setup lang="ts">
import { Document } from '../chevalierType'
const props = defineProps<{
  documents: Document[]
}>()


</script>

<template>
  <div class="fieldsContainer">

    <template v-for="doc in documents" :key="doc.docType">

      <template v-for="(value,key) in doc.fields" :key="key">
        <div :class="{fieldContainer:true, [value.type]:true}">

          <div class="label">{{key}}</div>
          <ChevalierFieldsString v-if="value.type  === 'string'"  :field="value" />
          <ChevalierFieldsNumber v-else-if="value.type  === 'number'"  :field="value" />
          <ChevalierFieldsDate v-else-if="value.type  === 'date'"  :field="value" />
          <ChevalierFieldsArray v-else-if="value.type === 'array'" :field="value" />
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
