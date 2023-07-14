<script setup lang="ts">
const tableHelper = useTableHelper()
const props = defineProps<{ col: Table.Column, rowData:any, rowIndex }>()
const emit = defineEmits(['command'])

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
  <div class="cardContent">
    <div class="header">
      <component v-if="col.headerRender" :is="col.headerRender" :column="col" :index="rowIndex" />
      <slot
        v-else-if="col.headerSlot"
        name="customHeader"
        :slotName="col.headerSlot"
        :column="col"
        :index="rowIndex"></slot>
      <span v-else>{{ $t(col.label) }}</span>
    </div>
    <div class="content">
      <template v-if="col.type === 'image'" >

        <el-image

          preview-teleported
          :hide-on-click-modal="true"
          :preview-src-list="[rowData[col.prop!]]"
          :src="getProp(rowData)"
          fit="cover"
          class="w-9 h-9 rounded-lg" />
      </template>

      <template v-else-if="col.render"  >
        <component  :is="col.render" :row="rowData" :index="rowIndex" />
      </template>

      <template v-else-if="col.buttons?.length"  >
        <!-- 如果传递按钮数组，就展示按钮组 START-->
        <el-button-group >
          <el-button
            v-for="(btn, index) in col.buttons"
            :key="index"
            :size="btn.size"
            :type="btn.type"
            @click.stop="(evt) => handleAction(btn.command, { row:rowData, $index:rowIndex }, evt)"
          >
            <SvgIcon :src="btn.prefixIcon" ></SvgIcon>
            {{ btn.name }}
            <SvgIcon class="el-icon--right" :src="btn.suffixIcon" ></SvgIcon>
          </el-button
          >
        </el-button-group>
      </template>

      <template v-else-if="col.slot" >

        <!-- render函数 (END) -->
        <!-- 自定义slot (START) -->
        <slot :slotName="col.slot" :row="rowData" :index="rowIndex"></slot>
      </template>

      <template v-else >
        <!-- 自定义slot (END) -->
        <!-- 默认渲染 (START) -->
        <span :class="col.class">{{ formatProp(rowData) }}</span>
        <!-- 默认渲染 (END) -->
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cardContent{
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  padding-block: var(--app-padding);
  &.slotTopRight{
    .header {
      display: none;
    }
    position: absolute;
    top: 0;
    right:var(--app-padding);
  }
  .header{
    font-size: .8rem;
    color: var(--primary-color);
    line-height: 1;
  }
}
</style>
