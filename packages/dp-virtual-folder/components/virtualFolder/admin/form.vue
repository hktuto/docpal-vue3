

<template>
    <div class="formContainer">
        <div class="header">
                <div class="itemLabel">
                    <el-input v-model="detail.name" placeholder="Virtual folder label" size="large" />
                </div>
                <div class="actionsContainer">
                    <el-button type="primary"  @click="save">save</el-button>
                </div>
            </div>
        <virtual-folder-form-item v-if="detail?.setting" :detail="detail?.setting" />
        <div v-else class="firstLevelCreator">
            <virtual-folder-admin-new-item :isRoot="true" />
        </div>
    </div>

</template>


<script lang="ts" setup>
import { VirtualFolderDetail } from "dp-api"
const props = defineProps<{
    isNew: boolean
    detail?: VirtualFolderDetail
}>()


async function save(){

}
</script>
<style lang="scss" scoped>
.header{
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--color-grey-200);
    padding-block: var(--app-padding);
}
</style>