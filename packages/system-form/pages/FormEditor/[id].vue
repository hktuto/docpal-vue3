<template>
    <div class="pageContainer">
        <FromDesigner ref="fromDesignerRef"></FromDesigner>
        <el-button class="save-button" type="primary" 
            @click="handleSave">{{$t('save')}}</el-button>
    </div>
</template>

<script lang="ts" setup>
import { getJsonApi } from 'dp-api'
const route = useRoute()
const fromDesignerRef = ref()
async function handleSave () {
    
    const body = fromDesignerRef.value.getFormJson()
    dplog({body});
    const save = await $fetch(`/form/${route.params.id}`, { method:'post', body})
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
