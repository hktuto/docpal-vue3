<template>
    <div>
        <div>{{$t('upload')}}</div>
        <el-timeline>
             <el-timeline-item v-for="item in uploadState.uploadRequestList" :key="item.id"
                :timestamp="formatDate(item.startDate)" placement="top">
                <el-button v-show="item.count === item.docList.length" @click="exportCsv(item.docList)">{{$t('exportCsv')}}</el-button>
                <el-tree ref="treeRef" :data="item.tree"
                    nodeKey="id" :expand-on-click-node="false">
                    <template #default="{ node, data }">
                        <div class="flex-x-between tree-item">
                            <span class="flex-x-start">
                                <BrowseItemIcon class="el-icon--left" :type="data.isFolder ? 'folder' : 'file'" />
                                {{data.name}}
                            </span>
                            <div>
                                <el-button :type="getType(data.status)" text
                                    :loading="data.status === 'loading'">
                                    {{ data.status === 'loading' ? '' : data.status || 'pending' }}
                                </el-button>
                            </div>
                        </div>
                    </template>
                </el-tree>
             </el-timeline-item>
        </el-timeline>
        
    </div>
</template>

<script lang="ts" setup>
import * as XLSX from 'xlsx'
import { useEventListener } from '@vueuse/core'
import { storeToRefs } from 'pinia'
const props = defineProps<{
    drawerOpen: boolean
}>();
const { uploadState }  = useUploadStore()
function getType(status) {
    switch(status){
        case 'finish':
            return 'success'
        case 'skip':
            return 'info'
        case 'fail':
            return 'danger'
        default:
            return 'primary'
    }
}
function fileSizeFilter (bytes) {
    if (!bytes) return ''
    bytes = Number(bytes)
    const units = ["B", "KB", "MB", "GB", "TB"]
    let unit = ''
    for (let i = 1; bytes / 1024 >= 1; i++) {
        unit = units[i]
        bytes = bytes / 1024
    }
    return bytes.toFixed(2) + unit
}
function exportCsv(arr) {
    const exportArr = arr.map((item) => ({
        name: item.name,
        status: item.status,
        size: fileSizeFilter(item.file?.size || ''),
        path: item.parentId,
        isFolder: item.isFolder ? 'true' : 'false'
    }))
    jsonToXlsx(exportArr)
}
function jsonToXlsx (exportArr) {
    // 自定义下载的header，注意是数组中的数组哦
    const header = {
        name: 'File Name',
        status: 'File Upload Status',
        size: 'File Size',
        path: 'File Path',
        isFolder: 'Is Folder'
    };
    exportArr.unshift(header)
    
    // 将JS数据数组转换为工作表。
    const ws = XLSX.utils.json_to_sheet(exportArr, {
        header: ['name', 'status', 'size', 'path', 'isFolder'],
        skipHeader: true, 
        origin: 'A1'
    });
    /* 新建空的工作表 */
    const wb = XLSX.utils.book_new();
    // 可以自定义下载之后的sheetname
    XLSX.utils.book_append_sheet(wb, ws, 'sheetName');

    /* 生成xlsx文件 */
    XLSX.writeFile(wb, 'upload status.csv');
}
</script>

<style lang="scss" scoped>
.tree-item {
    width: 100%;
    padding-right: var(--app-padding);
}
</style>
