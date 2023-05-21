<template>
<div class="card">
    <div class="tableTopContainer">
        <h3>{{$t('Inherent')}}</h3>
        <el-button v-if="tableData.length > 0" :loading="state.loading" size="small" type="primary" round @click="blockInherited" >{{$t('Remove Inherent')}}</el-button>
        <el-button v-else size="small" :loading="state.loading" type="primary" round @click="unBlockInherited">{{$t('Inherent')}}</el-button>
    </div>
    <div>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="userId" :label="$t('dpTable_name')"> </el-table-column>
            <el-table-column :label="$t('dpTable_validityPeriod')">
                <template #default="{ row }">
                    {{!row.startDate && !row.endDate ? 'Permanent' : formatDate(row.startDate) + " ~ " + formatDate(row.endDate) }}
                </template>
            </el-table-column>
            <el-table-column v-for="item in ['read', 'write', 'manage', 'print']" :key="item"
                :label="$t(`permission.${item}`)" align="center" header-align="center">
                <template #default="{ row }">
                    <el-icon v-if="row[item]" style="--color: var(--primary-color)"><Select /></el-icon>
                    <el-icon v-else style="--color: #F56C6C"><CloseBold /></el-icon>
                </template>
            </el-table-column>
        </el-table>
    </div>
</div>
</template>
<script lang="ts" setup>
import { Select, CloseBold } from '@element-plus/icons-vue'
import { aclBlockApi, aclUnblockApi } from 'dp-api/src/endpoint/admin-acl'
const props = defineProps<{
    tableData: Array,
    doc: Object
}>()
const emits = defineEmits([
    'refresh'
])
const state = reactive({
    loading: false
})
async function unBlockInherited () {
    state.loading = true
    await aclUnblockApi(props.doc.id)
    state.loading = false
    emits('refresh')
}
async function blockInherited () {
    state.loading = true
    await aclBlockApi(props.doc.id)
    state.loading = false
    emits('refresh')
}
</script>
<style lang="scss" scoped>
.card {
    width: 100%;
    margin: 0 0 var(--app-padding) 0;
    box-shadow: var(--el-box-shadow-light);
    .tableTopContainer {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
</style>
