<template>
    <div class="tableContainer">
        <ElTable v-loading="pending" :data="data" style="width:100%" @cell-dblclick="dbClickHandler">
            <ElTableColumn prop="name" label="name" />
            <ElTableColumn prop="type" label="type" />
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

function dbClickHandler(row, column , cell, event) {
    console.log(row);
    router.push({
        path:'/browse',
        query:{
            path: row.path
        }
    })
}

watch(props, () => refresh())

</script>