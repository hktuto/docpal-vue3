<template>
<NuxtLayout class="fit-height withPadding" backPath="/emailTemplate" :pageTitle="$t('admin_emailTemplate')">
    <div class="emailTemplateContainer" v-html="selectedLayoutHtml">

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

    const editor = useEditor('emailContent', {}, variables);;

    const {data} = useAsyncData(async () => {
        const { data } = await api.get(`/docpal/template/email/template/${id}`);
        // loop template body and get all variables
        const body = data.data.body;
        await getVariableFromBody(body);
        await getTemplateLayout(data.data.emailLayoutId);
        ready.value = true;
        return data.data;
    });

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
    }

    async function getTemplateLayout(templateId?:string) {
        const { entryList } = await GetEmailLayoutPageApi({pageNum:0,pageSize:1000});
        layouts.value = entryList;
        selectedLayout.value = templateId ? entryList.find((item:any) => item.id === templateId) : entryList[0];
    }

    const selectedLayoutHtml = computed(() => {
        if(!selectedLayout.value) return '';
        const {layoutContent} = selectedLayout.value;
        return layoutContent.replaceAll('[[emailContent]]', '<div id="emailContent"></div>');
    })

    watch(ready, (bool) => {
        if(bool) {
            editor.createEditor()

        }
    });
    
</script>

<style lang="scss" scoped>
</style>
