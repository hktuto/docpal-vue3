<template>
    <NuxtLayout class="fit-height withPadding">
      <template v-if="!state.loading && state.list.length === 0">
        <FolderCabinetEmpty @update="getList" />
      </template>
    <template v-else>
        <main>
            <div class=" flex-x-end">
                <el-button data-testid="folderCabinetConfig-new-button" @click="handleAdd">{{$t('folderCabinet.add')}}</el-button>
            </div>
            <div >
                <Table v-loading="loading" :columns="tableSetting.columns" :table-data="state.list" :options="options"
                    @row-dblclick="handleDblclick"
                    @command="handleAction">
                </Table>
            <!-- <WatermarkList :list="list" :selected-id="$route.query.id" @update="getList" @remove="deleteItem"/> -->
            <!-- <WatermarkDetail v-if="detail" :detail="detail" @update="getDetail(detail.id)"/> -->
            </div>
        </main>
        <FolderCabinetAddDialog ref="FolderCabinetAddDialogRef" @update="getList" />
      </template>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import {
    GetCabinetListApi,
    DeleteCabinetTemplateApi,
    defaultTableSetting, TABLE
} from 'dp-api'
const route = useRoute();
const router = useRouter()
const state = reactive({
    list: [],
    loading: false
})
const tableKey = TABLE.ADMIN_FOLDER_CABINET
const tableSetting = defaultTableSetting[tableKey]
async function getList(dummy: boolean = false) {
    state.loading = true
    try {
        state.list = await GetCabinetListApi()
    } catch (error) {
        state.list = []
    }
    state.loading = false
}

const FolderCabinetAddDialogRef = ref()
function handleAdd () {
    FolderCabinetAddDialogRef.value.handleOpen()
}
function handleAction (command, row: any, index: number) {
    switch (command) {
        case 'delete':
            deleteItem(row.id)
            break
        default:
            break
    }
}
async function deleteItem(id: string) {
  await DeleteCabinetTemplateApi(id)
  await getList();
}
function handleDblclick(row) {
    router.push(`/folderCabinet/${row.id}`)
}
onMounted(async() => {
    await getList();
})
</script>

<style lang="scss" scoped>
.pageContainer{
  height: 100%;
  overflow: auto;
  padding: calc( var(--app-padding) * 2);
}
main {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: min-content 1fr;
    gap: var(--app-padding);
}
</style>
