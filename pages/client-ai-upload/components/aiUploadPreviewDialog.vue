<template>
    <el-dialog v-model="state.visible" :title="$t('ai.uploadText')">
        <el-tree ref="treeRef" :data="state.fileList"
                default-expand-all
                nodeKey="id" :expand-on-click-node="false">
            <template #default="{ node, data }">
                <div class="flex-x-between tree-item">
                    <span class="flex-x-start">
                        <BrowseItemIcon class="el-icon--left" :type="data.isFolder ? 'folder' : 'file'" />
                        {{data.name}}
                    </span>
                </div>
            </template>
        </el-tree>
    </el-dialog>
</template>
<script lang="ts" setup>
import { } from '@element-plus/icons-vue'
import { UploadAIDetailApi } from 'dp-api'
const emits = defineEmits([
    'refresh'
])
const { arrayToTree } = useUploadAIStore()
const state = reactive({
    loading: false,
    visible: false,
    fileList: []
})
const treeRef = ref()
const userId:string = useUser().getUserId()
function handleOpen(row) {
    state.visible = true
    init(row.uploadId)
}
async function init(id) {
    let docList = await UploadAIDetailApi(userId, id)
    docList = docList.map(item => ({
        ...item,
        isFolder: item.fileType === 'Folder'
    }))
    state.fileList = arrayToTree(docList)
}
onMounted(async() => {
})
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
    