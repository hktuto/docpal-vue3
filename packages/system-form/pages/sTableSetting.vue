<template>
        <el-container>
            <el-aside width="200px">
                <div :class="getClass(key)" v-for="(value,key) in tableSettings"
                    @click="setCurrentKey(key)">{{key}}</div>
                <!-- <div :class="getClass('trash')" @click="setCurrentKey('trash')">trash</div> -->
            </el-aside>
            <el-main><NuxtPage /></el-main>
        </el-container>
</template>


<script lang="ts" setup>
import { tableSettingJson } from 'dp-api'

const router = useRouter();
const route = useRoute();
const state = reactive({
    tableSettings: {},
    currentKey: '',
})
const { tableSettings, currentKey } = toRefs(state)
function getClass (key) {
    let css = 'padding'
    if (key === state.currentKey) css+= ' current'
    return css
}
function setCurrentKey (key) {
    if (!key){ 
        key = Object.keys(state.tableSettings)[0]
    }
    state.currentKey = key
    router.push(`/sTableSetting/${key}`)
}
onMounted(() => {
    state.tableSettings = deepCopy(tableSettingJson)
    setCurrentKey(route.params?.id)
})
</script>

<style lang="scss" scoped>
.el-container {
    overflow: hidden;
    height: 99%;
}
.padding {
    padding: var(--app-padding)
}
.current {
    background-color: var(--menu-selected-color);
    color: var(--color-grey-050);
}
main {
    height: 100%;
    overflow: auto;
}
</style>