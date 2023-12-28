<template>
    <div>
        <el-tag v-if="inputValue" @click="handleClick('paramsInTextSearch', inputValue)">
            <b>{{ $t('search_keyword') }}:  </b>{{ inputValue }}    
        </el-tag>
        <el-tag v-for="(item, index) in state.tagList" :key="item.optionValue + index"
            @click="handleClick(item.key, item.optionValue)">
            <b>{{ $t(item.label) }}:  </b>{{ item.optionLabel }}    
        </el-tag>
    </div>
</template>
<script lang="ts" setup>
import didYouMean, { ReturnTypeEnums } from 'didyoumean2'
const props = defineProps(['inputValue', 'suggestList', 'filterList'])
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
        if (['size','modified', 'document type', 'type', 'width', 'duration', 'mimeType', 'height'].includes(val.toLowerCase())) threshold = 0.8
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