<template>
    <div class="searchResultSummeryContainer">
        <div class="listContainer">
            <div v-for="item in list" :key="item.id" class="listItem">
                
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    list: object[]
}>();


</script>