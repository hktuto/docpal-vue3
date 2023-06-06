<template>
<el-dialog v-model="state.visible" class="scroll-dialog" :title="$t('languageSet')"
    :close-on-click-modal="false"
    >
    <div v-for="item in state.languageKeys">
        <b>{{item}}</b>： {{$t(item)}}
        <el-button>{{$t('set')}}</el-button>
    </div>
</el-dialog>
</template>
<script lang="ts" setup>
const { getLanguageKeys } = useLanguage()
import { } from 'dp-api'
const emits = defineEmits([
    'refresh'
])
const state = reactive({
    loading: false,
    visible: false,
    languageKeys: []
})
function handleOpen () {
    state.visible = true
    state.languageKeys = getLanguageKeys()
}
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>
</style>
