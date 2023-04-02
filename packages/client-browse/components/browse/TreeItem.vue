<template>
    <div class="itemContainer">
        {{ doc.name }}
    </div>
</template>

<script lang="ts" setup>
import {GetChildResponse} from '#import';
defineProps<{
    doc: GetChildResponse
}>()
</script>