<template>
    <div class="tableContainer">
        <ElTable v-loading="pending" :data="data" style="width:100%" @cell-dblclick="dbClickHandler">
            <ElTableColumn :label="$t('tableHeader_name')" >
                 <template #default="scope">
                     <div class="nameContainer">
                         <BrowseItemIcon :type="scope.row.isFolder ? 'folder' : 'file'"/>
                        <div class="label">{{scope.row.name}}</div>
                     </div>
                 </template>
            </ElTableColumn>
            <ElTableColumn prop="type" label="type" />
        </ElTable>

    </div>
</template>

<script lang="ts" setup>
import { GetChild } from 'dp-api'
// setup
const router = useRouter();

const props = defineProps<{
    path:string,
    doc:Object
}>()
const {doc} = toRefs(props)
const emits = defineEmits(['selectedChanged'])
const { data, refresh, pending } = useAsyncData(() => GetChild(props.doc.path));

function dbClickHandler(row) {
    router.push({
        path:'/browse',
        query:{
            path: row.path
        }
    })
}

watch(doc, (d:any) => {
    if(d && d.isFolder) {
        refresh()
    }
}, {
    immediate: true
})

</script>

<style lang="scss" scoped>
.nameContainer{
    display: flex;
    flex-flow: row nowrap;
    gap: var(--app-padding);
}
</style>