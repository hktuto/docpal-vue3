<template>
    <div class="pageContainer">
        <FromDesigner ref="fromDesignerRef"></FromDesigner>
        <el-button class="save-button" type="primary" 
            @click="handleSave">{{$t('save')}}</el-button>
    </div>
</template>

<script lang="ts" setup>
import { getJsonApi, saveJsonApi } from 'dp-api'
const route = useRoute()
const fromDesignerRef = ref()
function handleSave () {
    
    const newJson = fromDesignerRef.value.getFormJson()
    dplog({newJson});
    saveJsonApi(route.params.id, newJson)
}
watch(() => route.params.id, (newJsonName) => {
    setTimeout(() => {
        fromDesignerRef.value.setFormJson(getJsonApi(newJsonName))
    })
}, { immediate: true })
</script>
<style lang="scss" scoped>
:deep(.left-toolbar) {
    display: none;
}
.save-button {
    position: fixed;
    top: 10px;
    right: 20px;
    z-index: 10;
}
</style>
