<script setup lang="ts">
import {Field} from "~/components/Chevalier/chevalierType";


const props = defineProps<{
  field: Field
}>()
const columnRow = computed(() => {
  const row = props.field.valueArray
  const fields = row.reduce((acc, cur) => {
    Object.keys(cur.valueObject).forEach((key) => {
      if(!acc[key]) {
        acc[key] = {label:key, ...cur.valueObject[key]}
        return acc
      }
      acc[key] = {label:key,...cur.valueObject[key]}
      return acc
    },{})
    return acc
  },{}) as any
  console.log(fields)
  return Object.keys(fields).map((key) => {
    return fields[key]
  })
})
const displayTable = computed(() => {
  return props.field.valueArray.map((item) => {
    return item.valueObject
  })
})
</script>

<template>
  <ElTable :data="displayTable">
    <ElTableColumn v-for="column in columnRow" :key="column" :prop="column" :label="column.label" >
      <template #default="scope">
        <ChevalierFieldsString v-if="column.type === 'string'" type="textarea"  :field="scope.row[column.label]" />
        <ChevalierFieldsNumber v-if="column.type === 'number'"  :field="scope.row[column.label]" />
      </template>
    </ElTableColumn>
  </ElTable>
</template>

<style scoped lang="scss">

</style>
