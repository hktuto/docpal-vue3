<script lang="ts" setup>
import dayjs from 'dayjs'
const tableHelper = useTableHelper()
const props = defineProps<{ col: Table.Column }>()
const emit = defineEmits(['command'])
// 按钮组事件
const handleAction = (command: Table.Command, { row, $index }: { row: any; $index: number }, evt:Event) => {
    emit('command', command, row, $index, evt)
}
function getProp(row, prop?) {
    if(!prop) prop = props.col.prop
    return tableHelper.getProp(row, prop)
}
function formatProp (row) {
    return tableHelper.getFormatProp(row, props.col)
}
function getIcon (row, position='prefixIcon') {
    // dpLog(col[position]);

}
</script>
<template>
    <!-- 如果有配置多级表头的数据，则递归该组件 -->
    <template v-if="col.children?.length">
        <el-table-column :label="col.label" :width="col.width" :align="col.align">
            <TableColumn v-for="(item, index) in col.children" :col="item" :key="index" />
        </el-table-column>
    </template>
    <!-- 其他正常列 -->
    <el-table-column v-else v-bind="col">
        <!---图片 (START)-->
        <!-- 如需更改图片size，可自行配置参数 -->
        <template v-if="col.type === 'image'" #default="{ row, $index }">

            <el-image

                preview-teleported
                :hide-on-click-modal="true"
                :preview-src-list="[row[col.prop!]]"
                :src="getProp(row)"
                fit="cover"
                class="w-9 h-9 rounded-lg" />
        </template>
        <!---图片 (END)-->

        <!-- 如果传递按钮数组，就展示按钮组 END-->
        <!-- render函数 (START) -->
        <!-- 使用内置的component组件可以支持h函数渲染和txs语法 -->
        <template v-else-if="col.render"  #default="{ row, $index }">
            <component  :is="col.render" :row="row" :index="$index" />
        </template>

        <template v-else-if="col.buttons?.length"  #default="{ row, $index }">
            <!-- 如果传递按钮数组，就展示按钮组 START-->
            <el-button-group >
                <el-button
                    v-for="(btn, index) in col.buttons"
                    :key="index"
                    :size="btn.size"
                    :type="btn.type"
                    @click.stop="(evt) => handleAction(btn.command, { row, $index }, evt)"
                    >
                        <SvgIcon :src="btn.prefixIcon" ></SvgIcon>
                        {{ btn.name }}
                        <SvgIcon class="el-icon--right" :src="btn.suffixIcon" ></SvgIcon>
                    </el-button
                >
            </el-button-group>
        </template>
        <template v-else-if="col.slot" #default="{ row, $index }">
            <!-- render函数 (END) -->
            <!-- 自定义slot (START) -->
            <slot  :slotName="col.slot" :row="row" :index="$index"></slot>
        </template>
        <template v-else #default="{ row, $index }">
            <!-- 自定义slot (END) -->
            <!-- 默认渲染 (START) -->
            <span :class="col.class">{{ formatProp(row) }}</span>
            <!-- 默认渲染 (END) -->
        </template>
        <!-- 自定义表头 -->
        <template #header="{ column, $index }">
            <component v-if="col.headerRender" :is="col.headerRender" :column="column" :index="$index" />
            <slot
                v-else-if="col.headerSlot"
                name="customHeader"
                :slotName="col.headerSlot"
                :column="column"
                :index="$index"></slot>
            <span v-else>{{ $t(column.label) }}</span>
        </template>
    </el-table-column>
</template>
<style lang="scss" scoped>
.tag {
    display: block;
    width: fit-content;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    --el-tag-bg-color: var(--el-color-primary-light-9);
    --el-tag-border-color: var(--el-color-primary-light-8);
    --el-tag-hover-color: var(--el-color-primary);
    --el-tag-text-color: var(--el-color-primary);
    background-color: var(--el-tag-bg-color);
    border-color: var(--el-tag-border-color);
    color: var(--el-tag-text-color);
    height: 1.5rem;
    line-height: 1.3rem;
    text-align: left;
    padding: 0 9px;
    font-size: var(--el-tag-font-size);
    border-width: 1px;
    border-style: solid;
    border-radius: var(--tag-border-radius);
    box-sizing: border-box;
    white-space: nowrap;
    --el-icon-size: 14px;
}
.success-tag {
    @extend .tag;
    --el-tag-text-color: var(--el-color-success);
    --el-tag-bg-color: var(--el-color-success-light-9);
    --el-tag-border-color: var(--el-color-success-light-8);
    --el-tag-hover-color: var(--el-color-success);
}
.info-tag {
    @extend .tag;
    --el-tag-text-color: var(--el-color-info);
    --el-tag-bg-color: var(--el-color-info-light-9);
    --el-tag-border-color: var(--el-color-info-light-8);
    --el-tag-hover-color: var(--el-color-info);
}
.warning-tag {
    @extend .tag;
    --el-tag-text-color: var(--el-color-warning);
    --el-tag-bg-color: var(--el-color-warning-light-9);
    --el-tag-border-color: var(--el-color-warning-light-8);
    --el-tag-hover-color: var(--el-color-warning);
}
.danger-tag {
    @extend .tag;
    --el-tag-bg-color: var(--el-color-danger-light-9);
    --el-tag-border-color: var(--el-color-danger-light-8);
    --el-tag-hover-color: var(--el-color-danger);
    --el-tag-text-color: var(--el-color-danger);
}
.round {
    border-radius: 9999px;
}
</style>
