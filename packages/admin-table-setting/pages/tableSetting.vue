<template>
    <NuxtLayout >
        <el-container>
            <el-aside width="200px">
                <div :class="getClass(key)" v-for="(value,key) in tableColumnSetting"
                    @click="setCurrentKey(key)">{{key}}</div>
                <div :class="getClass('trash')" @click="setCurrentKey('trash')">trash</div>
            </el-aside>
            <el-main><NuxtPage /></el-main>
        </el-container>
    </NuxtLayout>
</template>


<script lang="ts" setup>
const { tableColumnSetting } = toRefs(useSetting())
const router = useRouter();
const route = useRoute();

const currentKey = ref('')
function getClass (key) {
    let css = 'padding'
    if (key === currentKey.value) css+= ' current'
    return css
}
function setCurrentKey (key) {
    if (!key){ 
        if(!tableColumnSetting.value || tableColumnSetting.value.length === 0) return
        key = Object.keys(tableColumnSetting.value)[0]
    }
    currentKey.value = key
    router.push(`/tableSetting/${key}`)
}
onMounted(() => {
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