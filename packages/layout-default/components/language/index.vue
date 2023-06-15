<template>
    <SvgIcon src="/icons/language.svg" round :content="$t('languageSet')"
                @click="handleClick"></SvgIcon>
    <LanguageDialog ref="LanguageDialogRef"></LanguageDialog>
</template>

<script lang="ts" setup>

const LanguageDialogRef = ref()
function handleClick() {
    LanguageDialogRef.value.handleOpen()
}

</script>
