<template>
      <el-autocomplete
        v-model="state.inputValue"
        prefix-icon="el-icon-search"
        :fetch-suggestions="querySearch"
        :placeholder="$t('common_filter')"
        :value-key="props.attr"
        clearable
        class="inline-input w-50"
        placeholder="Please Input"
        @select="handleSelect"
        @change="handleChange"
      />
</template>

<script lang="ts" setup>
const props = defineProps<{
    list: Array,
    attr: string,
}>()
const state = reactive({
    inputValue: '',
    results: []
})
const emits = defineEmits([
    'filter'
])
const querySearch = (queryString: string, cb?: any) => {
    const list = props.list.reduce((prev,item) => {
      if (item.children) {
        item.children.forEach(cItem => {
          cItem.parent = item[props.attr]
          prev.push(cItem)
        })
      } else {
        prev.push(item)
      }
      return prev
    }, [])
    const results = queryString
        ? list.filter(createFilter(queryString))
        : list
    // call callback function to return suggestions
    if(cb) cb(results)
    return results
}
const createFilter = (queryString: string) => {
  return (listItem) => {
    return (
      listItem[props.attr].toLowerCase().includes(queryString.toLowerCase())
    )
  }
}
const handleSelect = (item) => {
  const data = state.inputValue ? querySearch(state.inputValue) : props.list
  emits('filter', data)
}
const handleChange = (value) => {
  const data = value ? querySearch(value) : props.list
  emits('filter', data)
}
</script>