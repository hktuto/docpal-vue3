<template>
     <img :class="classes" :src="`/images/logo-${mode}-${$colorMode.value === 'system' ? 'dark' : $colorMode.value}.svg`"  alt="logo" @click="$emit('click')"/>
</template>

<script lang="ts" setup>
export interface Props {
  mode?: string
}
withDefaults(defineProps<Props>(), {
  mode: 'withName',
})

const classes = ref("");

onBeforeUnmount(() => {
  classes.value = 'fadeOut'
});

</script>
