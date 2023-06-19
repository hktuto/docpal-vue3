<template>
    <div class="itemContainer">
        <div class="header">
            <div class="itemLabel">
                {{ item?.name }}
            </div>
            <div class="actionsContainer">
                <SvgIcon src="/images/icon/add.svg" />
            </div>
        </div>
        <div v-if="item.children" class="childrenContainer">
            <virtual-folder-form-item v-for="children in item?.children" :key="children.name" :detail="children" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { VirtualFolderItem } from "dp-api"

const props = defineProps<{
    item?: VirtualFolderItem
}>()

</script>