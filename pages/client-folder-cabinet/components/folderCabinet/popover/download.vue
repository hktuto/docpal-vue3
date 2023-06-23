<template>
<el-dialog v-model="state.visible" :title="$t('export')"
    :close-on-click-modal="false"
           append-to-body
    class="workflow-download-dialog"
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
        <el-button :disabled="state.exportList.length === 0" :loading="state.loading" @click="handleSubmit()">{{$t('export')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import draggable from 'vuedraggable'
import { 
  GetTasksUserExportHeaderApi,
  GetProcessHistoryExportHeaderApi,
  exportProcessHistoryApi,
  exportTasksUserApi} from 'dp-api'
const route = useRoute()
const state = reactive({
    loading: false,
    visible: false,
    exportList: [],
    extraParams: {},
    hideList: [ ],
    activeTab: ''
})
function handleOpen(extraParams) {
    state.visible = true
    state.extraParams = extraParams
    state.activeTab = route.query.tab
    getExportList()
}
async function handleSubmit() {
    state.loading = true
    try {
      const orderList = state.exportList.reduce((prev,item) => {
          prev.push(item.id)
          return prev
      }, [])
      let blob
      if(state.activeTab === 'completeTask') blob = await exportProcessHistoryApi({ ...state.extraParams, orderList })
      else blob = await exportTasksUserApi({ ...state.extraParams, orderList })
      await downloadBlob(blob, 'workflow.csv')
      state.visible = false
    } catch (error) {
    }
    state.loading = false
}

async function getExportList () {
  let res
  if (state.activeTab === 'completeTask') res = await GetProcessHistoryExportHeaderApi()
  else res = await GetTasksUserExportHeaderApi(state.extraParams)
  state.exportList = []
  state.hideList = []
  Object.keys(res).forEach(key => {
    state.exportList.push({ id: key, name: res[key]})
  })
}
onMounted(async() => {
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
            border: 1px solid var(--color-grey-050);
            background: var(--color-grey-050);

          .item{
            color: var(--color-grey-600);
            &.sortable-chosen{
              background: var(--color-grey-600);
              color: var(--color-grey-0000) !important;
            }
          }
        }
        #first {
          background: var(--color-grey-0000);
          .list-group-item{
            font-weight: 500;
            color: var(--primary-color);
            &.sortable-chosen{
              background: var(--primary-color);
              color: var(--color-grey-0000) !important;
            }
          }

        }


    }
    .sortable-chosen {

      padding: calc(var(--app-padding) / 4 );
    }
}

</style>
<style lang="scss">
.workflow-download-dialog {
    .el-dialog__body {
        padding: 0 20px;
    }
}
.el-dialog__title{
  text-transform: capitalize;
}
</style>
