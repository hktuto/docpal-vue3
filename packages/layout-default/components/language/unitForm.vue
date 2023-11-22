<template>
<el-form label-position="top" class="language-form-unit">
    <el-form-item v-for="sessionKey in state.sessionKeys" :label="$t(sessionKey)" >
        <el-input v-model="state.form[sessionKey]"></el-input>
    </el-form-item>
</el-form>
</template>
<script lang="ts" setup>
import { TABLE, defaultTableSetting } from 'dp-api'
const {
    getAvailableLocales,
    getLanguageList,
    setLanguageStores } = useLanguage()
const props = defineProps<{
    lKey: string,
}>()
const state = reactive({
    form: {

    },
    sessionKeys: getAvailableLocales()
})
function handleInit () {
    state.form = getLanguageList([props.lKey], 'meta')[0]
}
async function handleSubmit () {
    try {
        await setLanguageStores(state.form)
    } catch (error) {

    }
}
onMounted(() => {
})
watch(() => props.lKey, () => {
    if(props.lKey) {
        handleInit()
    }
}, { immediate: true })
defineExpose({ handleInit, handleSubmit })
</script>
<style lang="scss" scoped>
.language-form-unit {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--app-padding);
}
.el-form-item {
    margin-bottom: unset;
}
</style>
