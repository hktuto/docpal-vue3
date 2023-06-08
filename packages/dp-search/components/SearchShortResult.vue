<template>
    <div class="shortResultContainer">
        <div class="listContainer">
            <div v-for="item in list" :key="item.id" class="listItem" @click="clickHandler">
                {{item.name}}
            </div>
        </div>
        <div class="shortResultFooter">
            
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    list: any[]
}>()
const emits = defineEmits(['itemClicked'])
function clickHandler() {

}
</script>

<style lang="scss" scoped>
.shortResultContainer{
    max-height: calc(100vh - 60px);
}
</style>