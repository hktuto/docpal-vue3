<template>
    <div class="OAuthContainer">
        <LoadingBg></LoadingBg>
        <el-card v-loading="state.loading">
            <div class="logoContainer intro">
                <Logo class="logo" mode="withName"/>
            </div>
            <h1 v-if="state.accessToken === 'error'">{{$t('Fail')}}</h1>
            <h1 v-else-if="state.accessToken">{{$t('Success')}}</h1>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { SaveMailConfigCodeApi } from 'dp-api'
const state = reactive({
    loading: false,
    accessToken: ''
})
const route = useRoute()
async function handleSave () {
    state.loading = true
    try {
        const qData = route.query
        const res = await SaveMailConfigCodeApi(qData)
        if(res && res.access_token) {
            state.accessToken = res.access_token
        } else {
            throw new Error("error");
        }
    } catch (error) {
        state.accessToken = 'error'
    }
    state.loading = false
}
onMounted(() => {
    handleSave()
})
</script>

<style lang="scss" scoped>
.OAuthContainer {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  .el-card {
    width: 40%;
    height: fit-content;
  }
  h1 {
    padding: 50px;
    text-align: center;
  }
  .logoContainer {
    width: max(120px, 20%);
  }
}
</style>