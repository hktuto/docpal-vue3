<template>
    <div class="fullPage">
        <canvas id="gradient-canvas"  data-transition-in/>
    </div>
</template>

<script lang="ts" setup >
import {Gradient} from './Gradient'
const color1= '#ef008f';
const color2= '#6ec3f4';
const color3= '#7038ff';
const color4= '#e2e2e2';



const canvas = ref();

function createGradient() {
   const gradient = new Gradient()
    // Call `initGradient` with the selector to your canvas
    gradient.initGradient('#gradient-canvas');
}

onMounted(() => {
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
    background: var(--primary-color);
    #gradient-canvas{
        position: fixed;
        left: 0;
        top:0;
        height: 100vh;
        width: 100%;
        background: lightgrey;
    }
}
</style>