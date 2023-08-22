<template>
    <div class="emptyContainer">
        <div :style="`--button-width: ${width + 20}px`" class="iconContainer">
            <SvgIcon class="svg"  :src="'/icons/menu/retention.svg'"/>
            <h3 ref="el">{{$t('rp.notFound')}}</h3>
            <el-button class="add-button" type="primary" @click="handleAdd">{{$t('rp.create')}}</el-button>
        </div>
        <RetentionAddDialog ref="RetentionAddDialogRef" @update="emit('update')" />
    </div>
</template>

<script lang="ts" setup>
import { getJsonApi, CreateCabinetTemplateApi } from 'dp-api'
import { useElementSize } from '@vueuse/core'
const emit = defineEmits(['update'])
const el = ref()
const { width, height } = useElementSize(el)
const RetentionAddDialogRef = ref()
function handleAdd () {
    RetentionAddDialogRef.value.handleOpen()
}
</script>


<style lang="scss" scoped>
.emptyContainer{
    height: 100%;
    width: var(--button-width);
    display: flex;
    justify-content: center;
    align-items: center;
}
.iconContainer{
    display: flex;
    flex-direction: column;
    align-items: center;
    h3{
        font-size: 1.5rem;
        font-weight: 200;
        color: #8796A4;
        margin: 0;
        margin-bottom: 1rem;
    }
    .svg {
        --icon-size: calc(var(--button-width) / 1.2);
        // width: var(--button-width);
        color: #8796A4;
        margin-bottom: 1rem;
    }
}
.add-button {
    width: var(--button-width)
}
</style>
