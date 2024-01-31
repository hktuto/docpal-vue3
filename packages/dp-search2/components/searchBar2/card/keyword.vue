<template>
    <div class="keyword-card">
        <div style="margin-bottom: 10px;font-weight: bold;">{{ $t('search.paramsInTextSearch') }}</div>
        <el-form label-position="top">
            <el-form-item :label="$t('search.textSearchType')">
                <el-select v-model="state.textSearchType" :teleported="false">
                    <el-option v-for="item in state.options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('search.paramsInTextSearch')">
                <el-input v-model="state.keyword"></el-input>
            </el-form-item>
        </el-form>
        <el-button style="width: 100%;margin-top: 20px;" type="primary" @click="handleConfirm">{{ $t('dpButtom_confirm') }}</el-button>
    </div>
</template>
<script lang="ts" setup>
import { GetSTextSearchTypesApi } from 'dp-api'
const props = defineProps(['keyword', 'textSearchType'])
const emits = defineEmits(['confirm'])

const state = reactive<any>({
    options: [],
    textSearchType: '',
    keyword: ''
})
function handleConfirm() {
    if(!state.textSearchType || !state.keyword) {
        return
    }
    if(state.keyword === props.keyword && state.textSearchType === props.textSearchType) return
    emits('confirm', {
        textSearchType: state.textSearchType,
        paramsInTextSearch: state.keyword
    })
}
onMounted(async() => {
    state.options = await GetSTextSearchTypesApi()
})
watch(() => [props.keyword, props.textSearchType], () => {
    state.keyword = props.keyword
    state.textSearchType = props.textSearchType
}, { immediate: true, deep: true })
</script>
<style lang="scss" scoped>
.keyword-card {
    height: 250px;
    display: grid;
    grid-template-rows: min-content 1fr min-content;
}
</style>