

<script lang="ts" setup>
import { VirtualFolderItemFile } from "dp-api"
const props = defineProps<{
    isRoot: boolean
}>()

const form = ref<VirtualFolderItemFile>({
    name: '',
    doctype: 'folder',
    isFolder: false,
    children: [],
    showChildren: false,
})
</script>

<template>
    <div class="newFormContainer">
        <div class="title">
            New Item
        </div>
        <el-form>
            <el-form-item>
                <el-input v-model="form.name" placeholder="Virtual folder label" size="large" />
            </el-form-item>
            <el-form-item>
                <el-select v-model="form.doctype">
                    <el-option ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="form.isFolder && form.doctype">
                <el-switch v-model="form.isFolder" active-color="#13ce66" inactive-color="var(--primary-color)" />
            </el-form-item>
        </el-form>
    </div>
</template>

<style lang="scss" scoped>
.newFormContainer{
    padding: var(--app-padding);
    border: 1px solid #eee;
    border-radius: var(--app-padding);
}
</style>