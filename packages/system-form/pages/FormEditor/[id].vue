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

onMounted(() => fromDesignerRef.value.setFormJson(getJsonApi(route.params.id)))
watch(() => route.params.id, (newJsonName) => {
    fromDesignerRef.value.setFormJson(getJsonApi(newJsonName))
}, { immediate: false })
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
