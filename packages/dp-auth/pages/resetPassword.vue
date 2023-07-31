<template>
    <div class="resetPassword-container">
        <LoadingBg></LoadingBg>
        <el-card>
            <Logo class="logo" mode="withName"/>
            <template v-if="state.displayStatus === 'error'">
                <h3>{{$t('dpTip_linkExpired')}}</h3>
            </template>
            <template v-else-if="state.displayStatus === 'success'">
                <h3>
                    {{$t('dpTip_autoLogin')}}: {{state.time}}s 
                </h3>
            </template>
            <template v-else>
                <FromRenderer ref="FromRendererRef" :form-json="formJson" />
                <el-button type="primary" :loading="state.loading" @click="handleSubmit">{{$t('common_submit')}}</el-button>
            </template>
            <el-button class="login-button" text @click="appStore.state = 'needAuth'"> {{ $t('login') }} </el-button>
        </el-card>
    </div>
</template>
<script lang="ts" setup>
import { checkValidTokenApi, resetPasswordApi, getJsonApi, PatchUserPasswordApi } from 'dp-api'
const props = defineProps<{
    user: object,
}>()
const emits = defineEmits([
    'refresh'
])
const appStore = useAppStore();  

const state = reactive({
    loading: false,
    displayStatus: 'reset',
    time: 5,
    timer: null
})
const route = useRoute()
const router = useRouter()
const FromRendererRef = ref()
const formJson = getJsonApi('admin/adminUserPassword.json')
async function handleSubmit () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    state.loading = true
    try {
        const param = {
            newPassword: data.password,
            token: route.query.token,
        }
        await resetPasswordApi(param)
        FromRendererRef.value.vFormRenderRef.resetForm()
    } catch (error) {
        
    }
    state.loading = false
}
function returnLogin () {
    if(!!state.timer) clearInterval(state.timer)
    state.time = 5
    state.timer = setInterval(() => {
        state.time --
        if(state.time === 0) clearInterval(state.timer)
    }, 1000)
}
onMounted(async () => {
    try {
        await checkValidTokenApi(route.query.token)
    } catch (error) {
        state.displayStatus = 'error'
    }
})
</script>
<style lang="scss" scoped>
.resetPassword-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  .el-card {
    width: 40%;
    height: fit-content;
    :deep(.el-card__body) {
        display: flex;
        flex-flow: column;
    }
  }
  h1 {
    padding: 50px;
    text-align: center;
  }
  .logoContainer {
    width: max(120px, 20%);
  }
}
.logo{
    width: 80%;
    max-width: 200px;
    margin: 0 auto var(--el-component-size-small) auto;
}
.login-button {
    margin-left: unset;
    margin-top: var(--app-padding);
}
</style>
