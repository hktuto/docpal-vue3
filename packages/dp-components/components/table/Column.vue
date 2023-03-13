<script lang="ts" setup>
import dayjs from 'dayjs'
const props = defineProps<{ col: Table.Column }>()
const emit = defineEmits(['command'])
// 按钮组事件
const handleAction = (command: Table.Command, { row, $index }: { row: any; $index: number }) => {
    emit('command', command, row, $index)
}
function getProp(row, prop?) {
    if(!prop) prop = props.col.prop
    return tableHelper.getProp(row, prop)
}
function formatProp (row) {
    return tableHelper.getFormatProp(row, props.col)
}
function getIcon (row, position='prefixIcon') {
    // console.log(col[position]);
    
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
    <el-table-column
        v-else v-bind="col">
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
                    @click="handleAction(btn.command, { row, $index })"
                    >
                        <SvgIcon :src="btn.prefixIcon" ></SvgIcon>
                        {{ btn.name }}
                        <SvgIcon :src="btn.suffixIcon" ></SvgIcon>
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
            <SvgIcon :src="getIcon(row)" ></SvgIcon>
            <span >{{ formatProp(row) }}</span>
            <SvgIcon :src="getIcon(row, 'suffixIcon')"></SvgIcon>
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
