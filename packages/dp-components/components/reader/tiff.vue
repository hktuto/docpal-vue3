<template>
    <div class="tiffContainer" v-if="!props.loading" ref="tiffRef">
        <el-image v-for="(item, index) in state.imgUrls" :src="item" fit="contain"
            :preview-src-list="state.imgUrls" :initial-index="index"/>
    </div>
</template>

<script lang="ts" setup>
import { TiffV } from '../../stores/tiff.min.js'
TiffV()
const props = defineProps<{
    blob: Blob,
    loading: Boolean
}>();
const state = reactive({
    imgUrls: [],
    interval: null
})
const tiffRef = ref()
function blobToArrayBuffer(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsArrayBuffer(blob);
    });
}
function handleMultiTiff(tiffFile) {
    const countDirectory = tiffFile.countDirectory()
    for (let i = 0; i < countDirectory; i++) {
        tiffFile.setDirectory(i)
        state.imgUrls.push(tiffFile.toDataURL())
    }
}
watch(() => props.blob, async(newBlob) => {
    state.imgUrls = []
    const data = await blobToArrayBuffer(newBlob)
    let tiffFile = new Tiff({buffer: data});
    handleMultiTiff(tiffFile)
}, {
    immediate: true
})
</script>

<style lang="scss" scoped>
.tiffContainer{
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background: #fff;
    border-radius: 12px;
    overflow: auto;
}
</style>
