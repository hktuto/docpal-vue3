<template>
     <img :class="classes" :src="`/images/logo-${mode}-${$colorMode.value === 'system' ? 'dark' : $colorMode.value}.svg`"  alt="logo" 
        @click="handleClick"/>
    <LanguageDialog ref="LanguageDialogRef"></LanguageDialog>
</template>

<script lang="ts" setup>

const LanguageDialogRef = ref()
function handleClick() {
    
    LanguageDialogRef.value.handleOpen()
    console.log({data});
}

</script>
