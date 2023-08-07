<template>
  <BrowseActionsButton :label="$t('tip.replace')" >
    
    <SvgIcon :src="'/icons/replace.svg'" :content="$t('tip.replace')" round :svg-class="`dp-svg-icon`"
                class="cursorPointer headerIcons" 
        @click="handleOpenReplaceDialog(doc)"/>
  </BrowseActionsButton>
    <BrowseActionsReplaceDialog ref="BrowseActionsReplaceDialogRef" 
        @update="emits('success')"/>
</template>

<script lang="ts" setup>
import { getOcrSupportedLanguage, replaceFileDocumentApi } from 'dp-api'
const props = defineProps<{doc:any}>();
const emits = defineEmits(['success'])
const BrowseActionsReplaceDialogRef = ref()
function handleOpenReplaceDialog(doc) {
    BrowseActionsReplaceDialogRef.value.handleOpen(doc)
}
</script>

<style lang="scss" scoped>
</style>
