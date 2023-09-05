<template>
<div>
    <template v-if="dragList.length === 0">
        <div>
            {{$t(nullTip)}}
        </div>
    </template>
    <draggable
        class="list-drag"
        :list="dragList"
        group="people"
        :itemKey="itemKey"
    >
        <template #item="{ element, index }">
            <el-tag class="list-drag-item">{{ element[itemKey] }}</el-tag>
        </template>
    </draggable>
    <draggable
        class="list-drop"
        :list="dropList"
        group="people"
        :itemKey="itemKey"
    >
        <template #item="{ element, index }">
            <span class="list-drop-item">
                <!-- <span v-if="element.prefixSymbol" class="list-drop-item--divider" >{{element.prefixSymbol}}</span> -->
                <!-- <DragSelectTag :element="element" @close="handleClose"/> -->
                <!-- <span v-if="element.suffixSymbol" class="list-drop-item--divider">{{element.suffixSymbol}}</span> -->
                <el-tag ref="tagRef" closable @close="handleClose(element)">{{ element[itemKey] }}</el-tag>
                <span class="list-drop-item--divider">{{joiner}}</span>
            </span>
        </template>
    </draggable>
</div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
    dropList: any,
    dragList: any,
    joiner: string,
    itemKey: string,
    nullTip: string
}>(), {
    joiner: '-',
    itemKey: 'metaData',
    nullTip: 'tip.pleaseGoToConfigDisplayMetaOrSelectDocumentType'
})
const FromRendererRef = ref()

function handleClose(element) {
    console.log(props.dropList, element);
    
    let addItem
    const index = props.dropList.findIndex(item => {
        if(item[props.itemKey] === element[props.itemKey]) {
            addItem = element
            return true
        }
        else return false
    })
    props.dropList.splice(index, 1)
    props.dragList.push(addItem)
}
function handleChange (evt) {
    const dropLen = props.dropList.length
    if (evt.added) {
        if(evt.added.newIndex < dropLen - 1) {
            const newEl = props.dropList[evt.added.newIndex]
            newEl.suffixSymbol = '-'
        }
        else if(evt.added.newIndex === dropLen - 1 && dropLen > 1) {
            const previousEl = props.dropList[evt.added.newIndex - 1]
            previousEl.suffixSymbol = '-'
        }
        
    } else if(evt.removed) {
        if(evt.removed.oldIndex === dropLen) {
            const lastEl = props.dropList[dropLen - 1]
            if(lastEl.suffixSymbol === '-') lastEl.suffixSymbol = ''
        }
    }
    // emit('update:modelValue', JSON.stringify(props.dropList))
}
onMounted(() => {
})

</script>
<style lang="scss" scoped>
.list-drag {
    &-item {
        margin-right: 3px;
    }
}
.list-drop {
    min-height: 32px;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 3px 0px 3px 11px;
    &-item {
        &--divider {
            margin: 0 3px;
        }
        &:last-of-type &--divider{
            display: none;
        }
    }
}
</style>
