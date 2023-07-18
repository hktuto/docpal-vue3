<template>
    <ShareMeFolder v-bind="state"></ShareMeFolder>
</template>


<script lang="ts" setup>
import ShareMeFolder from '../../client-share-me/pages/shareMeFolder.vue'
const state = {
    backPath: 'shareOther',
    routePath: 'shareOtherFolder',
    title: 'file_share_other'
}
</script>

<style lang="scss" scoped>
</style>
