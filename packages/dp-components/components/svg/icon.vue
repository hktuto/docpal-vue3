<template>
<div>
    <template v-if="content">
        <el-tooltip :content="content">
            <template v-if="round">
                <span class="svg-icon-round">
                    <component :is="InlineSvg" :class="svgClass" :src="src"></component>
                </span>
            </template>
            <template v-else>
                <component :is="InlineSvg" :class="svgClass" :src="src"></component>
            </template>
        </el-tooltip>
    </template>
    <template v-else-if="round">
        <span class="svg-icon-round">
            <component :is="InlineSvg" :class="svgClass" :src="src"></component>
        </span>
    </template>
    <template v-else>
        <component :is="InlineSvg" :class="svgClass" :src="src"></component>
    </template>
</div>
</template>

<script lang="ts" setup>
import InlineSvg from 'vue-inline-svg';
const props = defineProps<{
    src: string,
    round?: boolean,
    content?: string
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
        opacity: 0.7;
    }
    path {
        fill: currentColor;
    }
}

.svg-icon-round {
    cursor: pointer;
    font-size: var(--icon-size, 18px);
    width: var(--icon-bg-size, 32px);
    height: var(--icon-bg-size, 32px);
    color: var(--icon-color, #181a1b)!important;
    background-color: var(--icon-bg-color, --color-grey-150);
    border-radius: 50%;
    display: grid;
    place-items: center;
    svg {
        color: currentColor;
        width: var(--icon-size, 14px);
        height: var(--icon-size, 14px);
        &:hover{
            color: var(--icon-hover-color, white);
        }
    }
    &:hover{
        opacity: 0.8;
        color: var(--icon-hover-color, white);
        svg{
            color: var(--icon-hover-color, white)!important;
        }
    }
}
</style>
