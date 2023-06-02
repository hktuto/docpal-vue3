

<template>
  <div class="editFormContainer">
    <div class="header">
      <span class="header__title">{{ $t('admin_watermark_properties')}}</span>
      <ElPopconfirm @confirm="$emit('delete')">
        <div slot="reference" class="listItemDelete" >
          <InlineSvg class="deleteIcon" src="/icons/trash.svg" />
        </div>
      </ElPopconfirm>
    </div>
    <slot />
  </div>
</template>

<script  lang="ts" setup>

import InlineSvg from "vue-inline-svg";

const emit = defineEmits(['delete'])

</script>

<style scoped lang="scss">
.editFormContainer{
  display: flex;
  flex-flow: column nowrap;
  gap: 6px;
  align-items: center;
  justify-content: flex-start;
  background: #fff;
  border-radius: 4px;
  padding: 8px;
  max-width: 200px;
  box-shadow: 0 0 4px rgba(0,0,0,0.1);
  background: var(--color-grey-0000);
  ::v-deep  {
    .el-input-number{
      width: 100%;
    }
  }
}
.el-form-item {
  margin-bottom: 0;
  width: 100%;
}
.header{
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}
.listItemDelete{
  color: #000;
}


.deleteIcon{
  width: 16px;
  height: 16px;
}
</style>
