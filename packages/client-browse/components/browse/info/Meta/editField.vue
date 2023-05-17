<script setup lang="ts">
const { displayTime } = useTime()
const props = defineProps<{
  item: any
}>();
const { item } = toRefs(props)
const emit = defineEmits(['change'])
</script>

<template>
  <template v-if="item.dataType === 'date'">
    <el-date-picker  v-model="item.value"
                     type="datetime"
                     default-time="12:00:00"
                     :placeholder="$t('dpTip_datePicker')"
                     value-format="yyyy-MM-ddTHH:mm:ss.000Z"
                     ></el-date-picker>
  </template>
  <template v-else-if="item.directoryEntries">
    <el-cascader  v-model="item.value"
                  :options="item.directoryEntries"
                  :props="{ checkStrictly: item.hasChild, value: 'id', label: 'id' }"
                  clearable filterable popper-class="pc-el-cascader"></el-cascader>
  </template>
  <template v-else>
    <el-input  v-model="item.value" type="text"
               :maxlength="item.length" show-word-limit/>
  </template>

</template>

<style scoped lang="scss">

</style>
