<template>
<el-dialog v-model="state.visible" :title="$t('export')"
    :close-on-click-modal="false"
    class="search-download-dialog"
    >
    <div class="search-download-container">
        <div class="search-download-container-box">
            <h3>{{$t('dragToDisplayList')}}</h3>
            <draggable
                id="first"
                data-source="juju"
                :list="state.exportList"
                class="list-group"
                group="a"
                item-key="id"
            >
                <template #item="{ element }">
                    <div class="list-group-item">
                        {{ element.name }}
                    </div>
                </template>
            </draggable>
        </div>

        <div class="search-download-container-box">
            <h3>{{$t('dragToHideList')}}</h3>
            <draggable :list="state.hideList" class="list-group" group="a" item-key="name">
                <template #item="{ element }">
                    <div class="list-group-item item">
                        {{ element.name }}
                    </div>
                </template>
            </draggable>
        </div>
    </div>
    <template #footer>
        <el-button :loading="state.loading" @click="handleSubmit()">{{$t('export')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import draggable from 'vuedraggable'
import { GetSearchExportHeaderApi, ExportSearchCsvApi} from 'dp-api'
const state = reactive({
    loading: false,
    visible: false,
    exportList: [],
    searchParams: {},
    hideList: [ ]
})
function handleOpen(searchParams) {
    state.visible = true
    state.searchParams = searchParams
}
async function handleSubmit() {
    state.loading = true
    const hideIds = state.hideList.reduce((prev,item) => {
        prev.push(item.id)
        return prev
    }, [])
    const blob = await ExportSearchCsvApi({ ...state.searchParams, hiddenList: hideIds })
    await downloadBlob(blob, 'search.csv')
    state.loading = false
    state.visible = false
}

async function getExportList () {
  const res = await GetSearchExportHeaderApi()
  state.exportList = []
  Object.keys(res).forEach(key => {
    state.exportList.push({ id: key, name: res[key]})
  })
}
onMounted(async() => {
   getExportList()
})
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>
.search-download-container {
    height: 40vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--app-padding);
    &-box {
        display: grid;
        grid-template-rows: 52px 1fr;
        .list-group {
            padding: var(--app-padding);
            border: 1px solid #ddd;
        }
    }
}
</style>
<style lang="scss">
.search-download-dialog {
    .el-dialog__body {
        padding: 0 20px;
    }
}
</style>
