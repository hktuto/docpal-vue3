<script lang="ts" setup>
import { DocDetail } from "dp-api";
import { Permission } from "~/utils/permissionHelper";
const props = defineProps<{
    doc: DocDetail,
    permission: Permission
}>()
</script>


<template>
    <div class="browseHeader">
        <slot :doc="doc" :permission="permission" />
    </div>
</template>

