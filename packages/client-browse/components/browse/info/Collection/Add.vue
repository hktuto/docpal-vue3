<template>
    <el-popover
    v-model="popoverShow"
    width="300"
    trigger="click"
    popper-class="collectionPopover popover_050"
  >
  <template #reference>
    <img  class="cursorPointer" :src="'/icons/add.svg'" />
  </template>

    <!-- 内容 -->
    <div class="title">{{ $t('collections_add') }}</div>
    <div class="subTitle">
      {{ $t('collections_caption') }}
    </div>
    <el-select
      v-model="selected"
      value-key="path"
      filterable
      allow-create
      default-first-option
      :placeholder="$t('choose')"
      popper-class="popperSelect"
      class="collectionSelect"
    >
      <option
        v-for="item in myCollection"
        :key="item.id"
        :label="item.name"
        :value="item.name"
      >
      </option>
    </el-select>
    <el-button type="primary" @click="handleConfirm">{{
      $t('confirm')
    }}</el-button>
  </el-popover>
</template>

<script lang="ts" setup>
import {getAllCollection} from 'dp-api'
const props = defineProps<{
  doc: any,
  exitList: any
}>()
const emit = defineEmits(['handleAdd']);
const allCollection = ref([])
const popoverShow = ref(false)

    const selected = ref()
    const myCollection = computed(() => {
      return allCollection.value.filter((allItem:any) => 
              !props.exitList.some((exitItem:any) => exitItem.name === allItem.name))
    })

    const handleConfirm = async () => {
      const flag = await handleAddCollection()

      popoverShow.value = false
      if (!selected.value || !flag) {
        return
      }

      const param = {
        documents: [{ idOrPath: props.doc.id }],
        collection: { idOrPath: selected.value },
      }

      addCollection(param).then((res) => {
        selected.value = ''
        if (!res) return
        emit('handleAdd', props.doc.id)
      })
    }
    const handleAddCollection = async () => {
      let flag = 0
      const index = myCollection.value.findIndex(
        (item) => item.path === selected.value
      )
      if (index !== -1) return 1
        const newCollection = await createCollectionApi({ name: selected.value })
        selected.value = newCollection.path
        flag = 1
      await getAllCollection()
      return flag
    }
    onMounted(async() => {
      allCollection.value = await getAllCollection()
    })
</script>



<style lang="scss">
.collectionPopover {
  .title {
    color: var(--color-grey-600);
  }
  .subTitle {
    font-size: 0.6rem;
    color: var(--color-grey-400);
  }
  .el-button {
    width: 100%;
    margin-top: 1rem;
  }
  .collectionSelect {
    width: 100%;
    .el-input__inner {
      border: unset;
    }
  }
}
.popperSelect {
  .btn {
    font-size: 0.8rem;
    display: inline-block;
    color: var(--color-grey-600);
    margin: 1rem 0.5rem 0.5rem;
    cursor: pointer;
    // text-align: right;
    &:hover {
      background-color: wheat;
    }
  }
}
</style>