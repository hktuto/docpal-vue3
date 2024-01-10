<script lang="ts" setup>
import { TableColumnItem } from 'dp-api';


const props = defineProps<{
    element: TableColumnItem
}>()
const emit = defineEmits(['change'])
const handleSubmit = () => {
    emit('change', props.element)
}

</script>

<template>
    <div class="list-group-item" :data-testid="`table-sort-${element.label}`">
        <div v-if="!element.fixed"  class="handle">
            <SvgIcon src="/icons/move-handle.svg" />
        </div>
            <div class="label">
            {{$t(element.label || element.type)}}
            </div>
            <div v-if="!element.canNotDelete" class="show">
            <el-switch v-model="element.show" :disabled="element.defaultColumn" @change="handleSubmit"/>
            </div>
        </div>
</template>

<style lang="scss">
.list-group-item {
    display: grid;
    grid-template-columns: 20px 1fr 40px;
    grid-template-areas: 'handle label toggle';
    padding: calc(var(--app-padding)) calc(var(--app-padding) / 2) ;
    background: var(--color-grey-000);
    align-items: center;
    &:hover {
      background: var(--color-grey-0000);
    }
    & + & {
      border-top: 1px solid var(--color-grey-150);
    }
    .handle{
      grid-area: handle;
    }
    .label{
      grid-area: label;
    }
    .show{
      grid-area: toggle;
      justify-self: end;
    }
}
</style>
