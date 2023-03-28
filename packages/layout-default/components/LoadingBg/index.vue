<template>
    <div class="fullPage">
        <canvas id="gradient-canvas" :class="{canvasInit}"  data-transition-in/>
    </div>
</template>

<script lang="ts" setup >
import {Gradient} from './Gradient'
import { useEventListener } from '@vueuse/core'
const color1= '#ef008f';
const color2= '#6ec3f4';
const color3= '#7038ff';
const color4= '#e2e2e2';

const canvasInit = ref(false)

const canvas = ref();

function canvasRender(){
    canvasInit.value = true;
}
function createGradient() {
    canvasInit.value = false;
   const gradient = new Gradient()
    // Call `initGradient` with the selector to your canvas
    gradient.initGradient('#gradient-canvas');
}


onMounted(() => {
    useEventListener(window,'miniGLRender', canvasRender);
    createGradient()
})
</script>

<style lang="scss" scoped>
.fullPage{
    position: fixed;
    left:0;
    top:0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: -1;
    background-color: var(--primary-color);
    #gradient-canvas{
        position: fixed;
        left: 0;
        top:0;
        height: 100vh;
        width: 100%;
        background: var(--primary-color);
        opacity: 0;
        transition: opacity .3s ease-in-out;
        &.canvasInit{
            opacity: 1 !important;
        }
    }
}
</style>