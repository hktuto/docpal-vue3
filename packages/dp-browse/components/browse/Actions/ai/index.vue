<template>
    <SvgIcon id="infoActionButton" src="/icons/logo/ai.svg"  
                :content="$t('rightDetail_info')"
                round
                @click="itemClicked"></SvgIcon>
</template>

<script lang="ts" setup>
const props = defineProps(['doc'])
const emits = defineEmits(['openAiDrawer'])

function itemClicked() {
    emits('openAiDrawer')
}
</script>


<style lang="scss">

</style>
