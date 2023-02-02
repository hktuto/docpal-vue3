<template>
  <div class="appThemeBg">
    <div v-if="state === 'needAuth'" class="LoginContainer">
      <AuthLoginForm />
    </div>
    <div v-else-if="state != 'ready'" class="loadingContainer">
      {{state}}
      <!-- <ElButton @click="state = 'ready' ">ready</ElButton> -->
    </div>
    <div v-else class="clientPageContaienr">
      <NuxtLayout>
        <NuxtPage/>
      </NuxtLayout>
    </div>
  </div>
</template>

<script lang="ts" setup>
// check app ready, if no go to login
const { state } = useAppStore()

const user = useUser();

onMounted(async () => {
  const { session, refresh, update, reset } = await useSession()
  console.log(session.value);
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
.clientPageContaienr{
  width: 100%;
  height: 100%;
}
</style>