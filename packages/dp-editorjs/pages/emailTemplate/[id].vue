<template>
<NuxtLayout class="fit-height withPadding" backPath="/emailTemplate" :pageTitle="$t('admin_emailTemplate')">
    <div v-if="ready" class="pageContent">
        
        <div class="actions">
            <div v-if="data" class="name">
                {{ data.subject }}
                <div class="editButton"></div>
            </div>
            <div class="action">
                <ElSelect type="primary" v-model="selectedLayout" >
                    <ElOption v-for="item in layouts" :key="item.id" :label="item.name" :value="item.id"></ElOption>
                </ElSelect>
                <ElButton type="primary" size="small" >{{ $t('email_send_test') }}</ElButton>
                <ElButton type="primary" size="small" @click="save">{{ $t('common_save') }}</ElButton>
            </div>
        </div>
        <div class="email_content">
            <div class="responsiveSizeEditorContainer"></div>
            <div :class="{emailTemplateContainer:true, mode}" v-html="selectedLayoutHtml">

            </div>
        </div>
    </div>
</NuxtLayout>
</template>

<script lang="ts" setup>
    import { api, GetEmailLayoutPageApi } from 'dp-api';
    import { useEditor } from '~/editorComponents/editor';

    const route = useRoute()
    const id = route.params.id;
    const variables = ref<any[]>([]);
    const ready = ref(false)
    const layouts = ref<any[]>([]);
    const selectedLayout = ref<any>(null);
    const mode = ref<'desktop' | 'mobile'>('desktop');

    const editor = useEditor('emailContent', {}, variables);

    /**
     * Step 1: 從後端取得 template 資料
     */
    const {data} = useAsyncData(async () => {
        const { data } = await api.get(`/docpal/template/email/template/${id}`);
        // loop template body and get all variables
        const body = data.data.body;
        await getVariableFromBody(body);
        await getTemplateLayout(data.data.emailLayoutId);
        ready.value = true;
        return data.data;
    });

    /**
     * Step 2 : 從 body 中取得所有的變數
     * @param body 
     */
    async function getVariableFromBody(body: string) {
        // get all text within ${}
        const regex = /\${(.*?)}/g;
        let match;
        while ((match = regex.exec(body)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (match.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            variables.value.push(match[1]);
        }
        // remove duplicates
        variables.value = [...new Set(variables.value)];
        console.log(variables.value)
    }

    /**
     * Step 3: 從後端取得所有的 layout
     * @param templateId 
     */
    async function getTemplateLayout(templateId?:string) {
        const { entryList } = await GetEmailLayoutPageApi({pageNum:0,pageSize:1000});
        layouts.value = entryList;
        selectedLayout.value = templateId || entryList[0].id;
    }

    /**
     * Step 4: 根據選擇的 layout 產生 html
     */
    const selectedLayoutHtml = computed(() => {
        if(!selectedLayout.value) return '';
        const {layoutContent} = layouts.value.find(item => item.id === selectedLayout.value);
        nextTick(() => {
                editor.dispose();
                editor.createEditor();
            })
        return layoutContent.replaceAll('[[emailContent]]', '<div id="emailContent"></div>');
    })


    async function save() {
        const {html, json} = await editor.getData();
        console.log(html)
    }


    
</script>

<style lang="scss" scoped>
.pageContent{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .actions{
        display: flex;
        justify-content: space-between;
        padding: 10px;
    }
    .email_content{
        flex: 1 0 auto;

    }
    .emailTemplateContainer{
        height: 100%;
    }
}
</style>
