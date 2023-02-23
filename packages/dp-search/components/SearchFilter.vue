<template>
    <div class="filterContainer">
        <FromRenderer :formJson="formJson" :data="form" @formChang="formChangeHandler" />
    </div>
</template>

<script lang="ts" setup>
type SearchFilter = {
    paramsInTextSearch?: string[]
    textSearchType?: string,
    // paramsInTextSearch?: string[][]
    or?: string[]
    type?: string[]
    modified?: string
    authors?: string[]
    collections?: string[]
    tags?: string[]
    size?: string,
    // size?: string[],
    folderType?: string,

    pageSize: number,
    currentPageIndex: number
}
import formJson from'./json/form.json'
const props = defineProps<{
    form : SearchFilter
}>();

//#region dropdown options
const searchTypeOptions = ref()

function formChangeHandler({fieldName,newValue,oldValue,formModel}) {
    console.log(fieldName,newValue,oldValue,formModel)
}

</script>

<style lang="scss" scoped>
.filterContainer{
    max-height: calc(100vh - 60px);
}
</style>