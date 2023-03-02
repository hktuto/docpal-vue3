<template>
    <div :class="{pageContainer:true,withPadding}">
        <slot />
    </div>
</template>
<script lang="ts" setup>
const props = withDefaults(defineProps<{withPadding?:boolean}>(),{
    withPadding:true
})
</script> 

<style lang="scss" scoped>
.pageContainer{
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    &.withPadding {
        padding: calc(var(--app-padding) * 2);
    }
}
</style>