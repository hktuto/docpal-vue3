<template>
  <div class="appThemeBg">
    <div v-if="displayState === 'needAuth'" ref="needAuthEl" class="LoginContainer">
      <AuthLoginForm  />
    </div>
    <div v-else-if="displayState != 'ready'" ref="loadingEl" class="loadingContainer">
      <Logo class="loginLogo"/>
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

const user = useUser();

onMounted(async () => {

  if(sessionStorage) {
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
  max-width: 320px;
}
</style>