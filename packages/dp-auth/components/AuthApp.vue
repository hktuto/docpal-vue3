<template>
    <div class="appThemeBg">
    <div v-if="displayState === 'needAuth'" ref="needAuthEl" class="LoginContainer">
      <LoginForm  />
    </div>
    <div v-else-if="displayState != 'ready'" ref="loadingEl" class="loadingContainer">
      <div class="contain">
        <Logo class="loginLogo"/>
      </div>
      <!-- <ElButton @click="state = 'ready' ">ready</ElButton> -->
    </div>
    <div v-else ref="readyElement" class="clientPageContainer">
      <NuxtPage />
    </div>
  </div>
</template>


<script lang="ts" setup>
// check app ready, if no go to login
const { state, needAuthEl, loadingEl, readyElement, displayState } = useAppStore()
import { api } from 'dp-api'
const user = useUser();

onMounted(async () => {

  if(sessionStorage) {
    api.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token');
    user.token.value = sessionStorage.getItem('token');
  }
  user.verify();
})

</script>


<style scoped>
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
.clientPageContainer{
  width: 100%;
  height: 100%;
}
.loginLogo{
  max-width: 280px;
  width: 100%;
}
</style>