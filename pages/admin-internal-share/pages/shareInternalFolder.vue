<template>
    <ShareMeFolder v-bind="state"></ShareMeFolder>
</template>


<script lang="ts" setup>
import ShareMeFolder from '../../client-share-me/pages/shareMeFolder.vue'
const state = {
    backPath: 'shareInternal',
    routePath: 'shareInternalFolder',
    title: 'admin_shareInternal'
}
</script>

<style lang="scss" scoped>
</style>
