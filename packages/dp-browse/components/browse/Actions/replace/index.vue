<template>
    <el-popover
    v-model="popoverShow"
    width="300"
    trigger="click"
    popper-class="collectionPopover popover_050">

    <template #reference>
      <SvgIcon   :src="'/icons/replace.svg'" :content="$t('tip.replace')" round :svg-class="`dp-svg-icon`"
                  class="cursorPointer headerIcons" />
    </template>
    <div v-loading="loading">
      <div class="title">{{ $t('replaceFile') }}</div>
      <el-form ref="formRef" :model="form"  label-position="top" @submit.native.prevent>
        <el-form-item :label="$t('common_file')" prop="targetFile"
                  :rules="[{ required: true, message: $t('form_common_requird')}]">
                  <BrowseActionsReplaceUpload v-model="form.fileList" :limit="1"></BrowseActionsReplaceUpload>
        </el-form-item>
        <el-form-item :label="$t('filePopover_OCRLanguages')" prop="targetFile">
                  <el-select v-model="form.languages" :multiple-limit="2" multiple placeholder="N/A">
                    <el-option  v-for="l in availableLanguage"
                            :key="l" :value="l" :label="l"></el-option>
                  </el-select>
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="handleConfirm">{{ $t('confirmText') }}</el-button>
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
import { getOcrSupportedLanguage, replaceFileDocumentApi } from 'dp-api'
const props = defineProps<{doc:any}>();

    const emits = defineEmits<{
      success: (doc: any) => void;
    }>();
    const loading = ref(false)
    const popoverShow = ref(false)
    const form = ref<any>({
      fileList: [],
      languages: []
    })
    const formRef = ref()
    const availableLanguage = ref()

    async function handleConfirm () {
      if (form.value.fileList.length === 0) {
        popoverShow.value = false
        return
      }
      const document = {
        idOrPath: props.doc.id,
        languages: form.value.languages
      }
      const formData = new FormData()
      
      formData.append('file', form.value.fileList[0].blob)
      formData.append('document', JSON.stringify(document))
      loading.value = true
      const res = await replaceFileDocumentApi(formData)
      loading.value = false
      if (!res) return 
      const ev = new CustomEvent('tree-node-update', {
        detail: { doc: props.doc, handleType: 'edit' },
      })
      window.dispatchEvent(ev)
      popoverShow.value = false
      form.value = {
        fileList: [],
        languages: []
      }
    }
    onMounted(async() => {
      availableLanguage.value = await getOcrSupportedLanguage()
    })


</script>


<style lang="scss" scoped>
:deep .el-form-item {
    margin-bottom: 5px;
}
:deep .el-select, :deep .el-upload {
  width: 100%;
}
.title {
  color: var(--color-grey-600);
}
.icon-round{
  width:26px;
  height: 26px;
  display:block;
}
</style>
