<template>
    <NuxtLayout class="fit-height withPadding">
      <div class="pageContainer">

        <Table v-loading="loading" :columns="tableSetting.columns" :table-data="tableData"
                @row-dblclick="handleDblclick">
            <template #configuredLevel="{ row }">
                <el-select v-model="row.configuredLevel" filterable default-first-option
                        :disabled="row.loading"
                        @change="(value) => handleLevelChange(value, row)">
                    <el-option v-for="level in row.levels" :key="level" :value="level" :label="$t(level)" ></el-option>
                </el-select>
                <el-button type="text" :loading="row.loading" ></el-button>
            </template>
        </Table>
      </div>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from 'element-plus'
import { RefreshLeft, Delete } from '@element-plus/icons-vue'
import { TABLE, defaultTableSetting } from 'dp-api'
import { getLoggersApi, setLoggersApi } from 'dp-api/src/endpoint/admin-log'
const { t } = useI18n();
// #region module: page
    const route = useRoute()
    const router = useRouter()
    const pageParams = {
        pageIndex: 0,
        pageSize: 20
    }
    const state = reactive<State>({
        loading: false,
        tableData: []
    })
    const tableKey = TABLE.ADMIN_LOG_MANAGE
    const tableSetting = defaultTableSetting[tableKey]

    async function getList () {
        state.loading = true
        try {
            state.tableData = await getLoggersApi()
        } catch (error) {

        }
        state.loading = false
    }

    const { tableData, loading } = toRefs(state)
// #endregion
const shareInfoDialogRef = ref()
async function handleLevelChange (level, row) {
    row.loading = true
    try {
        await setLoggersApi({
            service: row.service,
            level
        })
        await getList()
    } catch (error) {

    }
    row.loading = false
}
function handleDblclick (row) {
    shareInfoDialogRef.value.handleOpen(row)
}
async function handleSubmit (shareInfo) {
}
onMounted(async() => {
    getList()
})
</script>

<style lang="scss" scoped>
.pageContainer{
  padding: calc( var(--app-padding) * 2);
  height: 100%;
  position: relative;
}
</style>
