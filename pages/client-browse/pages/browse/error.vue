<template>
    <NuxtLayout class="fit-height withPadding">
        <template #headerLeft>{{$t('file_browse')}}</template>
        <div>
            <h3>    
                <template v-if="state.code === '601'">
                    {{$t('Document not found, please make sure the idOrPath is correct')}}
                </template>
                <template v-else-if="state.code === '605'">
                    {{$t('Please confirm that you have permission for this document:en-US')}}
                </template>
            </h3>
            <div>
                <el-button @click="goRoute()">{{$t('back to the root level')}}</el-button>
                <el-button v-if="state.code === '601' && state.splitPaths.length > 2" @click="goRoute(false)">{{$t('back to the previous level')}}</el-button>
                <span class="el-icon--right">{{$t('automatic back to the root level')}}: </span>
                <el-tag @click="stop"> {{state.second}}s ...</el-tag>
            </div>
        </div>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { GetBreadcrumb } from 'dp-api'
const route = useRoute()
const router = useRouter()
const state = reactive({
    code: route.query.code,
    path: route.query.path,
    second: 5,
    splitPaths: [],
    intervale: null
})
function stop() {
    clearInterval(state.interval)
}
function goRoute (isRoot: boolean = true) {
    let fullPath = '/browse'
    if (!isRoot) {
        if(state.splitPaths.length > 2) {
            state.splitPaths.pop()
            fullPath = '/browse?path=' + state.splitPaths.join('/')
        }
    }
    router.push(fullPath)
}
onMounted(() => {
    state.splitPaths = state.path.split('/')
    state.interval = setInterval(() => {
        if(state.second === 0) {
            clearInterval(state.interval)
            goRoute()
            return
        }
        state.second --
    }, 1000)
})
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
</style>
