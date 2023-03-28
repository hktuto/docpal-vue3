<template>
    <LoadingBg />
    <el-card class="formContainer">
        <div class="flex-x-start">
            <Logo class="logo" mode="withName" />
        </div>
        <FromRenderer ref="FromRendererRef" :form-json="formJson" />
        <div class="footer">
            <el-button @click="handleSubmit">{{$t('submit')}}</el-button>
        </div>
    </el-card>
</template>
<script lang="ts" setup>
import { getJsonApi } from 'dp-api'
const emits = defineEmits(['submit'])
const formJson = getJsonApi('publicSharePassword.json')
const FromRendererRef = ref()
async function handleSubmit () {
    const formData = await FromRendererRef.value.vFormRenderRef.getFormData().then(res => {
        return res
    }).catch(error => {
        return false
    })
    emits('submit', deepCopy(formData))
}
</script>

<style lang="scss" scoped>
.el-card {
    // position: fixed;
    min-width: 300px;
    max-width: 600px;
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;

    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}
.logo{
    width: 80%;
    max-width: 200px;
    margin: 0 auto var(--el-component-size-small) auto;
}
.footer {
    text-align: right;
}
</style>