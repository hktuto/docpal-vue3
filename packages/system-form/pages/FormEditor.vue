<template>
    <div class="container" >
        <aside v-if="state.asideShow" width="200px">
            <KeywordFilter :list="state.list" attr="name"
                @filter="handleKeywordFilter"></KeywordFilter>
            <el-scrollbar>
                <TreeMenu :menu="state._list" :options="{defaultActive: state.selectName}" @select="handleSelect"></TreeMenu>
            </el-scrollbar>
        </aside>
        <el-button :class="{'absolute-button': state.asideShow}" @click="state.asideShow = !state.asideShow"> 收 </el-button>
        <main >
            <NuxtPage />
        </main>
    </div>
</template>


<script lang="ts" setup>
import { formJsonList } from 'dp-api'
const router = useRouter()
const route = useRoute()
const state = reactive({
    selectName: '',
    list: [],
    _list: [],
    asideShow: true
})
function handleSelect (name) {
    state.selectName= name
    router.push(`/FormEditor/${name}`)
}
function handleKeywordFilter(data) {
    state._list = data
}
function getList () {
    if (formJsonList.length === 0) return
    state.list = formatTree(formJsonList)
    state._list = state.list
    if (!route.params.id) {
        handleSelect(state.selectName)
    } else {
        state.selectName = route.params.id
    }
}
function formatTree (obj) {
    const result = []
    let _result = []
    Object.keys(formJsonList).forEach((key, _index) => {
        const _keys = key.split('--')
        _result = result
        _keys.forEach((keyItem, keyIndex) => {
            if(keyIndex === _keys.length - 1) {
                if (_index  === 0) state.selectName = key
                _result.push({
                    name: keyItem,
                    index: key
                })
            } else {
                const index = _result.findIndex(item => item.index === keyItem)
                if(index === -1) _result.push({
                    name: keyItem,
                    index: keyItem,
                    children: []
                })
                _result = _result[_result.length - 1].children
            }
        })
    })
    return result
}

onMounted(() => {
    getList()
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
        position: relative;
    }
}
.absolute-button {
    position: absolute;
    top: 45px;
    left: 12px;
    z-index: 1;
}
</style>
