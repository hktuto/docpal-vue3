<template>
<div  class="flex-x-center">
    <template v-if="src">
        <template v-if="content">
            <el-tooltip :content="content">
                <template v-if="round">
                    <span :class="svgRoundClass">
                        <component :is="InlineSvg" :class="svgClass" :src="src"></component>
                    </span>
                </template>
                <template v-else>
                    <component :is="InlineSvg" :class="svgClass" :src="src"></component>
                </template>
            </el-tooltip>
        </template>
        <template v-else-if="round">
            <span :class="svgRoundClass">
                <component :is="InlineSvg" :class="svgClass" :src="src"></component>
            </span>
        </template>
        <template v-else>
            <component :is="InlineSvg" :class="svgClass" :src="src"></component>
        </template>
    </template>
</div>
</template>

<script lang="ts" setup>
import InlineSvg from 'vue-inline-svg';
const props = defineProps<{
    src: string,
    round?: boolean,
    content?: string,
    disabled?: boolean
}>()
const svgClass = computed(() => {
    if(props.disabled) return 'svg-icon svg-icon-disabled'
    return 'svg-icon'
})
const svgRoundClass = computed(() => {
    if(props.disabled) return 'svg-icon-round svg-icon-round-disabled'
    return 'svg-icon-round'
})
</script>

<style lang="scss" scoped>
.svg-icon {
    cursor: pointer;
    width: var(--icon-size, );
    height: var(--icon-size, 24px);
    fill: currentColor;
    color: var(--icon-color, --color-grey-500);
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
    color: var(--icon-color, --color-grey-950)!important;
    background-color: var(--icon-bg-color, var(--color-grey-150));
    border-radius: 50%;
    display: grid;
    place-items: center;
    svg {
        color: currentColor;
        width: var(--icon-size, 18px);
        height: var(--icon-size, 18px);
        &:hover{
            color: var(--icon-hover-color, --color-grey-0000);
        }
    }
    &:hover{
        opacity: 0.8;
        color: var(--icon-hover-color, --color-grey-0000);
        svg{
            color: var(--icon-hover-color, --color-grey-0000)!important;
        }
    }
    &-disabled  {
        cursor: unset;
        background-color: var(--icon-bg-color, var(--color-grey-300));
        svg:hover { 
            opacity: unset;
            cursor: unset;
        }
        &:hover { opacity: unset }
    }
}
</style>
