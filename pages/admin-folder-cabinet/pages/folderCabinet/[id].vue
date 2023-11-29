<template>
    <NuxtLayout class="fit-height withPadding" backPath="/folderCabinet">
        <FolderCabinetCard v-loading="state.loading" class="FolderCabinetCard" :setting="state.setting" :isRoot="true" ></FolderCabinetCard>
        <FolderCabinetAddChildDialog ref="FolderCabinetAddChildDialogRef" @update="getData" />
        <FolderCabinetAddDialog ref="FolderCabinetAddDialogRef" @update="getData" />
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { Loading } from '@element-plus/icons-vue';
import { ElNotification, ElMessageBox } from 'element-plus'
import { GetCabinetTemplateApi, DeleteCabinetTemplateApi, exportTasksUserApi } from 'dp-api'
const state = reactive({
    loading: false,
    setting: {}
})
const FolderCabinetAddChildDialogRef = ref()
const route = useRoute()
// await FromRendererRef.value.vFormRenderRef.setFormData(searchParams)
// #region module: actions
    function handleAddChild(data, isFolder) {
        FolderCabinetAddChildDialogRef.value.handleOpen(data, data.children, isFolder)
    }
    function handleDeleteChild(setting){
        ElMessageBox.confirm(`${$i18n.t('msg_confirmWhetherToDelete')}`)
        .then(async() => {
            const noti = ElNotification({
                title: $i18n.t('delete'),
                icon: Loading,
                dangerouslyUseHTMLString: true,
                message: `<div title="${setting.label}">${setting.label}</div>`,
                showClose: true,
                customClass: 'loading-notification',
                duration: 0,
                position: 'bottom-right'
            });
            const response = await DeleteCabinetTemplateApi(setting.id)
            await getData()
            noti.close()
            ElNotification({
                title: 'Success',
                message: 'Item deleted',
                type: 'success',
                duration: 2000
            });
        })
    }
    const FolderCabinetAddDialogRef = ref()
    function handleEdit (setting:any, isRoot: boolean = false, parentSettingChildren) {
        const _setting = deepCopy(setting)
        _setting.isEdit = true
        if(!!isRoot) {
            FolderCabinetAddDialogRef.value.handleOpen(_setting)
        } else {
            FolderCabinetAddChildDialogRef.value.handleOpen(_setting, parentSettingChildren, _setting.folder)
        }
    }
    provide('handleEdit', handleEdit)
    provide('handleAddChild', handleAddChild)
    provide('handleDeleteChild', handleDeleteChild)
// #endregion
async function getData () {
    state.loading = true
    try {
        state.setting = await GetCabinetTemplateApi(route.params.id)
    } catch (error) {
    }
    state.loading = false
}
onMounted(() => {
    getData()
})
</script>

<style lang="scss" scoped>
.pageContainer{
    height: 100%;
    overflow: auto;
  padding: calc( var(--app-padding) * 2);
}
.FolderCabinetCard {
    height: 100%;
    background-color: #f1f1f1;
    overflow: auto;
}
</style>
