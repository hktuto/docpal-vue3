<template>
    <div ref="filterContainerRef" class="filterContainer">
      <div class="formShrink" @click="opened = true">
        <div class="iconContainer">
          <arrow-down />
        </div>
      </div>
      <div :class="{formContainerDialog:true, opened}">
        <div v-if="isMobile" class="dialogCloseBtn" @click="opened = false">
          <SvgIcon src="/icons/close.svg" />
        </div>

        <FromRenderer ref="FromRendererRef" :form-json="filterJson" @form-change="formChangeHandler" ></FromRenderer>
        <div class="filterContainer-footer">
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-button type="info" @click="handleReset">{{$t('reset')}}</el-button>
                </el-col>
                <el-col :span="16">
                    <el-button type="primary" :loading="loading" @click="handleSubmit">{{$t('search')}}</el-button>
                </el-col>
            </el-row>
            <el-button v-if="allowFeature('SEARCH_EXPORT')" type="info" @click="handleDownload">{{$t('export')}}</el-button>
        </div>
      </div>
        <SearchDownloadDialog ref="SearchDownloadDialogRef" />
    </div>
</template>

<script lang="ts" setup>

import { deepCopy, getJsonApi, getSearchParamsArray } from 'dp-api'
import {ArrowDown} from "@element-plus/icons-vue";
const props = defineProps<{
    searchParams: any,
    ready: boolean,
    loading: boolean,
}>()
const { isMobile, allowFeature } = useLayout()
const route = useRoute()
const router = useRouter()
const filterJson = getJsonApi('search.json')
const FromRendererRef = ref()
const filterContainerRef = ref()

const opened = ref(false);
const formModelData = ref<any>({});
function formChangeHandler({fieldName,newValue,oldValue,formModel}) {
    if(!props.ready) return
    const _data = dataHandle(formModel)
    goRoute(_data)
}
function goRoute(formModel:any) {
    const searchBackPath = route.query.searchBackPath || ''
    const time = new Date().valueOf().toString()
    formModelData.value = formModel
    router.push({
        query: {
            ...formModel,
            pageSize: 20,
            currentPageIndex: 1,
            searchBackPath,
            time
        }
    })
}
function handleSubmit () {
    const data = FromRendererRef.value.vFormRenderRef.getFormData(false)
    const _data = dataHandle(data)
    goRoute(_data)
  if(opened ) {
    opened.value = false
  }
}

function handleReset() {
    FromRendererRef.value.vFormRenderRef.resetForm()
}
function initForm (searchParams) {
  nextTick(async() => {
        let key = searchParams.paramsInTextSearch
        if(!!key) searchParams.keyword = key
        searchParams.includeFolder = (searchParams.includeFolder === '1' || searchParams.includeFolder === 1 || searchParams.includeFolder === true|| searchParams.includeFolder === 'true') ? '1' : '0'
        console.log({searchParams});
        
        if(searchParams.hight) {
            searchParams.hight = Array.isArray(searchParams.hight) ? searchParams.hight.join('') : searchParams.hight
        }
        if(searchParams.width) {
            searchParams.width = Array.isArray(searchParams.width) ? searchParams.width.join('') : searchParams.width
        }
        if(searchParams.duration) {
            searchParams.duration = Array.isArray(searchParams.duration) ? searchParams.duration.join('') : searchParams.duration
        }
        if(searchParams.mimeType) {
            searchParams.mimeType = Array.isArray(searchParams.mimeType) ? searchParams.mimeType.join('') : searchParams.mimeType
        }
        // searchParams.includeFolder = searchParams.includeFolder === '1' || searchParams.includeFolder === 1;
        await FromRendererRef.value.vFormRenderRef.setFormData(searchParams)
        formModelData.value = FromRendererRef.value.vFormRenderRef.getFormData(false)
    })
}
const SearchDownloadDialogRef = ref()
function dataHandle (formModel) {
    let _formModel = deepCopy(formModel)
    _formModel.paramsInTextSearch = _formModel.keyword
    delete _formModel.keyword
    return _formModel
}
function handleDownload () {
    let data = FromRendererRef.value.vFormRenderRef.getFormData(false)
    let _data = dataHandle(data)
    _data = getSearchParamsArray(_data)
    SearchDownloadDialogRef.value.handleOpen(_data)
}
onMounted(() => {
})
defineExpose({ handleSubmit, initForm })
</script>

<style lang="scss" scoped>
.filterContainer{
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    overflow: auto;
    min-width: 320px;
  flex: 0 0 auto;
  @media(max-width: 1024px) {
    height: auto;
  }
    .formContainer {
        overflow-x: hidden;
        overflow-y: auto;
    }
    &-footer {
        padding: 0 6px;
        .el-button {
            margin: unset;
            margin-top: var(--app-padding);
            width: 100%;
        }
    }
}
.formShrink{
  display: none;
  width: 100%;
  position: relative;
  font-size: .8rem;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  .iconContainer{
    width: 1rem;
  }
  @media (max-width: 1024px) {
    display: flex;
  }
}
.formContainerDialog{
  display: none;
  background: var(--color-grey-0000);
  @media (min-width: 1024px) {
    display: block !important;

  }
  &.opened {
    display: block;
    position: fixed;
    z-index: 9;
    left: var(--app-padding);
    right: var(--app-padding);
    top: calc( var(--app-padding) + 60px );
    bottom: var(--app-padding);

  }
}
</style>
