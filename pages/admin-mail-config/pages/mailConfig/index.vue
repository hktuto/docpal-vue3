<template>
    <NuxtLayout class="fit-height withPadding">
        <div class="flex-x-end">
            <el-button @click="uploadXlsx">{{$t('import')}}
                <input v-show="false" ref="inputRef" type="file" accept=".json" @change="handleFile"/>
            </el-button>
            <el-button type="primary" @click="handleSubmit">{{$t('save')}}</el-button>
        </div>
        <FromRenderer ref="FromRendererRef" :form-json="formJson" @formChange="handleFormChange"/>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
import { GetMailConfigApi, SaveMailConfigApi, getJsonApi } from 'dp-api'
const formJson = getJsonApi('admin/mailConfig.json')
const FromRendererRef = ref()
function handleFormChange () {}
async function handleGet() {
    const res = await GetMailConfigApi()
    FromRendererRef.value.vFormRenderRef.setFormData(res)
}
async function handleSubmit () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    const res = await SaveMailConfigApi(data)
    const url = res
    window.open(url,'_blank')
}
// #region module: import
    const inputRef = ref()
    function uploadXlsx() { inputRef.value.click() }
    function handleFile (event) {
        const reader = new FileReader();
        reader.readAsText(event.target.files[0], "UTF-8");
        reader.onload = function (e) {
        try {
            let configJson = JSON.parse(e.target.result as string);
            if (configJson.web) configJson = configJson.web
            if (configJson.installed) configJson = configJson.installed
            const _configJson:any = {
                clientId: configJson.client_id || configJson.clientId,
                clientSecret: configJson.client_secret || configJson.clientSecret,
                redirectUri: configJson.redirectUri || configJson.redirect_uris[0] ,
                authenticationMethod: configJson.tenantId ? 'MICROSOFT_OFFICE_365' : 'GOOGLE',
            }
            if(configJson.senderAddress) _configJson.senderAddress = configJson.senderAddress
            if(configJson.tenantId) _configJson.tenantId = configJson.tenantId
            FromRendererRef.value.vFormRenderRef.setFormData(_configJson)
        } catch (error) {
            Message.error('file format error')
        }
        }

    }
// #endregion
onMounted(() => {
    nextTick(async() => {
        FromRendererRef.value.vFormRenderRef.setFormJson(formJson)
        await handleGet()
    })
})
</script>

<style lang="scss" scoped>
.pageContainer{
  padding: calc( var(--app-padding) * 2);
  height: 100%;
  position: relative;
}
.button-add {
    margin: 0 0 var(--app-padding) 0;
}
.filter-container {
    display: grid;
    grid-template-columns: 1fr min-content;
    gap: var(--app-padding);
}
.el-tag +.el-tag {
    margin-left: var(--app-padding);
}
</style>
