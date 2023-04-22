<template>
    <div class="docInfoContainer">
        <div class="infoTitle">
      <span class="title">{{ $t('rightDetail_info') }}</span>
      <!-- <img class="cursorPointer" src="/icons/fold.svg" /> -->
    </div>
    <div class="infoDetail">
      <table class="tableItem">
        <tr>
          <th class="tableItemTitle">{{ $t('info_type') }}</th>
          <td class="tableItemContent">{{ info.type }}</td>
        </tr>
        <tr v-show="!info.isFolder && (info.isCheckedOut || version !== '0.0')">
          <th class="tableItemTitle">{{ $t('info_version') }}</th>
          <td class="tableItemContent">
            <!-- <template v-if="version !== '0.0'"> 
              {{ version }}
              <template v-if="info.isCheckedOut">+ </template>
            </template> -->
            <!-- <CreateVersionButtom v-show="info.isCheckedOut" :doc="info" /> -->
            <!-- {{info}} -->
            <BrowseInfoVersionPopover v-if="info.id" :doc="info"></BrowseInfoVersionPopover>
          </td>
        </tr>
        <tr>
          <th class="tableItemTitle">{{ $t('info_modified') }}</th>
          <td class="tableItemContent">
            {{
              displayTime(info.modifiedDate) === 'Invalid Date'
                ? displayTime(info.createdDate)
                : displayTime(info.modifiedDate)
            }}
          </td>
        </tr>
        <tr>
          <th class="tableItemTitle">{{ $t('info_created') }}</th>
          <td class="tableItemContent">{{ displayTime(info.createdDate) }}</td>
        </tr>
        <tr>
          <th class="tableItemTitle">{{ $t('info_by') }}</th>
          <td class="tableItemContent tableItemTags">{{ info.createdBy }}</td>
        </tr>
        <tr>
          <th class="tableItemTitle vertical-top">{{ $t('info_contributors') }}</th>
          <td class="tableItemContent" >
            <div v-for="(contributor, index) in contributors"
              :key="index" class="tagContainer tableItemTags">
              {{ contributor }}
            </div>
          </td>
        </tr>
        <BrowseInfoWorkflowSection :doc="doc"></BrowseInfoWorkflowSection>
      </table>
    </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    doc: any
}>()
const { displayTime } = useTime()

const info = computed(() => {
    return (
    props.doc || {
        type: '',
        modifiedDate: '',
        createdDate: '',
        createdBy: '',
    }
    )
})
const version = computed(() => {
    const majorVersion = props.doc?.properties?.['uid:major_version'] || 0
    const minorVersion = props.doc?.properties?.['uid:minor_version'] || 0
    return majorVersion + '.' + minorVersion
})
const contributors = computed(() => {
      const data = props.doc?.properties?.['dc:contributors'] || []
      return data
    })
</script>



<style lang="scss" scoped>
.info {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  // border-bottom: 1px solid var(--color-grey-200);
  .infoTitle {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .title {
      font-family: Roboto;
      font-style: normal;
      font-weight: normal;
      font-size: 1.125rem;
      line-height: 1.375rem;
      color: var(--color-grey-500);
    }
  }
  :deep{
    .tableItem {
    font-family: Roboto;
    font-style: normal;
    font-size: 0.875rem;
    border-collapse: separate;
    border-spacing: 0.625rem;
    white-space: nowrap;
    .tableItemTitle {
      font-weight: normal;
      color: var(--color-grey-500);
      text-align: left;
    }
    .vertical-top {
      vertical-align: text-top;
    }
    .tableItemContent {
      font-weight: bold;
      line-height: 1.375rem;
      color: var(--color-grey-500);
    }
    .tableItemTags {
      padding: 0.1rem 0.75rem;
      background: var(--color-grey-300);
      border-radius: 0.875rem;
      font-weight: bold;
      margin: 0 calc(var(--app-padding) / 2) calc(var(--app-padding) / 2 ) 0;
      color: #ffffff;
    }
  } 
  }
}

</style>
