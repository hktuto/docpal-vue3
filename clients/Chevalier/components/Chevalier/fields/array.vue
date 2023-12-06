<script setup lang="ts">
import {Field} from "~/components/Chevalier/chevalierType";


const props = defineProps<{
  field: Field
}>()
const columnRow = computed(() => {
  const row = props.field.valueArray
  console.log(Object.keys(row[0].valueObject))
  return Object.keys(row[0].valueObject)
})
const displayTable = computed(() => {
  return props.field.valueArray.map((item) => {
    return item.valueObject
  })
})
</script>

<template>
  <ElTable :data="displayTable">
    <ElTableColumn v-for="column in columnRow" :key="column" :prop="column" :label="column" >
      <template #default="scope">

        <ChevalierFieldsString v-if="scope.row[column].type === 'string'" type="textarea"  :field="scope.row[column]" />
        <ChevalierFieldsNumber v-if="scope.row[column].type === 'number'"  :field="scope.row[column]" />
      </template>
    </ElTableColumn>
  </ElTable>
</template>

<style scoped lang="scss">

</style>
