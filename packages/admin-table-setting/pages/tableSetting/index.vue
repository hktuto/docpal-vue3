<template>
    <NuxtLayout >
        <main>
            <div class="padding" v-for="(value,key) in tableColumnSetting"
                @click="goRoute(key)">{{key}}</div>
            <div class="padding" @click="goRoute('trash')">trash</div>
        </main>
    </NuxtLayout>
</template>


<script lang="ts" setup>
const { tableColumnSetting } = toRefs(useSetting())
const router = useRouter();
function goRoute(id) {
    router.push(`/tableSetting/${id}`)
    console.log(tableColumnSetting);
    
}
</script>

<style lang="scss" scoped>
.padding {
    padding: var(--app-padding)
}
main {
    height: 100%;
    overflow: auto;
}
</style>