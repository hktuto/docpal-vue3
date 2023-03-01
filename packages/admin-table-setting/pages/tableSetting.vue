<template>
    <NuxtLayout >
        456
        <div @click="openDialog">7777</div>
        <TableSettingDialog ref="TableSettingDialogRef"></TableSettingDialog>
    </NuxtLayout>
</template>


<script lang="ts" setup>
const TableSettingDialogRef = ref()
function openDialog () {
    TableSettingDialogRef.value.handleOpen()
}
</script>

<style lang="scss" scoped>
</style>