<template>
    <div class="formContainer">
        <client-only>
            <v-form-render v-if="formJson" :form-json="fromJsonNormalizer" :form-data="data" :option-data="options" ref="vFormRef" @formChange="formChange" />
        </client-only>
        <a href="#anchor"></a>
    </div>
</template>

<script lang="ts" setup>

    const formJson = ref();
    const emits = defineEmits(['submit','clean','fail', 'formChange']);
    const props = defineProps<{
        data?: Object,
        formJson: Object
        options?: Object,
    }>();

    const fromJsonNormalizer = computed(() => {
        if(!props.fromJson) return {}
        if(props.fromJson.formConfig.jsonVersion === 3) return props.fromJson;
        // normalize vue 2 form designer
        const json = Object.assign(props.fromJson, {formConfig:{jsonVersion:3}})
        // replace all axios

        return json
    })

    function formChange(fieldName, newValue, oldValue, formModel) {
        emits('formChange', {fieldName,newValue,oldValue,formModel})
    }


</script>

<style scoped>

</style>