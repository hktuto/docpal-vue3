<template>
<div :class="['drag', { 'drag-active': state.active }]" >
    <h1 class="drag-title">{{$t('common_dragFileOrFolderHere')}}</h1>
</div>
</template>

<script lang="ts" setup>
import { addDataTransfer } from '../../../dp-components/utils/upload'
import { useEventListener } from '@vueuse/core'
const emits = defineEmits(['change'])
const router = useRouter()
const state = reactive({
    active: false
})
const { setUploadFiles } = useUploadStore()
// #region module: handleDrop
  const handleDrop = async (e) => {
    // e.preventDefault()
    state.active = false
    const files = await addDataTransfer(e.dataTransfer)
    setUploadFiles(files)
    router.push('/browse/upload')
    emits("change", files)
  }
// #endregion

function setActive(flag: boolean = true) {
  state.active = flag
}
defineExpose({
    setActive, handleDrop, state
})
</script>
<style lang="scss" scoped>
.drag {
    border: 1px dashed #DEDEDE;
    border-radius: 4px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    &-active {
        display: flex !important;
        position: absolute;
        top: 0;
        z-index: 111;
        background-color: rgba(126, 126, 126, 0.4);
        border: 5px dashed rgba(239, 249, 249, 1);
    }
    &-title {
        // font-size: 14px;
    }

    &-subtile {
        font-size: 12px;
        color: #999999;
        margin-top: 30px;
        text-align: center;
        line-height: unset;
    }
}
</style>
