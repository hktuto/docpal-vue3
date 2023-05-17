<template>
<div class="app" v-if="shareState" >
    <div class="pageContent">
        <template v-if="shareState === 'list'">
            <h3 class="title">{{$t('share_shareFiles')}}</h3>
            <main>
                <ShareTable :tableData="state.shareList"></ShareTable>
            </main>
        </template>
        <template v-if="shareState === 'expired'">
            <main class="expired">{{$t('share_shareExpired')}}</main>
        </template>
    </div>
</div>
<SharePassword v-else @submit="handleGetPublicDocument"></SharePassword>
</template>


<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPublicDocumentApi, TABLE, defaultTableSetting } from 'dp-api'
const route = useRoute()
const state = reactive({
    shareState: '' ,
    shareList: []
})
const { shareState, shareList } = toRefs(state)
async function handleGetPublicDocument (formData) {
    try {
        formData.token = route.query.token
        if(!formData.token) throw new Error(`${$i18n.t('responseMsg_errorCode_2')}`);
        const res = await getPublicDocumentApi(formData)
        if (res.errorCode) {
            switch(res.errorCode) {
                case 10: 
                    shareState.value = 'expired'    
                    return
                default:
                    throw new Error(res.message);
            }
            sessionStorage.removeItem('sharePWD')
        }
        else if (res instanceof Array){
            state.shareList = []
            sessionStorage.setItem('sharePWD', formData.password)
            state.shareList.push(...res)
            state.shareState = 'list'
        }
        else {
          sessionStorage.removeItem('sharePWD')
        }
    } catch (error) {
        state.shareState = ''
        // ElMessage.error(error?.response?.data?.message || error.message)
    }
}
onMounted(() => {
    const password = sessionStorage.getItem('sharePWD')
    if(password) handleGetPublicDocument({ password })
})
</script>

<style lang="scss" scoped>
.pageContent {
    display: grid;
    grid-template-rows: min-content 1fr;
    height: 100vh;
    overflow: hidden;
}
main {
    overflow: hidden;
    width: 100%;
    padding: 0 calc(var(--app-padding) * 3) 1rem;
}
.expired {
    padding-top: 10%;
    text-align: center;
    font-size: 3rem;
}
:deep(.el-tabs) {
    height: 100%;
    display: grid;
    grid-template-rows: 3rem auto;
    .el-tab-pane {
        height: 100%;
    }
}
.title {
    font-size: 1.4rem;
    line-height: 1.2;
    font-weight: 900;
    white-space: nowrap;
    color: var(--primary-color);
    padding: 1rem calc(var(--app-padding) * 3);
    background: var(--header-bg);
    margin: unset;
}
</style>
