<script lang="ts" setup>
import { useEventListener } from "@vueuse/core";
const show = ref(false);
const infoOpened = ref(false);
const {doc, relatedChildren,} = useRelatedFolder();

function closePreview(){
    show.value = false;
    doc.value = null
}

useEventListener(document, 'show-relate-map', () => {
    show.value = true;
})
useEventListener(document, 'close-relate-map', () => {
    show.value = false;
})



</script>


<template>
    <div id="relatedMapContainer">
        <teleport to="body">
            <div v-if="show && relatedChildren" class="dialog">
                <div id="modalHeader">
                    <div class="fileNameContainer">
                        <!-- <div class="fileName">{{ doc.name }}</div> -->
                    </div>
                    <div  class="actions">
                        <BrowseActionsInfo  :doc="doc" @click="infoOpened = !infoOpened"/>
                        <div class="actionIconContainer" @click="closePreview">
                            <el-icon >
                                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path></svg>
                            </el-icon>
                        </div>
                    </div>
                </div>

            </div>
        </teleport>
    </div>
</template>

<style lang="scss" scoped>

.dialog{
    position: fixed;
    left:0;
    top:0;
    width: 100vw;
    height: 100%;
    z-index: 5;
    background-color: rgba(0,0,0,0.8);
    display: grid;
    grid-template-rows: min-content 1fr;
}

#modalHeader{
    display: grid;
    grid-template-columns: 1fr min-content;
    gap: var(--app-padding);
    padding-inline: var(--el-component-size-small);
    padding-top: var(--app-padding);
    color: var(--color-grey-0000);
    align-content: center;
    .actions {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: calc(var(--app-padding) / 2 );
    }
    @media(max-width: 640px) {
      .actions {
        flex-flow: row nowrap;
      }
    }
}
</style>