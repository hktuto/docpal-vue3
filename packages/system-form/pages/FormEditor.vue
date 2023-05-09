<template>
    <div class="container">
        <aside width="200px">
            <KeywordFilter :list="state.list" attr="name"
                @filter="handleKeywordFilter"></KeywordFilter>
            <el-scrollbar>
                <el-menu :default-active="state.selectName" @select="handleSelect">
                    <el-menu-item v-for="(item,index) in state._list" :key="item.name" :index="item.name">{{item.name}}</el-menu-item>
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
const state = reactive({
    selectName: '',
    list: [],
    _list: []
})
function handleSelect (name) {
    state.selectName= name
    router.push(`/FormEditor/${name}`)
}
function handleKeywordFilter(data) {
    state._list = data
}
onMounted(() => {
    if (formJsonList.length === 0) return
    state.list = Object.keys(formJsonList).map(key => ({ name: key}))
    state._list = state.list
    if (!route.params.id) {
        handleSelect(state.list[0].name)
    } else {
        state.selectName= route.params.id
    }
})
</script>


<style lang="scss" setup>
.container {
    height: 100vh;
    overflow: hidden; 
    display: flex;
    aside {
        height: 100%;
        display: grid;
        grid-template-rows: min-content 1fr;
        gap: var(--app-padding);
        margin: var(--app-padding);
    }   
    .el-scrollbar {
    }
    main {
        flex: 1;
        height: 100%;
        overflow: hidden;
    }
}

</style>