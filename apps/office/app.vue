<template>
  <AuthApp :showForgetPassword="false"/>
</template>
<script setup lang="ts">
useHead({
  script:[
    {
      src:"https://appsforoffice.microsoft.com/lib/1/hosted/office.js"
    }
  ]
})
</script>