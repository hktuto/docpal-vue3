<template>
  <div >
    <AuthApp />
  </div>
</template>

<script setup>
const route= useRoute()
if(route.fullPath.includes('office') || route.fullPath.includes('outlook')) {
  
}

</script>

