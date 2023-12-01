<template>
    <div class="filterContainer">
        <FromRenderer ref="FromRendererRef" :form-json="filterJson"   @form-change="formChangeHandler" />
        <el-button @click="$emit('closed')">{{$t('close')}}</el-button>
        <el-button @click="handleReset">{{$t('reset')}}</el-button>
        <el-button @click="handleSubmit">{{$t('submit')}}</el-button>
    </div>
</template>

<script lang="ts" setup>
import { getJsonApi } from 'dp-api'
const props = defineProps<{
    searchParams: any
}>()
const route = useRoute()
const emits = defineEmits(['submit'])
const filterJson = getJsonApi('search.json')
const FromRendererRef = ref()
function formChangeHandler({fieldName,newValue,oldValue,formModel}) {
    // dpLog(fieldName,newValue,oldValue,formModel)
    if(route.path === '/search') emits('submit', formModel)
}
function handleSubmit () {
    const data = FromRendererRef.value.vFormRenderRef.getFormData(false)
    emits('submit', data)
}
function handleReset() {
    FromRendererRef.value.vFormRenderRef.resetForm()
}
onMounted(async() => {
    nextTick(() => {
        const keywordRef = FromRendererRef.value.vFormRenderRef.getWidgetRef('paramsInTextSearch')
        keywordRef.setHidden(true)
    })
})
defineExpose({ handleSubmit })
</script>

<style lang="scss" scoped>
.filterContainer{
    max-height: calc(100vh - 60px);
}
</style>
