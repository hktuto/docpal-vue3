

<template>
    <WatermarkUiProperties @delete="$emit('delete')">
    <ElForm>
      <ElUpload :limit="1" :auto-upload="false" action="#" :on-change="fileChange"  accept="image/jpeg, image/png" :show-file-list="false">
        <ElButton size="small" type="primary">{{ $t('admin_watermark_replace')}}</ElButton>
        <div slot="tip" class="el-upload__tip">{{ $t('admin_watermark_upload_limit')}}</div>
      </ElUpload>
      <ElFormItem :label="$t('admin_watermark_rotate')">
        <ElInputNumber v-model="value.angle" :min="0" :max="360" size="small" @change="$emit('change', value)" />
      </ElFormItem>
      <ElFormItem :label="$t('admin_watermark_opacity')">
        <ElInputNumber v-model="value.opacity" size="small" :min="0.1" :max="1" :step="0.1" @change="$emit('change', value)" />
      </ElFormItem>

      <WatermarkAnchor v-model="value.position" @change="(val) => {$emit('anchorChange', val); value.postion = val;}"/>
    </ElForm>
    </WatermarkUiProperties>
</template>

<script  lang="ts" setup >
import {useWatermark, WatermarkTemplateDetail} from "../../composables/Watermark";
import InlineSvg from "vue-inline-svg";
import { ElMessage } from 'element-plus'

const props = defineProps<{
  value: any
}>()

const emit = defineEmits(['change', 'delete', 'anchorChange'])

function fileChange(e) {
  const file = e.raw;
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
  const isLt100k = file.size / 1024 / 1024 < 0.1;

  if (!isJPG) {
    ElMessage.error('Image must be JPG or PNG format!');
  }
  if (!isLt100k) {
    ElMessage.error('Image size can not exceed 100kb!');
  }
  if(!isJPG || !isLt100k) return;
  const ob:any = props.value;
  const imgEL = new Image();
  imgEL.onload = (ev) => {
    console.log("file loaded")
    ob.width = imgEL.width;
    ob.height = imgEL.height;
    ob.scaleX = imgEL.width > 300 ? 300 / imgEL.width : 1;
    ob.scaleY = imgEL.width > 300 ? 300 / imgEL.width : 1;

    ob.setSrc(imgEL.src)
    emit('change', ob)
  }
  imgEL.src = URL.createObjectURL(e.raw);
}
</script>


<style scoped lang="scss">

.el-upload{
  .el-button{
    width: 100%;
  }
}
.el-upload__tip{
  font-size: 0.8rem;
  line-height: 1.2;
}

</style>
