

<script lang="ts" setup>
import {DocItem, FolderItem, VirtualFolderItemType} from "dp-api"
const props = defineProps<{
    isRoot: boolean
}>()

const newItemTypeOption = ref<VirtualFolderItemType[]>(['doc', 'folder'])
const itemType = ref<VirtualFolderItemType>()

const docForm = ref<DocItem>({
    type: "doc",
    name: "",
    docType: "",
    parentMeta:"",
    includeChildren: false,
    isFolder: false,
})

const folderForm = ref<FolderItem>({
    type: "folder",
    name: "",
    labelTemplate: "",
    isFolder: false,
    children: []
})


</script>

<template>
    <div class="newFormContainer">
        <div class="title">
            New Item
        </div>
        <el-select v-model="itemType">
          <el-option v-for="item in newItemTypeOption" :key="item" :label="item" :value="item" />
        </el-select>
        <template v-if="itemType === 'doc'">
            <VirtualFolderAdminFormItemDoc v-model="docForm">
              
            </VirtualFolderAdminFormItemDoc>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.newFormContainer{
    padding: var(--app-padding);
    border: 1px solid #eee;
    border-radius: var(--app-padding);
}
</style>