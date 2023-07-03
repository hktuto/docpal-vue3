<template>
    <el-tree ref="treeRef" v-bind="_options" :props="_treeProps" :load="loadNode" lazy 
      @node-click="handleNodeClick"
    >
      <template #default="{ node, data }">
        <slot v-if="!data.isGetMore" :node="node" :data="data">
          {{data.name}}
        </slot>
        <el-button v-else :loading="data.loading" size="small">{{$t('loadMore')}}</el-button>
      </template>
    </el-tree>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'
interface TreeOptions {
  nodeKey?: string,
  highlightCurrent?: boolean,
  accordion?: boolean,
  pageSize?: number,
  pageNumber?: number,
  icon?: string | Component,
  defaultExpandedKeys: Array
}
interface TreeProps {
  label?: any,
  children?: string,
  disabled?: any,
  isLeaf?: any,
  class?: any
}
const props = defineProps<{
  options?: TreeOptions,
  props?: TreeProps,
  rootDataGetApi: Function,
  leafDataGetApi: Function
}>()
const state = ref({

})
const _options = computed(() => {
  const qPath = route.query.path
  let defaultExpandedKeys = []
  if(props.options && props.options.defaultExpandedKeys) {
    defaultExpandedKeys.push([...props.options.defaultExpandedKeys])
  }
  if(!!qPath) {
    const qPaths = qPath.split('/').reduce((prev, key, index) => {
      if(index === 0) prev.push('/')
      else {
        let _key = prev[index - 1] + key
        if(index !== qPath.length - 1) _key += '/'
        prev.push(_key)
      }
      return prev
    }, [])
    dpLog({qPaths});
    
    defaultExpandedKeys.push(...qPaths)
  }
  
  return {
    highlightCurrent: true,
    nodeKey: 'path',
    icon: ArrowRight,
    ...props.options,
    defaultExpandedKeys
  }
})
const _treeProps = computed(() => {
  const treeProp = props.props || {}
  return {
    label: 'name',
    children: 'children',
    isLeaf: (data, node) => !data.isFolder,
    ...treeProp
  }
})
const emits = defineEmits([
  'rootLoadFinish',
  'loadFinish',
  'handleNodeClick'
])
const treeRef = ref()
const route = useRoute()
const router = useRouter()
// #region module: Data
  async function loadNode (node: Node, resolve: any) {
      if (node.level === 0) {
        if (props.rootDataGetApi) {
          const res = await props.rootDataGetApi();//获取顶级节点数据
          resolve(res)
          emits('rootLoadFinish', res[0])
        } else {
          const res = await getLoadMoreData('/')
          resolve(res)
          emits('rootLoadFinish', res[0])
        }
      } else if(node.data.isGetMore) {
        getMore(node)
      } else {
        const res = await getLoadMoreData(node.data)
        node.data.children = res
        if(node.data.path === route.query.path) {
          emits('loadFinish', node.data);
        }
        resolve(res)
      }
  }
  async function getLoadMoreData (data) {
    // TODO 初始路径分页内容加载
    if(!data.isFolder) return []
    const pageParams = {
      pageNumber: props.options?.pageNumber || 0,
      pageSize: props.options?.pageSize || 10
    }
    pageParams.idOrPath = data.path === 'Root' ? '/' : data.path.replace('Root', '') 
    const docsPage = await props.leafDataGetApi(pageParams)
    if (docsPage.entryList) docsPage.entryList.push(...handleGetMoreNode(docsPage.entryList, { ...pageParams }, data.path))
    else docsPage.entryList = [...docsPage]
    return docsPage.entryList
  }
  // #region module: getMore button node
    function handleGetMoreNode (list, pageParams, path?: string ) {
      const parentpath = path
      console.log({parentpath});
      
      treeRef.value.remove({path: `${parentpath}/getMoreNode`}) 
      const result = []
      if (list.length === pageParams.pageSize) {
        pageParams.pageNumber++
        result.push({
          name: 'getMoreNode',
          path: `${parentpath}/getMoreNode`,
          isGetMore: true,
          params: pageParams,
          loading: false,
          id: new Date().valueOf().toString()+'getMoreNode'
        }) 
      }
      return result
    }
    function getParentpath (path: string) {
      const pList = path.split('/')
      pList.pop()
      return pList.join('/')
    }
    // 加载更多，插入到父节点
    async function getMore (node) {
      node.data.loading = true
      try {
        const docsPage = await props.leafDataGetApi(node.data.params)
        const pPath = getParentpath(node.data.path)
        docsPage.entryList.push(...handleGetMoreNode(docsPage.entryList, node.data.params, pPath))
        const parentpath = getParentpath(node.data.path)
        docsPage.entryList.forEach(docItem => {
          if (parentpath !== 'Root') {
            treeRef.value.append(docItem, parentpath)
          }
          // @ts-ignore
          else treeRef.value.append(docItem, treeRef.value.root)
        });
      } catch (error) {
        
      }
      node.data.loading = false
    } 
  // #endregion
// #endregion
function handleNodeClick (data, node?, nodeComponent?) {
  console.log({data});
  
  if (node.data.isGetMore) {
    getMore(node)
    return
  }
  router.push({
    query: {
      path: data.path
    }
  })
  treeRef.value.setCurrentKey(data[_options.value.nodeKey])
  emits('handleNodeClick', data, node, nodeComponent)
}
defineExpose({ treeRef })
</script>

<style lang="scss" scoped>
</style>