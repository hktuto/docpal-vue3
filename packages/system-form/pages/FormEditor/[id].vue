<template>
    <div class="pageContainer">
        <div class="flex-x-between">
            {{filterPath(route.params.id) }}
            <el-button class="save-button" type="primary" 
                @click="handleSave">{{$t('common_save')}}</el-button>
        </div>
        <FromDesigner ref="fromDesignerRef"></FromDesigner>
    </div>
</template>

<script lang="ts" setup>
import { getJsonApi } from 'dp-api'
const route = useRoute()
const fromDesignerRef = ref()
async function handleSave () {
    const body = fromDesignerRef.value.getFormJson()
    const save = await $fetch(`/form/${route.params.id}`, { method:'post', body})
}
function filterPath(path) {
    return path.replace(/\-\-/g, '/')
}
watch(() => route.params.id, (newJsonName) => {
    setTimeout(() => {
        fromDesignerRef.value.setFormJson(getJsonApi(newJsonName))
    })
}, { immediate: true })
</script>
<style lang="scss" scoped>
.pageContainer {
    display: grid;
    grid-template-rows: min-content 1fr;
    height: 100%;
    overflow: hidden;
    padding: var(--app-padding) var(--app-padding) 0 0;
    gap: var(--app-padding);
}
:deep(.left-toolbar) {
    // display: none;
}
.flex-x-between {
    border-bottom: 1px solid #ddd;
    padding-bottom: var(--app-padding);
}
// :deep(.main-container .v-form-container .v-form-panel .el-tabs__content) {
//     overflow: hidden;
//     .el-tab-pane {
//         overflow: hidden;
//         height: 100%;
//     }
// }
:deep(.form-widget-container) {
    position: relative;
}
// .save-button {
//     position: fixed;
//     top: 10px;
//     right: 20px;
//     z-index: 10;
// }
</style>
