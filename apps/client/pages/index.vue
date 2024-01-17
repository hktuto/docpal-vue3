<template>
    <div class="page">
        
    </div>
</template>

<script lang="ts" setup>
const router = useRouter()
const route = useRoute()
const { publicPages } = useUser()
onMounted(() => {
    nextTick(() => {
        if(!!publicPages.find(item => route.path.includes(item))) {
            appStore.setDisplayState('ready') 
        } else {
            const { public: {DEFAULT_PATH} } = useRuntimeConfig()
            router.push({
                path: DEFAULT_PATH as string || '/browse'
            })
        }
    })
})

</script>