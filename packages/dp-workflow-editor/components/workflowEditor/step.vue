<template>
    <div class="stepContainer">
        step
        </div>    
</template>


<script lang="ts" setup>
inject('getNode');

onMounted(() => {
    const node = getNode();
    node.on('change:data', ({ current }) => {
      console.log(current)
    })
})
</script>