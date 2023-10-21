<template>
    <div class="imageContainer" :style="`--canvas-size:${canvasSize}px`">
        <ImageUpload v-if="!image" @imageChange="imageChangeHandler" />
        <Canvas v-else :image="image" :canvasSize="canvasSize" @clear="cleanImg" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, onMounted } from '@nuxtjs/composition-api'
    import { Message } from 'element-ui';

    import ImageUpload from './ImageUpload.vue'
    import Canvas from './Canvas.vue'

    export default defineComponent({
        components:{ImageUpload, Canvas},
        setup(){
            const image = ref();
            const canvasSize = ref(600);
            function cleanImg() {
                 image.value = null;
            }
            function imageChangeHandler(img) {
                console.log("imageChangeHandler");
                image.value = img;
            }

            return {
                image,
                cleanImg,
                imageChangeHandler,
                canvasSize
            }
        }
    })
</script>

<style lang="scss" scoped>
.imageContainer{
    width: var(--canvas-size);
    height: var(--canvas-size);
    aspect-ratio: 1 / 1;
    position: relative;
    overflow: hidden;
}

</style>

