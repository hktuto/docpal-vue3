<template>
    <el-popover
        ref="popoverRef"
        placement="bottom-start"
        :width="state.width"
        popper-class="searbar-card-container"
    >
        <template #reference>
            <el-button class="suggestion-item" size="small" type="info">{{ $t('search.withMetadata') }}</el-button>
        </template>
        <template #default>
            <SearchBar2Condition v-model="state.value" v-bind="state.condition"></SearchBar2Condition>
        </template>
    </el-popover>
</template>
<script lang="ts" setup>
import { GetMetaValidationRuleApi } from 'dp-api'
const state = reactive<any>({
    width: 250,
    value: '',
    condition: {
        optionItems: [],
        label: 'search.withMetadata'
    }
})
onMounted(async() => {
    const data = await GetMetaValidationRuleApi()
    state.condition.optionItems = data.reduce((prev: any, item: any) => ({
        value: 'dc:nature',
        label: 'dc:nature',
        rule: item
    }))
})
</script>
<style lang="scss" scoped>
.suggestion-item {
    margin: 6px 6px 0 0 ;
}
</style>