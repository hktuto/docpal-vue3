<template>
    <draggable
        :list="tableColumns"
        item-key="id"
        class="table-setting"
        ghost-class="ghost"
        handle=".handleDrag"
        :move="checkMove"
        @start="dragging = true"
        @end="dragging = false"
    >
        <template #item="{ element, index }">
            <el-card>
                <template #header>
                    <div class="flex-x-between">
                        <span>
                            <el-icon class="handleDrag"><Rank /></el-icon>
                            column-{{index + 1}}
                            <template v-if="element.type">- {{element.type}}</template>
                        </span>
                        <el-button v-if="!element.default" class="button" :icon="Delete" @click="handleDeleteColumn(element,index)"></el-button>
                    </div>
                </template>
                <TableColumnEdit :ref="(el) => tableColumnEditRefs[element.id] = el" :column="element"></TableColumnEdit>
            </el-card>
        </template>
    </draggable>
</template>


<script lang="ts" setup>
import draggable from 'vuedraggable'
import { Delete, Rank } from '@element-plus/icons-vue'
const props = defineProps<{
    tableColumns: any,
}>()
const tableColumnEditRefs = ref({})

function getColumns () {
    const columns = []
    const orderKeys = props.tableColumns.map((item) => item.id)
    orderKeys.forEach(key => {
        columns.push(tableColumnEditRefs.value[key].getForm())
    })
    return columns 
}

// #region module: draggable
    const dragEnabled = ref(true) // 为true时方可拖拽 
    const dragging = ref(false)
    function checkMove (e) {
        console.log("Future index: " + e.draggedContext.futureIndex);
    }
// #endregion

defineExpose({ getColumns })
</script>

<style lang="scss" scoped>
.mainContent {
    --card-height: 520px;
    --card-width: 280px;
    padding: var(--app-padding);
    display: grid;
    grid-template-rows: min-content 1fr;
    height: 100%;
    .table-setting {
        overflow: auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, var(--card-width));
        align-content: start;
        gap: var(--app-padding) 0;
        overflow: auto;
        .el-card {
            margin: var(--app-padding);
            height: var(--card-height);
            overflow: hidden;
            display: grid;
            grid-template-rows: min-content 1fr;
            :deep(.el-card__body) {
                overflow: auto;
            }
        }
    }
}
.padding {
    padding: var(--app-padding)
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.title{
    font-size: 1.6rem;
    font-weight: 900;
}
</style>