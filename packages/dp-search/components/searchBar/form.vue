<template>
<div class="searchBar-form" v-loading="state.loading">
    <div> {{titles}} </div>
   <template v-if="tag && state.selectDataMap[tag]">
        <el-checkbox-group
            :max="state.isMultiple ? 100 : 1 "
            v-model="state.value"
            @change="handleChange(state.value)">
            <el-checkbox v-for="item in state.options" :label="item.value" :key="item.value" >
                {{$t(item.label)}}
            </el-checkbox>
        </el-checkbox-group>
   </template>
   <template v-else-if="tag">
        <el-input v-model="state.inputValue" @change="handleInputChange"/>
   </template>
</div>
</template>

<script setup lang="ts">
import { 
    GetSTextSearchTypesApi,
    GetSAssetTypeApi,
    GetSTypesApi,
    GetKeyCloakAllUsersApi,
    GetSModifiedDateApi,
    GetSSizeApi,
    GetSCollectionsApi,
    GetSTagsApi
} from 'dp-api'
const props = defineProps<{
    tag: string,
    searchParams: any,
    titles: string
}>()
const emits = defineEmits(['change'])
const state = reactive({
    selectDataMap: {
        'textSearchType': {
            isMultiple: false,
        },
        'assetType': {
            isMultiple: false,
        },
        'type': {
            isMultiple: true,
        },
        'creator': {
            isMultiple: true,
        },
        'authors': {
            isMultiple: true,
        },
        'includeFolder': {
            isMultiple: false,
        },
        'modified': {
            isMultiple: false,
        },
        'size': {
            isMultiple: false,
        },
        'collections': {
            isMultiple: true,
        },
        'tags': {
            isMultiple: true,
        },
    },
    isMultiple: true,
    options: [],
    value: [],
    inputValue: ''
})
async function handleGetOptions(tag: string) {
    if(!state.selectDataMap[tag]) {
        if (tag === 'paramsInTextSearch') {
            setTimeout(() => {
                state.inputValue = props.searchParams[tag][0]
            }, 500)
        }
        return
    }
    state.loading = true
    try {
        switch (tag) {
            case 'textSearchType':
                state.options = await GetSTextSearchTypesApi()
                break;
            case 'assetType':
                state.options = await GetSAssetTypeApi()
                break; 
            case 'type':
                state.options = await GetSTypesApi()
                break; 
            case 'creator':
                state.options = await GetKeyCloakAllUsersApi()
                break; 
            case 'authors':
                state.options = await GetKeyCloakAllUsersApi()
                break; 
            case 'includeFolder':
                state.options = [
                    { label: $t('searchType_includeFolder_1'), value: true },
                    { label: $t('searchType_includeFolder_0'), value: false },
                ]
                break; 
            case 'modified':
                state.options = await GetSModifiedDateApi()
                break; 
            case 'size':
                state.options = await GetSSizeApi()
                break; 
            case 'collections':
                state.options = await GetSCollectionsApi()
                break; 
            case 'tags':
                state.options = await GetSTagsApi()
                break; 
            default:
                break;
        }
    } catch (error) {
        
    }
    state.loading = false
    state.isMultiple = state.selectDataMap[tag].isMultiple
    setTimeout(() => {
        if (!props.searchParams[tag]) state.value = []
        else state.value = state.selectDataMap[tag].isMultiple ? props.searchParams[tag] : [props.searchParams[tag]]
        if(tag === 'includeFolder') state.value = [ props.searchParams[tag] === '1' || props.searchParams[tag] === 1 || props.searchParams[tag] === 'true' || props.searchParams[tag] === true ]
    }, 500)
}
function handleChange(selectedData) {
    const tag = props.tag
    
    if(!state.selectDataMap[tag].isMultiple && selectedData.length === 0) return
    let oldSelectedData = []
    if (props.searchParams[tag]) oldSelectedData = state.selectDataMap[tag].isMultiple ? props.searchParams[tag] : [props.searchParams[tag]]
    if (isArrEqual(selectedData, oldSelectedData)) return
    emits('change', tag, selectedData)
}
function isArrEqual (arr1, arr2) {
    if(!arr1 || !arr2) return false
    return arr1.length === arr2.length && arr1.every((ele) => arr2.includes(ele));
}
function handleInputChange() {
    if (props.searchParams.paramsInTextSearch === [state.inputValue]) return
    emits('change', props.tag, [state.inputValue])
}
watch(() => props.tag, (newValue) => {
    if(newValue) handleGetOptions(newValue)
}, {
    immediate: true
})
defineExpose({  })
</script>
<style lang="scss" scoped>
.searchBar-form {
    padding: 5px 10px;
    min-height: 50px;
}
.el-checkbox-group {
    display: flex;
    flex-direction: column;
}
</style>