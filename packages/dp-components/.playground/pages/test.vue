<template>
  <el-tabs :tab-position="tabPosition" class="demo-tabs">
    <el-tab-pane label="table">
      <!-- <ExampleTable></ExampleTable> -->
      <!-- <ExampleTest></ExampleTest> -->
      <!-- <ExampleTablePagination></ExampleTablePagination> -->
    </el-tab-pane>
    <el-tab-pane label="render">
      <ExampleFormRender></ExampleFormRender>
    </el-tab-pane>
    <el-tab-pane label="designer">
      <FromDesigner></FromDesigner>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const tabPosition = ref('left')
</script>
<style >
.appThemeBg {
  background-image: unset;
}
</style>
<style scoped lang="scss">
.el-tabs {
  height: 100%;
  padding: var(--app-padding)
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-tabs--right .el-tabs__content,
.el-tabs--left .el-tabs__content {
  height: 100%;
}
</style>
