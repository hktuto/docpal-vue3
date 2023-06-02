<template>
    <div class="emptyContainer">
        <div class="iconContainer">
            <InlineSvg class="svg"  :src="'/icons/menu/watermark.svg'"/>
            <h3>No Watermark found</h3>
        </div>
        <div class="formContainer">
            <ElForm :model="form" @submit.native.prevent="submit">
                <ElFormItem label="label">
                    <ElInput v-model="form.name" placeholder="New Watermark label" />
                </ElFormItem>
                <ElFormItem>
                    <ElButton class="button" type="primary" @click="submit">Create New Watermark</ElButton>
                </ElFormItem>
            </ElForm>
        </div>
    </div>
</template>

<script lang="ts" setup>

import InlineSvg from 'vue-inline-svg';
const emit = defineEmits(['update'])
import { useWatermark } from '../../composables/Watermark'
const { localePath } = useContext()
const router = useRouter()
const form = ref({
  name: ''
})
const { createWatermarkTemplate } = useWatermark();
async function submit() {
  if(!form.value.name){
    // TODO : show error
    return;
  }
  const newItem = await createWatermarkTemplate(form.value);
  emit('update')
  router.push({
    path: '/watermark',
    query: { id: newItem.id }
  })
}
</script>


<style lang="scss" scoped>
.emptyContainer{
    --max-width: 250px;
    display: flex;
    gap: 0;
    justify-content: center;
    align-items: center;
    flex-flow: column nowrap;
    height: 100vh;
    width: 100%;
}
.iconContainer{
    max-width: var(--max-width);
    h3{
        font-size: 1.5rem;
        font-weight: 200;
        color: #8796A4;
        margin: 0;
        margin-bottom: 1rem;
    }
    .svg {
        width: var(--max-width);
        color: #8796A4;
    }
}
.formContainer{
    width: var(--max-width);
    position: relative;
    .button{
        width: 100%;
    }
}
</style>
