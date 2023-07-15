<template>
  <SvgIcon src="/icons/logout.svg" round @click="logout"/>
</template>

<script lang="ts" setup>
const {logout} = useUser()
</script>
