<template>
<div>
    <el-tree :data="state.treeData" :props="state.defaultProps"
        @node-click="handleNodeClick" />
</div>
</template>


<script lang="ts" setup>
import { GetCabinetResultApi, GetCabinetTemplateApi } from 'dp-api'
const route = useRoute()
const state = reactive({
    id: '',
    treeData: [],
    defaultProps: {
        children: 'children',
        label: 'label'
    }
})
// #region module: tree
    function handleNodeClick () {}
// #endregion
async function init (docId, templateId) {
    console.log({docId}, 'ini');
    // await GetCabinetResultApi(id)
    state.treeData = await GetCabinetTemplateApi(templateId)
    await GetChild(docId)
    // await GetCabinetTemplateApi(templateId)
}
watch(() => route.query, (q) => {
    if (q.id) {
        state.id = q.id
        init(state.id, q.tab)
    }
}, { immediate: true })
defineExpose({ init })
</script>

<style lang="scss" scoped>

</style>
