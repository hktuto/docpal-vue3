<template>
    <div class="appThemeBg">
    <!-- <div v-if="appStore.displayState === 'needAuth'" ref="needAuthEl" class="LoginContainer">
      <LazyLoginForm :showForgetPassword="showForgetPassword" />
    </div> -->
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
      <component v-for="s in globalSlots" :key="s.name" :is="s.component" v-bind="$props" />
    </div>
     <LoadingBg v-if="appStore.displayState != 'ready'" />

  </div>
</template>


<script lang="ts" setup>
// check app ready, if no go to login
const appStore  = useAppStore()
import { api } from 'dp-api'
const route = useRoute()
const router = useRouter()
const {token, verify, errorPages} = useUser();

const { globalSlots } = useLayout()
const { uploadState } = useUploadStore()
const props = withDefaults(defineProps<{
    showForgetPassword: boolean,
}>(), {
  showForgetPassword: true
})

onMounted(async () => {
  window.addEventListener('beforeunload', function (e) {
    if(uploadState.value.uploadRequestList.length > 0) {
      // Cancel the event
      // Chrome requires returnValue to be set
      e.preventDefault();
      e.returnValue = $i18n.t('tip.beforeunload');
    }
  });
  if (errorPages.includes(route.path)) {
    // appStore.state = 'ready'
    router.push('/')
    // return
  }
  await appStore.appInit();
  verify();
})
watch(() => appStore.displayState, (newValue) => {
  if(newValue === 'needAuth') {
    window.location.reload()
  }
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
