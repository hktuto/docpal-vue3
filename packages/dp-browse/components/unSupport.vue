<template>
    <div class="unSupportContainer">
        <div class="message">
            {{ $t('msg_thisFormatFileIsNotSupported') }}
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ doc: object}>();


</script>

<style lang="scss" scoped>
.unSupportContainer{
     width: 100%;
    max-width: 800px;
    height: 100%;
    margin: 0 auto;
    border-radius: 12px;
    overflow: hidden;
}
.message{
    font-size: var(--el-font-size-extra-large);
    color: var(--el-text-color-primary);
}
</style>