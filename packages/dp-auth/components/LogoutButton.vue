<template>
    <ElButton type="link" @click="logout">{{ $t('login_loginOut') }}</ElButton>
</template>

<script lang="ts" setup>
const {logout} = useUser()
</script>