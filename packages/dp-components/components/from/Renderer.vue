<template>
    <div class="formContainer">
        <client-only>
            <v-form-render ref="vFormRenderRef" :form-json="fromJsonNormalizer" :form-data="data" :option-data="options" @formChange="formChange" />
        </client-only>
    </div>
</template>

<script lang="ts" setup>
    const emits = defineEmits(['submit','clean','fail', 'formChange']);
    const props = defineProps<{
        data?: Object,
        formJson?: Object,
        options?: Object,
    }>();
    const vFormRenderRef = ref()
    const fromJsonNormalizer = computed(() => {
        if(!props.formJson) return {}
        let json = deepCopy(props.formJson)
        if(json.formConfig.jsonVersion === 3) return props.formJson;
        // normalize vue 2 form designer
        if(!json.formConfig) json.formConfig = { }
        json.formConfig.jsonVersion = 3
        let st = JSON.stringify(json);
        st = st.replaceAll('this.$axios','$api');
        json = JSON.parse(st);
        return json
    })
    function setFormJson (json) {
        let st = JSON.stringify(json);
        st = st.replaceAll('this.$axios','$api');
        json = JSON.parse(st);
        vFormRenderRef.value.setFormJson(json)
    }

    function formChange(fieldName, newValue, oldValue, formModel) {
        emits('formChange', {fieldName,newValue,oldValue,formModel})
    }
    defineExpose({ vFormRenderRef, setFormJson })
</script>

<style scoped>
:deep(.el-form-item__content div) {
    width: 100%;
    .el-date-editor {
        width: 100%;
    }
}
</style>