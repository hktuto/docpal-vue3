<template>
    <PageContainer>
        {{ route.params.code }}
    </PageContainer>    
</template>
<script lang="ts" setup>
const route = useRoute()
</script>
