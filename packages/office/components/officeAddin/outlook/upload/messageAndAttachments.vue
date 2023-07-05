<script setup lang="ts">
const props = defineProps<{
  item : any
  attachments: any[]
}>()
const emits = defineEmits(['back', 'submit'])
const items = ref([])
const step = ref(0)

const nextStep = (item:any[]) => {
  step.value = 1
  items.value.push(...item)
}

function submit(item:any[]) {
  items.value.push(...item);
  emits('submit', items.value)
}
</script>

<template>
  <div class="container">
    <template v-if="step === 0">
      <OfficeAddinOutlookUploadMessage :item="item" @back="$emit('back')" @submit="nextStep"/>
    </template>
    <template v-else>
      <OfficeAddinOutlookUploadAttachments :attachments="attachments" @back="$emit('back')" @submit="submit"/>
    </template>
  </div>
</template>

<style scoped lang="scss">

</style>