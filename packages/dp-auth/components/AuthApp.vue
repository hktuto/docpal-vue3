<template>
    <div class="appThemeBg">
    <div v-if="appStore.displayState === 'defaultLogin'" ref="needAuthEl" class="LoginContainer">
      <LazyLoginForm :showForgetPassword="showForgetPassword" />
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
const { public: { endPoint } } = useRuntimeConfig();
const route = useRoute()
const router = useRouter()
const {token, verify, keycloakLogin, errorPages, publicPages} = useUser();

const { globalSlots } = useLayout()
const { uploadState } = useUploadStore()
const props = withDefaults(defineProps<{
    showForgetPassword: boolean,
}>(), {
  showForgetPassword: true
})
function handleAuth() {
  const superAdmin = route.query.
  
  if(publicPages.includes(route.path)) {
    appStore.setDisplayState('ready') 
  }
  else if(superAdmin === 'superAdmin' && endPoint === 'admin') {
    appStore.setDisplayState('defaultLogin') 
    sessionStorage.setItem('superAdmin', superAdmin)
    verify()
  } else {
    sessionStorage.removeItem('superAdmin')
    // keycloakLogin();
  }
}
onMounted(async () => {
  window.addEventListener('beforeunload', function (e) {
    if(uploadState.value.uploadRequestList.length > 0) {
      e.preventDefault();
      e.returnValue = $i18n.t('tip.beforeunload');
    }
  });
  console.log(publicPages.includes(route.path), route.path)
  
  if (errorPages.includes(route.path)) {
    router.push('/')
  }
  await appStore.appInit();
  handleAuth()
  
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
