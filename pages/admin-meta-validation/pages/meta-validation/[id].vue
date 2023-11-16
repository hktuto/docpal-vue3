<template>
<NuxtLayout class="fit-height withPadding" backPath="/meta-validation">
    <div class="metaSetting-container">
        <div class="meta-setting-info">
            <div class="meta-setting-info-title">
                <div class="meta-setting-info-title-header">{{$t('docType_documentType')}}</div>
                <div class="meta-setting-info-title-main">
                    <BrowseItemIcon class="el-icon--left" :type="state.docType.isFolder ? 'folder' : 'file'"/>
                    {{state.docType.name}}
                </div>
            </div>
            <LanguageUnitForm ref="LanguageUnitFormRef" :lKey="state.docType.name"/>
            <el-button :loading="state.lanLoading" type="primary" @click="handleSave">{{$t('common_save')}}</el-button>
        </div>
        <el-tabs v-model="state.activeTabName" class="demo-tabs">
            <el-tab-pane :label="$t('docType_displayMeta')" name="metadata">
                <MetaValidationDisplayMetaTable :docType="state.docType"></MetaValidationDisplayMetaTable>
            </el-tab-pane>
            <el-tab-pane :label="$t('docType_relatedDocument')" name="related">
                <MetaValidationRelatedTypeTable :docType="state.docType"></MetaValidationRelatedTypeTable>
            </el-tab-pane>
        </el-tabs>
        <!-- <MetaInfo :docType="state.docType"></MetaInfo> -->
    </div>
</NuxtLayout>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { getDocTypeDetailApi } from 'dp-api'
const route = useRoute()
const state = reactive({
    docType: {},
    lanLoading: false,
    activeTabName: 'metadata'
})
const LanguageUnitFormRef = ref()
async function handleSave () {
    state.lanLoading = true
    await LanguageUnitFormRef.value.handleSubmit()
    state.lanLoading = false
}
onMounted(async() => {
    state.docType = await getDocTypeDetailApi(route.params.id)
})
</script>

<style lang="scss" scoped>
.metaSetting-container {
    display: grid;
    grid-template-rows: min-content 1fr;
    gap: var(--app-padding);
    height: 100%;
    overflow: hidden;
}
.meta-setting-info {
    display: grid;
    grid-template-columns: min-content 1fr min-content;
    gap: calc(var(--app-padding) * 2);
    align-items: end;
    margin-bottom: var(--app-padding);
    &-title {
        display: grid;
        grid-template-rows: min-content min-content;
        justify-content: space-between;
        &-header {
            text-wrap: nowrap;
            line-height: 22px;
            margin-bottom: 8px;
        }
        &-main {
            display: flex;
            line-height: 34px;
            align-items: center;
        }
    }
}
.el-tabs {
    display: grid;
    grid-template-rows: min-content 1fr;
    .el-tab-pane {
        height: 100%;
    }
}
</style>