<template>
<div>{{$t('formatDisplay')}}</div>
<div class="tag-container">
    <draggable
            :list="formatList"
            item-key="prop"
            class="tag-list"
            ghost-class="ghost"
            @end="handleDragEnd"
            >
            <template #item="{ element, index }">
                <el-tag
                    closable
                    :disable-transitions="false"
                    @click="showDialog(element)"
                    @close="handleDelete(element, index)"
                >
                    {{ element.prop }}
                </el-tag>
            </template>
    </draggable>
    <el-button class="button-new-tag ml-1" size="small" @click="showDialog()">
        + Add Prop
    </el-button>
</div>
    <TableColumnPropsEdit ref="tableColumnPropsEditRef"
        @add="handleAdd"
        @save="handleSave"></TableColumnPropsEdit>
</template>

<script lang="ts" setup>
import draggable from 'vuedraggable'
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
function handleDragEnd () {
    let list = deepCopy(props.formatList)
    list = list.map((item, index) => ({ ...item, index }))
    emit('update:formatList', list)
}

const showDialog = (formatItem) => {
    tableColumnPropsEditRef.value.handleOpen(props.formatList, formatItem)
}
</script>
<style lang="scss" scoped>
.tag-container {
    flex-wrap: nowrap;
    overflow: hidden;
    white-space: nowrap;
    overflow-x: auto;
    .tag-list {
        display: inline-block;
    }
}
.el-tag {
  margin: var(--app-input-padding);
}
</style>
