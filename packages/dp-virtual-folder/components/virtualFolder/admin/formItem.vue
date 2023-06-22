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
            <VirtualFolderAdminFormItem v-for="children in item?.children" :key="children.name" :detail="children" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { VirtualFolderItem } from "dp-api"

const props = defineProps<{
    item: VirtualFolderItem
}>()

</script>

<style lang="scss" scoped>
.itemContainer{
    border: 1px solid var(--color-grey-200);
    border-radius: 4px;
    margin-block: var(--app-padding);
    display: flex;
    flex-flow: column nowrap;
    gap:var(--app-padding);
    flex: 1 0 auto;
}
.childrenContainer{
  display: flex;
  flex-flow: column nowrap;
  gap:var(--app-padding);
  
}
</style>