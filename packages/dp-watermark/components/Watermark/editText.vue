

<template>
  <WatermarkUiProperties @delete="$emit('delete')">
    <ElForm>
      <ElFormItem :label="$t('admin_watermark_content_type')">
        <ElSelect  v-model="modelValue.contentType" size="small" @change="typeChange">
          <ElOption
            v-for="type in textTypes"
            :key="type"
            :label="$t('admin_watermark_type_' + type)"
            :value="type"
          >
            {{ $t('admin_watermark_type_' + type) }}
          </ElOption>
        </ElSelect>
      </ElFormItem >
      <ElFormItem v-if="modelValue.type === 'text'" :label="$t('admin_watermark_text')">
        <ElInput v-model="modelValue.text" :readonly="!modelValue.editable" size="small" @change="$emit('update:modelValue', value)" />
      </ElFormItem>

      <ElFormItem :label="$t('admin_watermark_font_size')">
        <ElInputNumber v-model="modelValue.font.size" size="small" @change="(val) =>$emit('fontUpdate', val)" />
      </ElFormItem>
      <ElFormItem :label="$t('admin_watermark_rotate')">
        <ElInputNumber v-model="modelValue.angle" :min="0" :max="360" size="small" @change="$emit('update:modelValue', value)" />
      </ElFormItem>
      <ElFormItem :label="$t('admin_watermark_opacity')">
        <ElInputNumber v-model="modelValue.opacity" size="small" :min="0.1" :max="1" :step="0.1" @change="$emit('update:modelValue', value)" />
      </ElFormItem>
      <ElFormItem :label="$t('admin_watermark_color')">
        <ElColorPicker :value="modelValue.fill" @change="(val) => $emit('fillChange', val)" />
      </ElFormItem>
      <WatermarkAnchor v-model="modelValue.position" @change="(val) => {$emit('anchorChange', val); value.postion = val;}"/>
    </ElForm>
  </WatermarkUiProperties>
</template>

<script lang="ts" setup>
import { useWatermark } from '../../composables/Watermark'
import InlineSvg from "vue-inline-svg";
const { watermarkTypes, textTypes } = useWatermark()
const props = defineProps<{
  modelValue:any
}>();
const emit = defineEmits(['update:modelValue', 'delete', 'anchorChange', "fillChange"]);
const { t } = useI18n()

function typeChange(newType) {
  const ob:any = props.modelValue;
  if(newType !== 'text'){
    ob.type = 'dynamic'
    ob.text = t('admin_watermark_type_' + newType + '_example') as string;
    ob.editable = false
  }else {
    ob.type = 'text'
    ob.editable = true
  }
  emit('update:modelValue', ob)
}
</script>

