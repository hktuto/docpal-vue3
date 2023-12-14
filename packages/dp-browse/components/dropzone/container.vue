<template>
    <div ref="dropZoneRef" :class="{dropzone:true, isOverDropZone}">
        <slot />
    </div>
</template>


<script lang="ts" setup >
import { useDropZone } from '@vueuse/core'
import { addDataTransfer } from '../../../dp-components/utils/upload'
const { createUploadRequest } = useUploadAIStore()
const props = defineProps<{doc: any}>();
const router = useRouter()
const dropZoneRef = ref<HTMLDivElement>()

const handleDrop = async (_, e) => {
    const files = await addDataTransfer(e.dataTransfer)
    createUploadRequest(props.doc, files)
}
const { isOverDropZone } = useDropZone(dropZoneRef, handleDrop)
</script>

<style lang="scss" >
.dropzone{
    &.isOverDropZone {
        &:after{
            content: '';
            position: absolute;
            left:-10%;
            top: -10%;
            width: 120%;
            height: 120%;
            background: var(--primary-color-03);
            z-index: 10;
        }
    }
}
</style>