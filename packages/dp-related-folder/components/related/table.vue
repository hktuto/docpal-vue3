<script lang="ts" setup>

const props = defineProps<{
    data: any
}>()

</script>

<template>
    <div class="relateListContainer">
        <div class="title">
            {{ data.name }}
        </div>
        <div class="table">
            <el-table :data="data.children">
                <el-table-column prop="name" :label="$t('table_name')"></el-table-column>
                <el-table-column >
                    <template #default="{row}">
                        <SvgIcon src="/icons/edit.svg" @click="emit('hide-relate', row)"></SvgIcon>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
