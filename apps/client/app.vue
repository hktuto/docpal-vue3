<template>
  <div >
    <AuthApp />
  </div>
</template>

<script setup>
const route= useRoute()
if(route.fullPath.includes('office') || route.fullPath.includes('outlook')) {
  useHead({
    script:[
      {
        src:"https://appsforoffice.microsoft.com/lib/1/hosted/office.js",
      }
    ]
  })
}

</script>

