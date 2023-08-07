<template>
    <div class="tiffContainer" v-if="!props.loading" ref="tiffRef">
        <el-image :src="state.imgUrl" fit="contain"
            :preview-src-list="[state.imgUrl]"/>
    </div>
</template>

<script lang="ts" setup>
import { TiffV } from '../../stores/tiff.min.js'
TiffV()
const props = defineProps<{
    annotations: Map<string,any>,
    blob: Blob,
    name: String,
    options: PdfJsOptions,
    loading: Boolean
}>();
const state = reactive({
    imgUrl: '',
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

watch(() => props.blob, async(newBlob) => {
    const data = await blobToArrayBuffer(newBlob)
    let url = new Tiff({buffer: data});
    state.imgUrl = url.toDataURL();
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
