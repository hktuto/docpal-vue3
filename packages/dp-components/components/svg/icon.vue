<template>
    <template v-if="round">
        <span class="svg-icon-round">
            <component :is="InlineSvg" :class="svgClass" :src="src"></component>
        </span>
    </template>
    <template v-else>
        <component :is="InlineSvg" :class="svgClass" :src="src"></component>
    </template>
</template>

<script lang="ts" setup>
import InlineSvg from 'vue-inline-svg';
const props = defineProps<{
    src: string,
    round: boolean
}>()
const svgClass = computed(() => {
    return 'svg-icon'
})
</script>

<style lang="scss" scoped>
.svg-icon {
    cursor: pointer;
    width: var(--icon-size, );
    height: var(--icon-size, 24px);
    fill: currentColor;
    color: var(--icon-color, #AEB6BA);
    &:hover {
        color: var(--brand);
    }
    path {
        fill: currentColor;
    }
}

.svg-icon-round {
    cursor: pointer;
    width: var(--icon-bg-size, 26px);
    height: var(--icon-bg-size, 26px);
    color: var(--icon-color, #AEB6BA);
    background-color: var(--icon-background, #6D767A);
    border-radius: 50%;
    display: grid;
    place-items: center;
    svg {
        color: currentColor;
        width: var(--icon-size, 14px);
        height: var(--icon-size, 14px);
    }
    &:hover{
        background-color: var(--icon-bg-hover-color, var(--primary-color));
        color: var(--icon-hover-color, white);
    }
}
</style>
