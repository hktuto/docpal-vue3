<template>
<div>{{$t('formatDisplay')}}</div>
  <el-tag
    v-for="(formatItem, index) in formatList"
    :key="index"
    class="mx-1"
    closable
    :disable-transitions="false"
    @click="showDialog(formatItem)"
    @close="handleDelete(formatItem, index)"
  >
    {{ formatItem.prop }}
  </el-tag>
  <el-button class="button-new-tag ml-1" size="small" @click="showDialog()">
    + Add Prop
  </el-button>
  <TableColumnPropsEdit ref="tableColumnPropsEditRef"
    @add="handleAdd"
    @save="handleSave"></TableColumnPropsEdit>
</template>

<script lang="ts" setup>
interface TableProps {
    formatList: Table.formatListType[]
}
const props = defineProps<TableProps>()
const emit = defineEmits(['update:formatList', 'change'])

const tableColumnPropsEditRef = ref()

function handleAdd (formatItem) {
    const list = deepCopy(props.formatList)
    formatItem.index = list.length
    list.push(formatItem)
    emit('update:formatList', list)
    
}
function handleSave (formatItem) {
    const list = deepCopy(props.formatList)
    const index = list.findIndex(item => item.index === formatItem.index)
    list[index] = formatItem
    emit('update:formatList', list)
}
function handleDelete (formatItem,index) {
    let list = deepCopy(props.formatList)
    list.splice(index, 1)
    list = list.map((item, index) => ({ ...item, index }))
    emit('update:formatList', list)
}


const showDialog = (formatItem) => {
  tableColumnPropsEditRef.value.handleOpen(props.formatList, formatItem)
}
</script>
