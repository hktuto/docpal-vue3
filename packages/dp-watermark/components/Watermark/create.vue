<template>
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
</template>

<script lang="ts" setup>

import { ElMessage} from 'element-plus';
import {useWatermark, WatermarkTemplate} from '../../composables/Watermark'

const emits = defineEmits(['submit'])

const props = defeineProps<{
  list: WatermarkTemplate[]
}>()
const i18n = useI18n()

const form = ref({
  name: ''
})
const { localePath } = useContext()
const { createWatermarkTemplate, list } = useWatermark()
const router = useRouter();

async function submit() {
  if(!form.value.name){
    // TODO : show error
    return;
  }
  // if form.name is in list return
  if(props.list.findIndex(item => item.name === form.value.name) !== -1 ){
    ElMessage.error( i18n.t('admin_watermark_name_already_exist') as string);
    return;
  }
  const newItem = await createWatermarkTemplate(form.value);
  emit('submit', form.value)
  router.push( {
    path: localePath('/watermark'),
    query: {
      id: newItem.id
    }
  })
  // const { data } = await this.$axios.post('/api/watermark', this.form)

}
onMounted(() => {
  form.value = {
    name: ''
  }
});

</script>

