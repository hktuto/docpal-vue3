<script setup>

const getNode = inject('getNode');
const node = ref();
const label = ref("");
const type = ref("");
const shape = ref("");
const typeOption = {
  "form-node": {icon:"/bpmn/icons/form.svg", color: "#0099ff", radius: "1rem"},
  "document-node": {icon:"/bpmn/icons/document.svg", color: "#7B61FF", radius: "1rem"},
  "email-node": {icon:"/bpmn/icons/email.svg", color: "#29CC6A", radius: "1rem"},
  "user-node": {icon: undefined, color: "#b7b7b7", radius: "50%"},
  "exclusive-node": {icon:undefined, color: "#b7b7b7", radius: "50%"},
}

const displayType = computed(() => {
  const item = typeOption[shape.value] || typeOption['user-node'];
  if(shape.value === 'exclusive-node') {
    const isReject = node.value.id.includes('reject')
    item.icon = isReject ? "/bpmn/icons/close.svg" : "/bpmn/icons/check.svg"
    label.value = isReject ? "Reject" : "Approve";
    item.color = isReject? "red" : "#0099ff";
  }
  return item;
})
function getData() {
  const { attr_name, type  } = node.value.getData();
  label.value = attr_name || "";
  shape.value = node.value.shape;
}

onMounted(() => {
  node.value = getNode()
  getData();
  node.value.on('change:data',() => {
    getData();
  })
})
</script>

<template>
  <ElTooltip :content="label" placement="bottom">
    <div :class="{graphWorkflowElement:true, shape}" :style="`--radius: ${displayType.radius};--color:${displayType.color}`">
      <SvgIcon v-if="displayType.icon" :src="displayType.icon" />
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
  background: var(--color);
  border-radius: var(--radius);
  display: grid;
  place-items: center;
  --icon-size: 40px;
  --icon-color: #fff;
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