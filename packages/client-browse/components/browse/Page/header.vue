<script lang="ts" setup>
import { DocDetail } from "dp-api";
const props = defineProps<{
    doc: DocDetail,
    permission: {
        permission: string;
        print: boolean;
    }
}>()
</script>


<template>
    <div class="browseHeader">
        <slot :doc="doc" :permission="permission" />
    </div>
</template>

