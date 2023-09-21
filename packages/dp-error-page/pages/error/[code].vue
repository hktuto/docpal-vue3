<template>
    <div class="errorPageContainer">
        <LoadingBg></LoadingBg>
        <el-card>
            <div class="logoContainer intro">
                <Logo class="logo" mode="withName"/>
            </div>
            <div class='is-animate style1'>
                <div v-for="item in codes">{{item}}</div>
            </div>
            <div class="flex-x-end">
              <el-button type="primary" text @click="goHome()">{{$t('home')}}</el-button>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
const { beforeLogin } = useUser(); 
const codes = computed(() => {
    if (route.params.code) return route.params.code.split('')
    else return []
})
function goHome() {
  router.push({
    path: '/browse'
  })
  setTimeout(() => {
    beforeLogin(true)
  }, 200)
}
</script>

<style lang="scss" scoped>
.errorPageContainer {
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

.is-animate {
    padding: var(--app-padding);
    display: flex;
    justify-content: center;
    &.style1> div { animation-name: style1; }
    & > div {
        font-size: 2rem;
        background-color: #4cb5d4;
        margin: 5px;
        color: #fff;
        padding: 0px 14px;
        border-radius: 4px;
        box-shadow: 1px 1px 9px -3px #000;
        display: inline-block;
        animation-duration: 2s;
        animation-fill-mode: both;
        animation-iteration-count: infinite;
    }
    & > div:nth-child(1) { animation-delay: 1s }
    & > div:nth-child(2) { animation-delay: 1.3s }
    & > div:nth-child(3) { animation-delay: 1.5s }
    & > div:nth-child(4) { animation-delay: 1.7s }
    & > div:nth-child(5) { animation-delay: 1.9s }
}
@keyframes style1 {
  from, 20%, 53%, 80%, to {
    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    transform: translate3d(0,0.5,0.1);
  }
  40%, 43% {
    animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
    transform: translate3d(0px, -35px, 0);
  }
}
</style>