<template>
    <div class="tableContainer">
        <ElTable v-loading="pending" :data="data" style="width:100%" @cell-dblclick="dbClickHandler">
            <ElTableColumn  :label="$t('tableHeader_name')" >
                <template #default="scope">
                    <div class="nameContainer">
                        <browse-item-icon :icon="scope.row.isFolder ? 'folder' : 'file'"  />
                        <span > {{scope.row.name }}</span>
                    </div>
                </template>
            </ElTableColumn>
            <ElTableColumn prop="type" :label="$t('tableHeader_type')" />
        </ElTable>

    </div>
</template>

<script lang="ts" setup>
// setup
const router = useRouter();

const props = defineProps<{
    path:string
}>()
const emits = defineEmits(['selectedChanged'])
const { data, refresh, pending } = useAsyncData(() => getChild(props.path));

function dbClickHandler(row) {
    router.push({
        path:'/browse',
        query:{
            path: row.path
        }
    })
}

watch(props, () => refresh())

</script>

<style lang="scss">

.nameContainer{
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    gap: var(--el-component-size-small);
}
</style>