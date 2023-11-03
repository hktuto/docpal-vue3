<script setup lang="ts">
const { displayTime } = useTime()
const props = defineProps<{
  item: any
}>();
const { item } = toRefs(props)
const form = ref<any>({...props.item});
const emit = defineEmits(['change'])
function changeHandler(key: string, value: any) {
  emit('change', {key, value})
}
watch( item, () => {
  form.value = {...item.value}
}, { immediate: true, deep: true })
</script>

<template>
  <template v-if="item.dataType === 'date'">
    <el-date-picker  v-model="form.value"
                     type="datetime"
                     :placeholder="$t('dpTip_datePicker')"
                     value-format="YYYY-MM-DDTHH:mm:ss.000Z"
                     @change="(val) => changeHandler(item.metaData, val)"
       ></el-date-picker>
  </template>
  <template v-else-if="item.directoryEntries">
    <el-cascader  v-model="form.value"
                  :options="item.directoryEntries"
                  :props="{ checkStrictly: item.hasChild, value: 'id', label: 'id' }"
                  @change="(val) => changeHandler(item.metaData, ...val)"
                  clearable filterable popper-class="pc-el-cascader"></el-cascader>
  </template>
  <template v-else>
    <el-input  v-model="form.value" type="text" :id="`meta_${item.metaData}`"
               :maxlength="item.length" show-word-limit @change="(val) => changeHandler(item.metaData, val)"/>
  </template>

</template>

<style  lang="scss">
.el-date-editor {
  --el-date-editor-width: 100%;
}
</style>
