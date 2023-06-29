<template>
    <div ref="dropZoneRef" :class="{dropzone:true, isOverDropZone}">
        <slot />
    </div>
</template>


<script lang="ts" setup >
import { useDropZone } from '@vueuse/core'
import { addDataTransfer } from '../../../dp-components/utils/upload'
const { setUploadFiles } = useUploadStore()

const props = defineProps<{doc: any}>();
const router = useRouter()
const dropZoneRef = ref<HTMLDivElement>()


const handleDrop = async (_, e) => {
    const files = await addDataTransfer(e.dataTransfer)
    setUploadFiles(files, props.doc)
    router.push('/browse/upload')
}
const { isOverDropZone } = useDropZone(dropZoneRef, handleDrop)
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