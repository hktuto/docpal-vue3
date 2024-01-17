<template>
    <div class="page"></div>
</template>

<script lang="ts" setup>

const router = useRouter();

onMounted(() => {
  const { public: {DEFAULT_PATH} } = useRuntimeConfig()
  router.push({
    path: DEFAULT_PATH as string || '/acl'
  })
})

</script>