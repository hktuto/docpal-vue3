<template>
  <div class="appThemeBg">
    <div v-if="displayState === 'needAuth'" ref="needAuthEl" class="LoginContainer">
      <AuthLoginForm  />
    </div>
    <div v-else-if="displayState != 'ready'" ref="loadingEl" class="loadingContainer">
      <Logo  class="loginLogo"/>
      <!-- <ElButton @click="state = 'ready' ">ready</ElButton> -->
    </div>
    <div v-else ref="readyElement" class="clientPageContainer">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>


<script lang="ts" setup>
// check app ready, if no go to login
const { state, needAuthEl, loadingEl, readyElement, displayState } = useAppStore()

const user = useUser();

onMounted(async () => {
  const { session, refresh, update, reset } = await useSession()
  if(session.value.access_token) {
    user.token.value = session.value.access_token;
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