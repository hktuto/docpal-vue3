<script setup>

const getNode = inject('getNode');
const node = ref();
const label = ref("");

function getLabel() {
  const { attr_name } = node.value.getData();
  label.value = attr_name || "";
}

onMounted(() => {
  node.value = getNode()
  getLabel();
  node.value.on('change:data',() => {
    getLabel();
  })
})
</script>

<template>
  <ElTooltip :content="label">
    <div class="graphWorkflowElement">
      <SvgIcon src="/bpmn/icons/form.svg" />
    </div>
  </ElTooltip>
  <div class="label">{{label}}</div>
</template>

<style scoped lang="scss">
.graphWorkflowElement{
  width: 100%;
  aspect-ratio: 1/1;
  position: relative;
  overflow: hidden;
  background: #0099ff;
  border-radius: 1rem;
  display: grid;
  place-items: center;
  --icon-size: 40px;
}
// create label width text-overflow
.label {
  font-size: .8rem;
  width: 100%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>