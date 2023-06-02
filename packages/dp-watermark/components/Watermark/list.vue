<template>
    <div class="watermarkListContainer">
        <div class="listActionContainer">
            <InlineSvg src="/icons/add.svg" class="addButton" @click="createItem"/>
        </div>
        <div class="listItemsContainer">
            <div v-for="item in list" :key="item.id" :class="{listItem:true, selected: item.id === selectedId}">
                <div class="listItemLabel" @click="switchDetail(item.id)">
                    {{item.name}}
                </div>
                <!-- TODO : icon size and style -->
                <div class="listAction listItemEdit" @click="editItem(item.id)">
                    <InlineSvg src="/icons/edit_1.svg" />
                </div>
                <ElPopconfirm @confirm="deleteItem(item.id)">
                    <div slot="reference" class="listAction listItemDelete" >
                        <InlineSvg src="/icons/trash.svg" />
                    </div>
                </ElPopconfirm>
            </div>
        </div>
        <!-- Edit dialog -->
        <ElDialog v-model="editDialog" destroy-on-close>
            <WatermarkEdit :list="list" :item="selectedItem" @submit="itemChangeHandler" />
        </ElDialog>
        <!-- New dialog -->
        <ElDialog v-model="newDialog" destroy-on-close>
            <WatermarkCreate :list="list"  @submit="itemChangeHandler" />
        </ElDialog>
    </div>
</template>

<script lang="ts" setup>
import { WatermarkTemplate } from "../../composables/Watermark";

import InlineSvg from 'vue-inline-svg';
const props = defineProps<{
    list: WatermarkTemplate[],
    selectedId: string
}>();

const emit = defineEmits(['update', 'remove'])

const editDialog = ref(false);
const newDialog = ref(false);
const router = useRouter()


const selectedItem = computed(() => {
    return props.list.find((item:WatermarkTemplate) => item.id === props.selectedId)
})

function deleteItem(id:string) {
    emit('remove', id);
}
function createItem() {
    newDialog.value = true;
    editDialog.value = false;
}
function itemChangeHandler() {
    newDialog.value = false;
    editDialog.value = false;
    emit('update',null);
}
function editItem(id: string) {
    newDialog.value = false;
    editDialog.value = true;
    switchDetail(id);
}
function switchDetail(id:string) {
    router.push({
        path: '/watermark',
        query: { id }
    })
}

</script>

<style lang="scss" scoped>
.watermarkListContainer{
    width: 200px;
    background: var(--color-p3);
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    gap: var(--app-padding);
    padding: var(--app-padding);
    border-radius: 8px;
}

.listItemsContainer{
    display: flex;
    flex-flow: column nowrap;
    overflow-y: auto;
    flex: 1 0 auto;
    gap: 8px;
}
.listItem{
    --color: #8796A4;
    --bg: transparent;
    display: flex;
    flex-flow: row nowrap;
    gap: 0;
    padding: calc( var(--app-padding) / 2);
    color: var(--color);
    background: var(--bg);
    border-radius: 4px;
    cursor: pointer;
    .listItemLabel{
        flex: 1 0 auto;
    }
    &.selected {
        --color: #fff;
        --bg: #8796A4;
        cursor: default;
    }
}

.listActionContainer{
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-items: center;
    border-bottom: 1px solid var(--color-grey-400);
    flex: 0 0 auto;
    padding: calc( var(--app-padding) / 2);
}
.addButton{
    cursor: pointer;
}

.listAction{
  width: 12px;
  height: 12px;
}
</style>
