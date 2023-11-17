<template>
<div>
    <template v-if="state.docList.length === 0">-
    </template>
    <template v-else>
        <el-button v-for="item in state.docList" :key="item.value"  text type="primary"
            @click="handleClickDocumentType(item.value)">
            {{item.label}}
        </el-button>
    </template>
</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    data: any
}>();
const router = useRouter()
const state = reactive({
    docList: []
})
function getDocTypeList(data) {
    if(!data) {
        state.docList = []
        return
    }
    const docList = data.split(';;;')
    state.docList = docList.map((item, index) => {
        return {
            label: item.split('::')[1],
            value: item.split('::')[0]
        }
    })
}
// #region module: documentType
    function handleClickDocumentType(value: string) {
        if(!value) return
        router.push({path: '/browse', query: { path: value }})
    }
// #endregion
onMounted(() => {
    getDocTypeList(props.data)
})
</script>



<style lang="scss" scoped>
</style>
