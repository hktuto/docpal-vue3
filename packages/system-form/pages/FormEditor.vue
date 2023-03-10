<template>
    <div class="container">
        <aside width="200px">
            <el-scrollbar>
                <el-menu :default-active="selectName" @select="handleSelect">
                    <el-menu-item v-for="(item,key) in formJsonList" :key="key" :index="key">{{key}}</el-menu-item>
                </el-menu>
            </el-scrollbar>
        </aside>
        <main ><NuxtPage /></main>
    </div>
</template>


<script lang="ts" setup>
import { formJsonList } from 'dp-api'
const router = useRouter()
const route = useRoute()
const selectName = ref('')
function handleSelect (jsonName) {
    selectName.value = jsonName
    router.push(`/FormEditor/${jsonName}`)
}
onMounted(() => {
    if (formJsonList.length === 0) return
    if (!route.params.id) {
        handleSelect(Object.keys(formJsonList)[0])
    } else {
        selectName.value = route.params.id
    }
})
</script>


<style lang="scss" setup>
.container {
    height: 100%;
    overflow: hidden; 
    display: flex;
    aside {
        height: 100%;
    }   
    main {
        flex: 1;
    }
}

</style>