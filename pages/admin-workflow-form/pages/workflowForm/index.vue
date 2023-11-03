<template>
    <NuxtLayout class="fit-height withPadding">
        <div class="workflowCardContainer">
            <template v-for="(item,index) in state._list" :key="index">
                <WorkflowFormCard :data="item"  />
            </template>
        </div>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { GetProcessDefinitionListApi } from 'dp-api'

// #region module: page
    const route = useRoute()
    const router = useRouter()
    const state = reactive<State>({
        loading: false,
        list: [],
        _list: []
    })

    async function getList () {
        state.loading = true
        try {
            const res = await GetProcessDefinitionListApi()
            console.log(res)
            state.list = res
            state._list = deepCopy(state.list)
        } catch (error) {
            console.log(error)
        }
        state.loading = false
    }
// #endregion

function handleDblclick (row) {
}
onMounted(() => {
    getList()
})
</script>

<style lang="scss" scoped>
.workflowCardContainer {
    height: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--app-padding);
    overflow: auto;
}
</style>
