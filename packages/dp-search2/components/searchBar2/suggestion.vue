<template>
    <div>
        <el-tag v-if="inputValue" @click="handleClick('paramsInTextSearch', inputValue)" class="tagOption">
            {{ $t('search.paramsInTextSearch') }}: <b>{{ inputValue }}</b>
        </el-tag>
        <el-tag v-for="(value,key) in state.tagList" :key="key" class="tagOption">
           <div class="label"> {{ $t(value.label) }}:</div>
            <b v-for="(item, index) in value.values" :key="item.key + index"
               class="options"
               @click="handleClick(item.key, item.optionValue)"
            >
              {{ item.optionLabel }}
            </b>
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
        let threshold = 0.7
        if (props.suggestKeywordList?.includes(val.toLowerCase())) threshold = 0.8
        state.tagList = {}
        let allTag:any = {}
        // const data =
        keyList.forEach(key => {
            didYouMean(val, props.suggestList, {
                matchPath: [key],
                returnType: ReturnTypeEnums.ALL_MATCHES,
                threshold
            }).forEach((item: any) => {
                if(!allTag[item.key]) {
                    allTag[item.key] = {
                      ...item,
                      values:[]
                    }
                }
                // check item.optionValue exist in allTag
                if(!allTag[item.key].values.find((v: any) => v.optionValue === item.optionValue)){
                  allTag[item.key].values.push(item)
                }
            })

        })
        state.tagList = allTag
    } else {
        state.tagList = {}
    }
})
</script>
<style lang="scss" scoped>

.el-tag {
    margin: 6px 6px 0 0 ;
    cursor: pointer;
}
.tagOption{
  --el-tag-bg-color:var(--color-grey-000);
  --el-tag-border-color:var(--color-grey-0000);
  --el-tag-text-color:var(--color-grey-600);
  --el-tag-border-radius: 1rem;
  padding:0 0.8rem;
  :deep {
    .el-tag__content {
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      align-items: center;
      //gap: calc(var(--app-padding) / 2);
    }
    .options + .options {
      &:before {
        content :', '
      }
    }
  }
}
</style>
