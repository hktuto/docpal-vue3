<template>
    <div class="formContainer">
        <client-only>
            <v-form-render :form-json="fromJsonNormalizer" :form-data="data" :option-data="options" ref="vFormRef" @formChange="formChange" />
        </client-only>
    </div>
</template>

<script lang="ts" setup>

    const emits = defineEmits(['submit','clean','fail', 'formChange']);
    const props = defineProps<{
        data?: Object,
        formJson?: any
        options?: Object,
    }>();
    const demoJson = reactive({"widgetList":[{"key":32895,"type":"input","icon":"text-field","formItemFlag":true,"options":{"name":"input63695","label":"input","labelAlign":"","type":"text","defaultValue":"","placeholder":"","columnWidth":"200px","size":"","labelWidth":null,"labelHidden":false,"readonly":false,"disabled":false,"hidden":false,"clearable":true,"showPassword":false,"required":false,"requiredHint":"","validation":"","validationHint":"","customClass":[],"labelIconClass":null,"labelIconPosition":"rear","labelTooltip":null,"minLength":null,"maxLength":null,"showWordLimit":false,"prefixIcon":"","suffixIcon":"","appendButton":false,"appendButtonDisabled":false,"buttonIcon":"custom-search","onCreated":"","onMounted":"","onInput":"","onChange":"","onFocus":"","onBlur":"","onValidate":""},"id":"input63695"},{"key":32895,"type":"input","icon":"text-field","formItemFlag":true,"options":{"name":"input87811","label":"input","labelAlign":"","type":"text","defaultValue":"","placeholder":"","columnWidth":"200px","size":"","labelWidth":null,"labelHidden":false,"readonly":false,"disabled":false,"hidden":false,"clearable":true,"showPassword":false,"required":false,"requiredHint":"","validation":"","validationHint":"","customClass":"","labelIconClass":null,"labelIconPosition":"rear","labelTooltip":null,"minLength":null,"maxLength":null,"showWordLimit":false,"prefixIcon":"","suffixIcon":"","appendButton":false,"appendButtonDisabled":false,"buttonIcon":"custom-search","onCreated":"","onMounted":"","onInput":"","onChange":"","onFocus":"","onBlur":"","onValidate":""},"id":"input87811"},{"key":86877,"type":"number","icon":"number-field","formItemFlag":true,"options":{"name":"number50050","label":"number","labelAlign":"","defaultValue":0,"placeholder":"","columnWidth":"200px","size":"","labelWidth":null,"labelHidden":false,"disabled":false,"hidden":false,"required":false,"requiredHint":"","validation":"","validationHint":"","customClass":"","labelIconClass":null,"labelIconPosition":"rear","labelTooltip":null,"min":-100000000000,"max":100000000000,"precision":0,"step":1,"controlsPosition":"right","onCreated":"","onMounted":"","onChange":"","onFocus":"","onBlur":"","onValidate":""},"id":"number50050"}],"formConfig":{"modelName":"formData","refName":"vForm","rulesName":"rules","labelWidth":80,"labelPosition":"left","size":"","labelAlign":"label-left-align","cssCode":"","customClass":"","functions":"","layoutType":"PC","jsonVersion":3,"onFormCreated":"","onFormMounted":"","onFormDataChange":"","saveRemoteOptions":"never","labelFormUniqueName":true}})

    const fromJsonNormalizer = computed(() => {
        if(!props.formJson) return {}
        if(props.formJson.formConfig.jsonVersion === 3) return props.formJson;
        // normalize vue 2 form designer

        let json = props.formJson;
        json.formConfig.jsonVersion = 3
        let st = JSON.stringify(json);
        st = st.replaceAll('this.$axios','$api');
        json = JSON.parse(st);
        console.log(json)
        return json
    })

    function formChange(fieldName, newValue, oldValue, formModel) {
        emits('formChange', {fieldName,newValue,oldValue,formModel})
    }


</script>

<style scoped>

</style>