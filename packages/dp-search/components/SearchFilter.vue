<template>
    <div class="filterContainer">
        <FromRenderer v-if="filterJson" :form-json="filterJson"  :data="searchFilter" @formChang="formChangeHandler" />
        <ElButton @click="$emit('closed')">close</ElButton>
        <ElButton @click="$emit('closed')">Submit</ElButton>
    </div>
</template>

<script lang="ts" setup>
import { getJsonApi } from 'dp-api'
const filterJson = ref();

const {searchFilter, search} = useSearch();

//#region dropdown options
const searchTypeOptions = ref()

function formChangeHandler({fieldName,newValue,oldValue,formModel}) {
    console.log(fieldName,newValue,oldValue,formModel)
}

onMounted(async() => {
    filterJson.value = await getJsonApi('search.json')
    console.log(filterJson.value)
})

</script>

<style lang="scss" scoped>
.filterContainer{
    max-height: calc(100vh - 60px);
}
</style>