<script setup>

const getNode = inject('getNode');
const popoverRef = ref();
const node = ref();
const label = ref("");
const type = ref("");
const shape = ref("");
const dataId = ref("");

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
  const data = node.value.getData();
  label.value = data.attr_name || "";
  type.value = data.type;
  shape.value = node.value.shape;
  dataId.value = data.attr_id;
}

function emitDeleteEvent(){
  const ev = new CustomEvent('delete-workflow-graph-item', {
    detail: {
      node: node.value
    }
  })
  document.dispatchEvent(ev);
}

function emitAddEvent() {
  const ev = new CustomEvent('add-workflow-graph-item', {
    detail: {
      node: node.value
    }
  })
  document.dispatchEvent(ev);
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
    <div v-popover="popoverRef" :class="{graphWorkflowElement:true, shape}" :style="`--radius: ${displayType.radius};--color:${displayType.color}`">
      <SvgIcon v-if="displayType.icon" :src="displayType.icon" />
    </div>
  </ElTooltip>
  <div class="label">{{label}}</div>
  <el-popover
      ref="popoverRef"
      trigger="contextmenu"
      title="Actions"
      virtual-triggering
      persistent
      :disabled="type === 'endEvent' || type === 'exclusiveGateway' || dataId === 'start' || dataId === 'userTask'"
  >
    <div class="actions">
<!--      <SvgIcon src="/icons/add.svg" @click="emitAddEvent"></SvgIcon >-->
      <SvgIcon src="/icons/delete.svg" @click="emitDeleteEvent"></SvgIcon>
    </div>
  </el-popover>
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

.actions{
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-content: center;
  gap: var(--app-padding);
}

</style>