<template>
    <div class="fromContainer card glass">
        <Logo class="logo" mode="withName"/>
    <template v-if="status === 'submitted'">
        <div class="tip">
          {{$t('The operation is successful, please go to the mailbox to reset the password')}}
        </div>
      </template>
      <template v-else>
        <el-form label-position="top" ref="FormRef" size="small" :status-icon="true" :model="form" @submit.native.prevent>
          <template v-if="status === 'beforeSubmit'">
              <el-form-item :label="$t('login_username')" prop="userId" class="intro"
                        :rules="[{ required: true, message: $t('form_common_requird')}]">
                <el-input v-model="form.userId" type="text" @keyup.enter.native="handleSubmit"/>
              </el-form-item>
              <el-button class="fullSize" type="primary" size="large" :block="true" @click="handleSubmit" :loading="loading">
                      {{ $t('confirm') }}
              </el-button>
          </template>
        </el-form>
      </template>
      <el-button class="intro" @click="appStore.state = 'needAuth'" link>
        {{ $t('login') }}
      </el-button>
    </div>
</template>


<script lang="ts" setup>
import { ForgetPasswordApi } from 'dp-api'
const appStore = useAppStore();    
const status = ref('beforeSubmit')
const loading = ref(false)
const form = ref({
    userId: '',
    password: '',
    confirmPassword: ''
})

const FormRef = ref()
// #region module: before submit form
async function handleSubmit () {
    const valid = FormRef.value.validate()
    if(!valid) return

    loading.value = true
    try {
      const res = await ForgetPasswordApi(form.value.userId)
      if (res) status.value = 'submitted'
    } catch (error) {
      
    }
    loading.value = false
}


</script>


<style scoped lang="scss">
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
.tip {
  padding: var(--app-padding);
  font-size: 1.2rem;
  text-align: center;
  color: var(--color-grey-500);
}
</style>