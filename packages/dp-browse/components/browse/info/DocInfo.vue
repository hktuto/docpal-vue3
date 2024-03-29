<template>
<div class="docInfoContainer">
    <el-card>
        <div class="infoSection">
            <div class="infoTitle">{{$t('info_type')}}</div>
            <div class="infoContent">{{ info.type }}</div>
        </div>
        <div v-show="!info.isFolder && (info.isCheckedOut || version !== '0.0')" class="infoSection">
            <div class="infoTitle">{{ $t('info_version') }}</div>
            <div class="infoContent"><BrowseInfoVersionPopover v-if="info.id" :doc="info"></BrowseInfoVersionPopover></div>
        </div>
        <div class="infoSection">
            <div class="infoTitle">{{ $t('info_modified') }}</div>
            <div class="infoContent">{{
                displayTime(info.modifiedDate) === 'Invalid Date'
                ? displayTime(info.createdDate)
                : displayTime(info.modifiedDate)
            }}</div>
        </div>
        <div class="infoSection">
            <div class="infoTitle">{{ $t('info_created') }}</div>
            <div class="infoContent">{{ displayTime(info.createdDate) }}</div>
        </div>
        <div class="infoSection">
            <div class="infoTitle">{{ $t('info_by') }}</div>
            <div class="infoContent">{{ info.createdBy }}</div>
        </div>
        <div class="infoSection">
            <div class="infoTitle">{{ $t('info_contributors') }}</div>
            <div class="infoContent tagList">
                <div v-for="(contributor, index) in contributors"
                    :key="index" class="tag tableItemTags">
                    {{ contributor }}
                </div>
            </div>
        </div>
        <el-divider />
        <BrowseInfoMeta v-bind="$props" :permission="permission" @update="$emit('update', true)"/>
        <BrowseInfoTag :doc="doc" :permission="permission" @update="$emit('update', true)"/>
        <BrowseInfoCollection v-if="doc.isCollectionMember" :doc="doc" :permission="permission" @update="$emit('update', true)" />
    </el-card>
    <el-card v-if="!doc.isFolder && allowFeature('WORKFLOW_ADHOC')">
        <BrowseInfoWorkflowSection :doc="doc"></BrowseInfoWorkflowSection>
    </el-card>
    <!-- <el-divider /> -->
    <el-card>
        <BrowseInfoAcl :doc="doc" :permission="permission" />
    </el-card>
</div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    doc: any,
    permission: any
}>()
const { displayTime } = useTime()
const { allowFeature } = useLayout()
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
const contributors = computed(() => props.doc?.properties?.['dc:contributors'] || [])
</script>



<style lang="scss" scoped>
.docInfoContainer{
  display: flex;
  flex-flow: column nowrap;
  gap: var(--app-padding);
  color: var(--color-grey-600);

  :deep {
    > * {
      flex: 1 0 auto;
    }

    .infoSection{

      margin-bottom: 2px;
    }
    .infoTitle {
      font-size: 0.6rem;
      display: block;
      color: var(--color-grey-400);
      margin-bottom: 2px;
    }
    .infoContent{
      font-size: .8rem;
      font-weight: 500;
      display: block;
      min-height: 1rem;
    }
  }
}
.tagList{
  .tag{
    display: inline-block;
    background: var(--color-grey-050);
    padding: 4px 12px;
    border-radius: 2px;
    margin: 0 4px 4px 0;
  }
}
</style>
