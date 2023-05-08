<template>
    <div class="formContainer">
        <client-only>
            <v-form-render ref="vFormRenderRef" :form-json="fromJsonNormalizer" :form-data="data" :option-data="options" @formChange="formChange" 
                @file-preview="handleFilePreview">
                <template v-for="(idx, slotName) in $slots" #[slotName]>
                    <slot :name="slotName"></slot>
                </template> 
            </v-form-render>
        </client-only>
        <ReaderDialog ref="ReaderRef" v-bind="previewFile" ></ReaderDialog>
    </div>
</template>

<script lang="ts" setup>
import { WorkflowAttachmentDownloadApi } from 'dp-api'
    const emits = defineEmits(['submit','clean','fail', 'formChange']);
    const props = withDefaults(defineProps<{
        data?: Object,
        formJson?: Object,
        options?: Object,
        attachmentDownloadApi: Function,
    }>(), {
        attachmentDownloadApi: (id: string) => WorkflowAttachmentDownloadApi(id)
    });
    const vFormRenderRef = ref()
    const fromJsonNormalizer = computed(() => {
        if(!props.formJson) return {}
        if(!props.formJson.formConfig) return {}
        
        let json = deepCopy(props.formJson)
        // if(json.formConfig.jsonVersion === 3) return props.formJson;
        // normalize vue 2 form designer
        if(!json.formConfig) json.formConfig = { }
        json.formConfig.jsonVersion = 3
        let st = JSON.stringify(json);
        st = st.replaceAll('this.$axios','$api');
        st = st.replaceAll('this.$cookies.get','$getCookie')
        st = st.replaceAll('yyyy-MM-dd','YYYY-MM-DD')
        json = JSON.parse(st);
        
        return json
    })
    function setFormJson (json) {
        let st = JSON.stringify(json);
        st = st.replaceAll('this.$axios','$api').replaceAll('_$api','$api');
        st = st.replaceAll('this.$cookies.get','$getCookie')
        st = st.replaceAll('yyyy-MM-dd','YYYY-MM-DD')
        json = JSON.parse(st);
        vFormRenderRef.value.setFormJson(json)
    }

    function formChange(fieldName, newValue, oldValue, formModel) {
        emits('formChange', {fieldName,newValue,oldValue,formModel})
    }

    const ReaderRef = ref()
    const previewFile = reactive({
        blob: null,
        name: '',
        id: '',
        loading: false
    })
    async function handleFilePreview(fileInfo) {
        ReaderRef.value.handleOpen()
        previewFile.loading = true
        const fileId = fileInfo.response && fileInfo.response.length > 0 ? fileInfo.response[0].contentId : fileInfo.id
        try {
            previewFile.blob = await WorkflowAttachmentDownloadApi(fileId)
        } catch (error) {
            
        }
        previewFile.id = fileId
        previewFile.name = fileInfo.name
        previewFile.loading = false
    }
    defineExpose({ vFormRenderRef, setFormJson })
</script>

<style scoped>
:deep(.el-form-item__content>div) {
    width: 100%;
    .el-date-editor {
        width: 100%;
    }
}
</style>