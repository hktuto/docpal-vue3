<script lang="ts" setup>
const props = defineProps<{
  data: any,
  allField: any,
}>();
const emit = defineEmits(['close', 'submit'])

const allEmailTemplates = ref([]);

async function getEmailTemplates() {
  // const response = await fetch('/api/email-templates');
  // const data = await response.json();
  // allEmailTemplates.value = data;
}


const selectedEmailTemplate = computed({
  get() {
    return props.data.extensionElements['flowable:field']['flowable:string']['__cdata'];
  },
  set(value) {
    props.data.extensionElements['flowable:field']['flowable:string']['__cdata'] = value;
  }
})

onMounted(async() => {
  await getEmailTemplates();
})

</script>

<template>
  <div class="emailTaskFormContainer">
    <div class="header">
    </div>
    <div class="formContainer">
      {{data}}
      <ElForm :model="data">
        <ElFromItem>
          <ElSelect v-model="selectedEmailTemplate" placeholder="Select email template">
            <ElOption v-for="item in allEmailTemplates" :key="item.id" :label="item.name" :value="item.id"></ElOption>
        </ElFromItem>
      </ElForm>
    </div>
    <div class="footer">
      <ElButton @click="$emit('close')">Close</ElButton>
      <ElButton type="primary" @click="$emit('submit', data)">Save</ElButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.emailTaskFormContainer{
  width: 100%;
  max-width: 600px;
  min-width: 280px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: stretch;
  height: 100%;
  padding: var(--app-padding);
  .formContainer{
    overflow: auto;
  }
}
</style>