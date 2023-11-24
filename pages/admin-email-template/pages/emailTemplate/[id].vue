<template>
<NuxtLayout class="fit-height withPadding" backPath="/emailTemplate" :pageTitle="$t('admin_emailTemplate')">
    <div v-if="ready" class="pageContent">
        <div class="actions">
            <div v-if="data" class="name">
                <span class="span">{{ data.label }}</span>
                <div class="editButton">
                  <SvgIcon :src="'/icons/edit.svg'" @click="editInfoOpened = true" />
                </div>
            </div>
            <div class="action">
                <ElSelect type="primary" v-model="selectedLayout" >
                    <ElOption v-for="item in layouts" :key="item.id" :label="item.name" :value="item.id"></ElOption>
                </ElSelect>
                <ElButton type="primary" size="small" @click="testEmailOpened = true">{{ $t('email_send_test') }}</ElButton>
                <ElButton type="primary" size="small" @click="save">{{$t('common_save')}}</ElButton>
            </div>
        </div>
        <div :class="`email_content ${mode}`">
            <div class="responsiveSizeEditorContainer">
              <SvgIcon :class="{desktop:true, active:mode === 'desktop'}" :src="'/icons/desktop.svg'" @click="mode = 'desktop'" />
              <SvgIcon :class="{mobile:true, active:mode === 'mobile'}" :src="'/icons/smartphone.svg'" @click="mode = 'mobile'" />
            </div>
            <div :class="`emailTemplateContainer ${mode}`" v-html="selectedLayoutHtml">
              
            </div>
        </div>
    </div>
  <ElDialog ref="editInfoDialog" v-model="editInfoOpened" append-to-body destroy-on-close :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
    <EditorjsInfoForm v-if="data" ref="infoFormEl" :data="data" />
    <template #footer>
      <ElButton type="primary" @click="() => {save()}">{{ $t('common_save') }}</ElButton>
    </template>
  </ElDialog>
  <ElDialog  v-model="testEmailOpened" append-to-body destroy-on-close>
    <EditorjsTestDialog ref="testEmailDialog" v-if="data" :data="data" :variables="variables" />
    <template #footer>
      <ElButton type="primary" @click="() => {sendTest();testEmailOpened = false}">{{ $t('common_save') }}</ElButton>
    </template>
  </ElDialog>
</NuxtLayout>
</template>

<script lang="ts" setup>
import {api, GetEmailLayoutPageApi, UpdateEmailTemplateApi, CreateEmailTemplateApi} from 'dp-api';
import { ElMessage } from 'element-plus';
  import { useEditor } from '~/editorComponents/editor';
  const editInfoOpened = ref(false);
  const testEmailOpened = ref(false);
  const testEmailDialog = ref();
  const route = useRoute()
  const id = route.params.id;
  const variables = ref<any[]>([]);
  const ready = ref(false)
  const layouts = ref<any[]>([]);
  const selectedLayout = ref<any>(null);
  const mode = ref<'desktop' | 'mobile'>('desktop');
  const router = useRouter()
  const infoFormEl = ref()
  
  const {t} = useI18n();


    /**
     * Step 1: 從後端取得 template 資料
     */
    const {data, refresh} = useAsyncData(async () => {
        // TODO : if id is new , create new dummy data
      if(!id ||id === 'new') {
        ready.value = true;
        await getVariableFromBody("");
        await getTemplateLayout("");
        editInfoOpened.value = true;
        return {
          subject: 'new template',
          body: '',
          emailLayoutId: '',
          emailTemplateJson: '',
          emailTemplateVariable: ''
        }
      }
        const { data } = await api.get(`/docpal/template/email/template/${id}`);
        // loop template body and get all variables
        const body = data.data.body;
        await getVariableFromBody(body);
        await getTemplateLayout(data.data.emailLayoutId);
        
        ready.value = true;
        return data.data;
    });

  const editor = useEditor('emailContent', data, variables);

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
        const {layoutContent} = layouts.value.find((item:any) => item.id === selectedLayout.value);
        nextTick(() => {
                editor.dispose();
                editor.createEditor();
            })
        return layoutContent.replaceAll('[[emailContent]]', '<div id="emailContent"></div>');
    })


/**
 *  儲存
 */
async function save() {
        const {html, json, variable} = await editor.getData();
        // if id is new , create new
        // check form valid
        
        if(id === 'new'){
          if(infoFormEl.value) {
            
          const valid = await infoFormEl.value.validate();
          if(!valid) return;
          }
          const result = await CreateEmailTemplateApi({
            ...data.value,
            // TODO : send html to body
            // url encode html
            body: html,
            emailLayoutId: selectedLayout.value,
            emailTemplateJson: JSON.stringify(json),
            emailTemplateVariable: JSON.stringify(variable)
          })
          router.push(`/emailTemplate/${result.id}`)
          // TODO : add notification
          return;
        }
        // update new variable
        // test save json to backend
        await editor.updateVariable()
        await UpdateEmailTemplateApi({
             ...data.value,
          // TODO : send html to body
          // url encode html
            body: html,
            emailLayoutId: selectedLayout.value,
            emailTemplateJson: JSON.stringify(json),
            emailTemplateVariable: JSON.stringify(variable)
        })
        editInfoOpened.value = false;
  // console.log(html);
        // TODO : add notification
    }

/**
 *  送出測試信
 */
async function sendTest(){
      testEmailDialog.value.send();
      // TODO : add notification
    }


    
</script>

<style lang="scss" scoped>
.pageContent{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .actions{
        display: grid;
      grid-template-columns: 1fr min-content;
      gap: var(--app-padding);
      margin-bottom: 20px;
        .name {
          display: flex;
          flex-flow: row nowrap;
          justify-content: flex-start;
          align-items: center;
          gap: var(--app-padding);
          flex:1 0 auto;
          word-break: break-all;
          span{
            font-size: 1.2rem;
            font-weight: bold;
          }
        }
      .action{
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        gap: var(--app-padding);
        .el-select{
          width: 200px;
        }
        > * {
          margin:0;
          
        }
      }
    }
    .email_content{
        flex: 1 0 auto;
        position: relative;
      &.desktop{
        width: 100%;
      }
      &.mobile{
        width: 375px;
        margin: 0 auto;
      }
    }
    .emailTemplateContainer{
        height: 100%;
    }
}

.responsiveSizeEditorContainer{
  position: absolute;
  left: calc(50% - 31px);
  top: -15px;
  width: 62px;
  height: 30px;
  background-color: #fff;
  z-index: 2;
  border: 1px solid #eee;
  border-radius: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  --icon-color: var(--color-grey-600);
  .desktop, .mobile{
    cursor: pointer;
    &.active{
      --icon-color: var(--primary-color);
    }
  }
}
</style>
