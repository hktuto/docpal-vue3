<template>
    <NuxtLayout>
        <language-switch />
        {{availableLocales}}
    </NuxtLayout>
</template>

<script lang="ts" setup>
const {public:{availableLocales}} = useRuntimeConfig();
</script>