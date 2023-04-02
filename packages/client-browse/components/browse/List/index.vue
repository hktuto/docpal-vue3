<template>
    <div class="listContainer">
         <div v-if="viewType === 'table'">
            <browse-list-table :data="data" :loading="pending" />
        </div>
        <!-- <div v-else-if="viewType === 'preview'">
            <browse-preview :doc="doc" :permission="permission" :data="data" :pending="pending" />
        </div>
        <div v-else-if="viewType === 'tree'">
            <browse-tree :doc="doc" :permission="permission" :data="data" :pending="pending" />
        </div>
        <div v-else-if="viewType === 'column'">
            <browse-column :doc="doc" :permission="permission" :data="data" :pending="pending" />
        </div> -->
    </div>
</template>

<script lang="ts" setup>
import { GetChild } from 'dp-api'
import { ViewType } from "../../browseType";
const props = withDefaults(defineProps<{
    doc?: any,
    permission?: any,
    viewType?: ViewType
}>(), {
    viewType: 'table'
})
const {doc} = toRefs(props)


const { data, refresh, pending } = useAsyncData(() => GetChild(props.doc.path));

const changeType = (type: ViewType) => {
    viewType.value = type
}
watch(doc, (d:any) => {
    if(d && d.isFolder) {
        refresh()
    }
}, {
    immediate: true
})
</script>