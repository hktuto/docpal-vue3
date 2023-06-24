<script setup lang="ts">
import {DocItem} from "dp-api";

const props = defineProps<{
  modelValue: DocItem
}>()

const emits = defineEmits(['update:modelValue']);


</script>

<template>
  <div class="itemContainer">
    <el-form :model="modelValue">
      <el-form-item :label="$t('virtual_admin_form_name')">
        <el-input v-model="modelValue.name" placeholder="Name" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="modelValue.docType">
          
        </el-select>
      </el-form-item>
    </el-form>    
  </div>
</template>

<style scoped lang="scss">

</style>