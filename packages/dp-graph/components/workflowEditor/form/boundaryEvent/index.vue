<script lang="ts" setup>
const props = defineProps<{
  data: any;
}>()

const emit = defineEmits(['close', 'submit'])

const time = computed({
  get(){
    return  Number(props.data.timerEventDefinition.timeDuration.substring(1, 2));
  },
  set(value) {
    props.data.timerEventDefinition.timeDuration = `P${value}D`
  }
})

</script>

<template>
  <div class="userTaskFormContainer">
    <div class="header">
    </div>
    <div class="formContainer">
      <ElForm label-position="top">
        <ElFormItem label="Remind in day(s)" >
          <ElInputNumber v-model="time" controls-position="right" :min="1"  :step="1" />
        </ElFormItem>
      </ElForm>
    </div>
    <div class="footer">
      <ElButton @click="$emit('close')">Close</ElButton>
      <ElButton type="primary" @click="$emit('submit', data)">Save</ElButton>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.userTaskFormContainer{
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

.actions{
  display: flex;
  gap: .6rem;
  --icon-color: var(--color-grey-500);
  --icon-size: 1rem;
}
.formFieldList{
  padding: 0;
  margin: var(--app-padding) 0;
}
.formFieldItem{
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  padding-block: calc(var(--app-padding) / 2 );
  gap: calc(var(--app-padding) / 2 );
  .fieldName{
    flex: 1 0 auto;
  }
}
.formFieldItem + .formFieldItem {
  border-top: 1px solid var(--color-grey-100);
}
</style>