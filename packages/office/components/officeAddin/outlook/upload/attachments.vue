<script setup lang="ts">
const props = defineProps<{
  attachments: any[]
}>()
const selectedItem = ref<any[]>([])
const emits = defineEmits(['submit', 'back'])
const forms = ref([]);
const step = ref(0)
async function submit() {
  try {
    const promises = forms.value.map((form:any) => {
      return form.validate();
    })
    const items = await Promise.all(promises)
    emits('submit', items)
  }catch(err){
    console.log(err)
  }
}

function toggleSelected(item:any){
  const i = selectedItem.value.findIndex((i:any) => i.id === item.id);
  if (i === -1) {
    selectedItem.value.push(item);
  }else{
    selectedItem.value.splice(i, 1);
  }
}
function isSelected(item:any) {
  const i = selectedItem.value.findIndex((i:any) => i.id === item.id);
  return i !== -1;
}
function confirmPick() {
  console.log(selectedItem.value)
  forms.value = [];
  step.value = 1;
}

</script>

<template>
  <div class="attachmentsContainer">
    <template v-if="step === 0">
      <div class="pickItems">
        
        <div v-for="(item, index) in attachments" :key="'pick_' + index"  :class="{item:true, selected:isSelected(item)}" @click="toggleSelected(item)">
          <BrowseItemIcon class="icon" type="file" status="general"/>
          <div class="fileName">
            {{ item.name }}
          </div>
        </div>
        
      </div>
      <el-button @click="$emit('back')">back</el-button>
      <el-button type="primary" @click="confirmPick">Next</el-button>
    </template>
    <template v-else>
      <OfficeAddinOutlookUploadAttachment  v-for="(item, index) in selectedItem" :key="index" :ref="el => { forms[index] = el }"  :attachment="item" />
      <el-button @click="step = 0">back</el-button>
      <el-button type="primary" @click="submit">Next</el-button>
    </template>
    
  </div>
</template>

<style scoped lang="scss">
.pickItems{
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: var(--app-padding);
  margin-bottom : var(--app-padding);
  .item {
    --icon-size: 80px;
    width: 120px;
    display: flex;
    flex-flow: column nowrap;
    word-break: break-all;
    border: 1px solid var(--color-grey-050);
    padding: 12px;
    border-radius: 12px;
    &.selected{
      background-color: var(--primary-color);
      color: #fff;
    }
  }
}
</style>