<template>
    <div>
        <el-tag v-if="inputValue" @click="handleClick('paramsInTextSearch', inputValue)">
            {{ $t('search.keyword') }}: <b>{{ inputValue }}</b>
        </el-tag>
        <el-tag v-for="(item, index) in state.tagList" :key="item.optionValue + index"
            @click="handleClick(item.key, item.optionValue)">
            {{ $t(item.label) }}:  <b> {{ item.optionLabel }} </b>   
        </el-tag>
        <!-- <SearchBar2MetaButton></SearchBar2MetaButton> -->
    </div>
</template>
<script lang="ts" setup>
import didYouMean, { ReturnTypeEnums } from 'didyoumean2'
const props = defineProps(['inputValue', 'suggestList', 'filterList', 'suggestKeywordList'])
const emits = defineEmits(['adoptSuggestion'])

const state = reactive<any>({
    tagList: []
})
function handleClick(key, value) {
    emits('adoptSuggestion', key, value)
}
watch(() => props.inputValue, (val: any) => {
    if(!!val) {
        const keyList = ['key', 'optionLabel', 'optionValue']
        let threshold = 0.4
        if (props.suggestKeywordList?.includes(val.toLowerCase())) threshold = 0.8
        state.tagList = []
        keyList.forEach(key => {
            const data = didYouMean(val, props.suggestList, {
                matchPath: [key],
                returnType: ReturnTypeEnums.ALL_MATCHES,
                threshold
            })
            state.tagList.push(...data)
        })
    } else {
        state.tagList = []
    }
})
</script>
<style lang="scss" scoped>

.el-tag {
    margin: 6px 6px 0 0 ;
    cursor: pointer;
}
</style>