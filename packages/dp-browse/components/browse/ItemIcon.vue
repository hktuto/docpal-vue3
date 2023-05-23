<template>
    <div class="iconContainer">
         <SvgIcon :src="`/icons/${type}-${status}.svg`" />
    </div>
</template>

<script lang="ts" setup>
type IconType = 'folder' | 'file'
type IconStatus = 'normal' | 'selected' | 'general'
 const props = withDefaults( defineProps<{
        type: IconType;
        status?: IconStatus;
    }>() , {
        type: 'folder',
        status: 'normal'
    })
</script>
