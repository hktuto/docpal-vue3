<template>
    <div class="checkbox-group-container">
        <div class="checkbox-title">{{ $t(label) }} </div>
        <SearchBar2ConditionFilter v-if="filter" @change="handleFilter"/>
        <el-checkbox-group v-model="state.chackList" :max="max"
            @change="handleChange">
            <template v-for="item in state._optionItems">
                <template v-if="item.children">

                    <el-checkbox :label="item.label" class="parent-checkbox" />
                    <el-checkbox v-for="cItem in item.children" :key="cItem.value" :label="cItem.value" > {{ cItem.label }} </el-checkbox>
                    <el-divider />
                </template>
                <el-checkbox v-else :label="item.value"> {{ item.label }} </el-checkbox>
            </template>
        </el-checkbox-group>
    </div>
</template>
<script lang="ts" setup>
const props = withDefaults(defineProps<{
    modelValue: any,
    optionItems: any[],
    label: string,
    max?: number,
    filter?: boolean
}>(),{
    modelValue: [],
    filter: false
})
const emits = defineEmits(['update:modelValue'])

const state = reactive<any>({
    chackList: [],
    _optionItems: [],
    filterKey: ''
})

function handleChange(val:string) {
    let result: any = []
    if(val.length > 0) {
        result = props.max === 1 ? val[0] : [...val]
    }
    else result = ''
    emits('update:modelValue', result)
}
function handleFilter(filterKey: string) {
    state.filterKey = filterKey
    state._optionItems = props.optionItems.filter((item: any) => {
        return item.label.toLowerCase().includes(filterKey.toLowerCase())
    })
}
watch(() => props.modelValue, (val: any) => {
    if(!!val) {
        state.chackList = val instanceof Array ? val : [val]
    } else {
        state.chackList = []
    }
}, {
    immediate: true
})
watch(() => props.optionItems, (val: any) => {
    if(val) state._optionItems = [...val]
}, {
    immediate: true
})
</script>
<style lang="scss" scoped>
.checkbox-group-container {
    overflow: hidden;
    // border-top: 1px dashed #DBE6EE;
    .checkbox-title {
        font-weight: bold;
        color: #333;
        font-size: 1rem;
        line-height: 32px;
        padding-top: var(--app-padding);
    }
    .el-checkbox-group {
      :deep{
        --el-checkbox-height:1.5rem;
        --el-checkbox-text-color: var(--color-grey-300);
        --el-font-weight-primary:300;
        .el-checkbox__label{

          --el-checkbox-font-size:1rem;
          word-break: break-word;
          line-height:1.2;
        }
        .el-checkbox {
          white-space: pre-wrap;
          height: initial;
        }
      }
        // border-right: 1px solid #DBE6EE;
        display: flex;
        flex-direction: column;
        //margin-top: var(--app-padding);

        width: 100%;
        .el-checkbox {
            padding: 4px 0;
        }
    }
}
.parent-checkbox {
    :deep(.el-checkbox__input) {
        opacity: 0;
    }
    :deep(.el-checkbox__label) {
        color: #333;
        font-size: 0.8rem;
        font-weight: 500;

        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        display: block;
    }
}
.h-200 {
    .el-checkbox-group {
        max-height: 200px;
        overflow: hidden auto;
        // overflow-x: hidden;
    }
}
</style>
