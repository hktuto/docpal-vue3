<template>
    <div class="appThemeBg">
    <div v-if="appStore.displayState === 'needAuth'" ref="needAuthEl" class="LoginContainer">
      <LazyLoginForm :showForgetPassword="showForgetPassword" />
    </div>
    <div v-if="appStore.displayState === 'forgetPassword'" ref="forgetPassword" class="LoginContainer">
      <LazyForgetPassword  />
    </div>
    <div v-else-if="appStore.displayState != 'ready'" ref="loadingEl" class="loadingContainer">

      <div class="contain">
        <LogoCacheWhite class="loginLogo" />
        <div class="status">{{ appStore.state }}</div>
      </div>
      <!-- <ElButton @click="state = 'ready' ">ready</ElButton> -->
    </div>
    <div v-else ref="readyElement" class="clientPageContainer">
      <NuxtPage />
    </div>
     <LoadingBg v-if="appStore.displayState != 'ready'" />

  </div>
</template>


<script lang="ts" setup>
// check app ready, if no go to login
const appStore  = useAppStore()
import { api } from 'dp-api'
const user = useUser();

const props = withDefaults(defineProps<{
    showForgetPassword: boolean,
}>(), {
  showForgetPassword: true
})

onMounted(async () => {
  await appStore.appInit();
  if(localStorage) {
    api.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    user.token.value = localStorage.getItem('token');
  }
  user.verify();
})

</script>


<style lang="scss" scoped>
.appThemeBg{
  width: 100%;
  height:  100vh;
  overflow: hidden;
}
.loadingContainer, .LoginContainer{
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  padding: var(--el-component-size-small);
}
.loadingContainer{
  .contain{
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 0;
  }
}
.clientPageContainer{
  width: 100%;
  height: 100%;
}
.loginLogo{
  max-width: 280px;
  width: 100%;
}
.status{
  font-size: 1.8rem;
  color: #fff;
  font-weight: 100;
}
</style>
