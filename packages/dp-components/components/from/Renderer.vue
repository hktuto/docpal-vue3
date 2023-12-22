<template>
    <div class="formContainer">
        <client-only>
            <v-form-render ref="vFormRenderRef" :form-json="fromJsonNormalizer" :form-data="data" :option-data="options" @formChange="formChange" 
                @file-preview="handleFilePreview"
                @emit="handleEmit">
                <template v-for="(idx, slotName) in $slots" #[slotName]="data">
                    <slot :name="slotName" :data="data"></slot>
                </template> 
            </v-form-render>
        </client-only>
        <ReaderDialog ref="ReaderRef" v-bind="previewFile" ></ReaderDialog>
    </div>
</template>

<script lang="ts" setup>
import { WorkflowAttachmentDownloadApi } from 'dp-api'
    const emits = defineEmits(['submit','clean','fail', 'formChange', 'emit']);
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
    function handleEmit (funName, newValue, oldValue) {
        emits(funName, newValue, oldValue)
        emits('emit', funName, newValue, oldValue)
    }
    const ReaderRef = ref()
    const previewFile = reactive({
        blob: null,
        name: '',
        id: '',
        loading: false,
        options: {
            noDownload: true,
            print: false,
            loadAnnotations: false,
            readOnly: true
        }
    })
    async function handleFilePreview(fileInfo) {
        ReaderRef.value.handleOpen()
        previewFile.loading = true
        try {
            const fileId = fileInfo.response?.data && fileInfo.response.data.length > 0 ? fileInfo.response.data[0].contentId : fileInfo.id
            try {
                previewFile.blob = await WorkflowAttachmentDownloadApi(fileId)
            } catch (error) {
                
            }
            previewFile.id = fileId
            previewFile.name = fileInfo.name
        } catch (error) {
            
        }
        previewFile.loading = false
    }
    defineExpose({ vFormRenderRef, setFormJson })
</script>

<style lang="scss" scoped>
:deep(.el-form-item__content>div) {
    width: 100%;
    .el-date-editor {
        width: 100%;
    }
}
:deep .el-select-group__wrap {
    display: unset!important;;
}
</style>
<style lang="scss">
.el-select-group__wrap {
    display: unset!important;;
}
.el-select-group__wrap:not(:last-of-type)::after {
    bottom: 0px;
}
.el-time-panel {
    width: 150px;
}
</style>
