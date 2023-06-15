<template>
    <NuxtLayout class="fit-height withPadding" backPath="upper">
        <main class="upload-main" v-loading="state.loading">
            <div>
                <div v-for="item in state.fileList" @click="handleSelect(item)">{{item}}</div>
            </div>
    
            <div class="div4 flex-x-end">
                <div>
                    <el-button @click="handleDiscard">{{$t('discard')}}</el-button>
                    <el-button @click="handleSubmit">{{$t('confirm')}}</el-button>
                </div>
            </div>
        </main>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { ElMessage, ElNotification } from 'element-plus'
import { } from 'dp-api';
const { getUploadFiles } = useUploadStore()
const route = useRoute()
const router = useRouter()

const state = reactive({
    loading: false,
    fileList: []
})
function handleSelect (row) {
    console.log(row.file);
}
onMounted(async() => {
    state.fileList = getUploadFiles()
})
</script>

<style lang="scss" scoped>
.upload-main {
    height: 99%;
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    grid-template-rows: min-content 1fr min-content;
    gap: var(--app-padding);
    .div1 { grid-area: 1 / 1 / 2 / 2; }
    .div2 { grid-area: 1 / 2 / 3 / 3; }
    .div3 { grid-area: 2 / 1 / 3 / 2; }
    .div4 { grid-area: 3 / 1 / 4 / 3; }
    .div1,.div2,.div3,.div4 {
        overflow: hidden;
    }
}
</style>
