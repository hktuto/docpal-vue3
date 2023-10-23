<script lang="ts" setup>
    import { ElMessage } from 'element-plus';

    import ImageUpload from './ImageUpload.vue'
    import Canvas from './Canvas.vue'

    const image = ref();
    const canvasSize = ref(600);
    function cleanImg() {
            image.value = null;
    }
    function imageChangeHandler(img) {
        console.log("imageChangeHandler");
        image.value = img;
    }
</script>

<template>
    <div class="imageContainer" :style="`--canvas-size:${canvasSize}px`">
        <ImageUpload v-if="!image" @imageChange="imageChangeHandler" />
        <Canvas v-else :image="image" :canvasSize="canvasSize" @clear="cleanImg" />
    </div>
</template>



<style lang="scss" scoped>
.imageContainer{
    width: var(--canvas-size);
    height: var(--canvas-size);
    aspect-ratio: 1 / 1;
    position: relative;
    overflow: hidden;
}

</style>

