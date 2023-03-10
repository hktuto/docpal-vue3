<template>
<div class="svg-list-container">
    {{svgIconList}}
    <div v-for="list in svgIconList" :key="list.name">
        {{list.name}}
        <div class="svg-list">
            <el-card v-for="svg in list.children" :key="svg.src" :class="{'selectedSvg': svg.src === _selectSvg}" @click="handleSvgClick(svg)">
                <SvgIcon :src="svg.src" />
                <div>{{svg.name}}</div>
            </el-card>
        </div>
    </div>
</div>
</template>
<script lang="ts" setup>
const props = defineProps<{
    selectedSrc: string
}>()
const value = ref()
import InlineSvg from 'vue-inline-svg';

const _selectSvg = ref(props.selectedSrc)
const emit = defineEmits(['svg-click', 'update:selectedSrc'])
const handleSvgClick = (item)=>{
    _selectSvg.value = item.src
}
function getSvg () {
    emit('update:selectedSrc', _selectSvg.value)
}
defineExpose({ getSvg })
</script>

<style lang="scss" scoped>
.svg-list {
    display: grid;
    grid-template-columns: repeat(7,1fr);
    gap: var(--app-padding);
    .selectedSvg {
        background-color: aquamarine;
    }
    :deep(.el-card__body) {
        text-align: center;
    }
}
</style>
