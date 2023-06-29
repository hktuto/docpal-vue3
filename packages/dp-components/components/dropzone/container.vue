<template>
    <div ref="dropZoneRef" :class="{dropzone:true, isOverDropZone}">
        <slot />
    </div>
</template>


<script lang="ts" setup >
import { useDropZone } from '@vueuse/core'
const emits = defineEmits([
    'drop',
])
const dropZoneRef = ref<HTMLDivElement>()
function onDrop(files: File[] | null, event: DragEvent) {
  // called when files are dropped on zone
  emits('drop', files, event)
}

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)
</script>

<style lang="scss" >
.dropzone{
    &.isOverDropZone {
        &:after{
            content: '';
            position: absolute;
            left:0;
            top:0;
            width: 100%;
            height: 100%;
            background: var(--primary-color-03);
            z-index: 10;
        }
    }
}
</style>