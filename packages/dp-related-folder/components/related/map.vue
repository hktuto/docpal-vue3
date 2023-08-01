<script lang="ts" setup>
import { useEventListener } from "@vueuse/core";

const {doc, relatedChildren,} = useRelatedFolder();


useEventListener(document, 'show-relate-map', () => {
    console.log('show-relate-map')
})

</script>


<template>
    <div id="relatedMapContainer">
        <teleport to="body">
            
        </teleport>
    </div>
</template>