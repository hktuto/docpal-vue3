<script lang="ts" setup>
const percentage = ref(70);
const getNode = inject('getNode');
const node = ref();
onMounted(() => {
  node.value = getNode()
  console.log(node.value)
})
</script>

<template>
  <el-progress type="dashboard" :percentage="percentage" :width="80">
    <template #default="{ percentage }">
      <span class="percentage-value">{{ percentage }}%</span>
    </template>
  </el-progress>
</template>

<style scoped lang="scss">

</style>