<template>
    <div class="fromContainer card glass">
        <Logo class="logo" mode="withName"/>
        <ElForm 
            :model="form"
            :rules="rules"
            label-position="top">
            <ElFormItem label="username" :rules="rules.username">
                <ElInput 
                    v-model="form.username" 
                    type="text" />
            </ElFormItem>
            <ElFormItem label="password" :rules="rules.password">
                <ElInput 
                    v-model="form.password"
                    type="password"
                    @keyup.enter.native="submit"
                    show-password/>
            </ElFormItem>
            <ElFormItem >
                <ElButton size="large"  type="primary" @click="submit" :loading="loading">Submit</ElButton>
            </ElFormItem>
        </ElForm>
    </div>
</template>

<script lang="ts" setup>
const userStore = useUser();
const loading = ref(false);
const form = reactive({
      username: '',
      password: '',
    })
const rules = {
      username: [
        { required: true, message: 'Please input Username', trigger: 'blur' },
      ],
      password: [
        { required: true, message: 'Please input Password', trigger: 'blur' },
      ],
    }
async function submit() {
    try {
        loading.value = true;
       const {isRequired2FA} = await userStore.login(form.username, form.password);
        form.username = "";
        from.password = "";
    } catch (error) {
        
    }
}
</script>

<style lang="scss" scoped>
.fromContainer{
    min-width: 300px;
    max-width: 600px;
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;
}
.logo{
    width: 80%;
    max-width: 200px;
    margin: 0 auto var(--el-component-size-small) auto;
}
</style>
