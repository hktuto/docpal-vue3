<template>
     <NuxtLayout >
        <page-container>
          <div class="flex__50 padding">
            <VersionHeader :doc="oldVersion" :canRestore="true" />
            <!-- <VersionHerader :doc="oldVersion" </VersionHerader> -->
            <VersionHeader :doc="newVersion"></VersionHeader>
          </div>
            
         <main v-if="newVersion">
        <!-- <Collapse v-model="activeNames">
            <CollapseItem title="info" name="1">
            <InfoDiff ref="infoDiff" :newVersion="newVersion" :oldVersion="oldVersion"></InfoDiff>
            </CollapseItem>
        </Collapse> -->
          <h3 class="">{{$t('common_info')}}</h3>
          <InfoDiff ref="infoDiff" :newVersion="newVersion" :oldVersion="oldVersion"></InfoDiff>
          <h3 class="">{{$t('common_file')}}</h3>
          <div class="flex__50 viewersContainer">
              <PdfViewer :doc="oldVersion"  />
              <PdfViewer :doc="newVersion"  />
          </div>
        </main>
        </page-container>
       
     </NuxtLayout>
</template>


<script lang="ts" setup>
import { GetDocDetail, getSpecificVersionApi } from 'dp-api'
    const route = useRoute(); 
    const router = useRouter();
    const newVersion = ref<Document>()
    const oldVersion = ref<Document>()
    const activeNames = ref(['1'])
    const infoDiff = ref()

    const init = async(path) => {
      const idOrPath = path
    }

    const close = () => {
      router.push( {
        path: `/browse/?path=${newVersion.value.path}`
      })
    }

    onMounted( async() => {
      init(route.params.id as string);
      newVersion.value = await GetDocDetail(route.params.id as string)
      oldVersion.value = await getSpecificVersionApi({
        idOrPath: route.params.id,
        versionNum: route.query.oldVersion
      })
      nextTick(() => {
        infoDiff.value.handleData()
      })
    })
</script>

<style lang="scss" setup>
.pageContainer{
  display: grid;
  grid-template-rows: min-content 1fr;
}
.viewersContainer{
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  height: 100%;
  flex: 1 0 auto;
}
h3{
  margin: 0;
}
main {
  overflow: hidden;
  display: flex;
    flex-flow: column nowrap;
    height: 100%;
}
.code-diff-view{
      flex: 1 0 auto;
}
.i__back {
  color: var(--color-grey-400);
  font-size: 1.2rem;
  cursor: pointer;
}
.flex__50 {
  display: flex;
  &>div {
    width: 48%;
    margin-right: 2%;
  }
  :deep .pdfContainer {
    height: calc(100vh - 170px);
    min-height: 300px;
  }
  :deep .preview__container {
    display: unset;
  }
}
</style>
