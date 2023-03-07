<template>
<div>{{$t('buttons')}}</div>
<div class="tag-container">
    <draggable
            :list="buttons"
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
                    <SvgIcon :src="element.prefixIcon" ></SvgIcon>
                    {{ element.name }}
                    <SvgIcon :src="element.suffixIcon" ></SvgIcon>
                </el-tag>
            </template>
    </draggable>
    <el-button class="button-new-tag ml-1" size="small" @click="showDialog()">
        + Add Buttons
    </el-button>
</div>
    <TableColumnButtonsEdit ref="tableColumnButtonsEditRef"
        @add="handleAdd"
        @save="handleSave"></TableColumnButtonsEdit>
</template>

<script lang="ts" setup>
import draggable from 'vuedraggable'
interface TableProps {
    buttons: Table.ButtonItem
}
const props = defineProps<TableProps>()
const emit = defineEmits(['update:buttons', 'change'])

const tableColumnButtonsEditRef = ref()

function handleAdd (formatItem) {
    const list = deepCopy(props.buttons)
    formatItem.index = list.length
    list.push(formatItem)
    emit('update:buttons', list)
    
}
function handleSave (formatItem) {
    const list = deepCopy(props.buttons)
    const index = list.findIndex(item => item.index === formatItem.index)
    list[index] = formatItem
    emit('update:buttons', list)
}
function handleDelete (formatItem,index) {
    let list = deepCopy(props.buttons)
    list.splice(index, 1)
    list = list.map((item, index) => ({ ...item, index }))
    emit('update:buttons', list)
}
function handleDragEnd () {
    let list = deepCopy(props.buttons)
    list = list.map((item, index) => ({ ...item, index }))
    emit('update:buttons', list)
}

const showDialog = (buttonItem: Table.ButtonItem) => {
    tableColumnButtonsEditRef.value.handleOpen(buttonItem)
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
  :deep(.el-tag__content) {
    display: grid;
    align-items: center;
    grid-template-columns: repeat(3, min-content);
  }
}
</style>
