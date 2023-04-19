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
  const qPath = route.query.logicPath
  let defaultExpandedKeys = []
  if(props.options && props.options.defaultExpandedKeys) {
    defaultExpandedKeys.push([...props.options.defaultExpandedKeys])
  }
  if(!!qPath) {
    const qPaths = qPath.split('/').reduce((prev, key, index) => {
      if(index === 0) prev.push(key)
      else prev.push(prev[index - 1] + '/' + key)
      return prev
    }, [])
    console.log({qPaths});
    
    defaultExpandedKeys.push(...qPaths)
  }
  
  return {
    highlightCurrent: true,
    nodeKey: 'logicPath',
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
          res.forEach(item => item.logicPath = item.name)
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
        res.forEach(item => item.logicPath = node.data.logicPath + '/' + item.name)
        node.data.children = res
        if(node.data.logicPath === route.query.logicPath) {
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
    pageParams.idOrPath = data.path
    const docsPage = await props.leafDataGetApi(pageParams)
    if (docsPage.entryList) docsPage.entryList.push(...handleGetMoreNode(docsPage.entryList, { ...pageParams }, data.logicPath))
    else docsPage.entryList = [...docsPage]
    return docsPage.entryList
  }
  // #region module: getMore button node
    function handleGetMoreNode (list, pageParams, logicPath?: string ) {
      const parentLogicPath = getParentLogicPath(logicPath)
      treeRef.value.remove({logicPath: `${parentLogicPath}/getMoreNode`}) 
      const result = []
      if (list.length === pageParams.pageSize) {
        pageParams.pageNumber++
        result.push({
          name: 'getMoreNode',
          path: `${parentLogicPath}/getMoreNode`,
          logicPath: `${parentLogicPath}/getMoreNode`,
          isGetMore: true,
          params: pageParams,
          loading: false,
          id: new Date().valueOf().toString()+'getMoreNode'
        }) 
      }
      return result
    }
    function getParentLogicPath (path: string) {
      const pList = path.split('/')
      pList.pop()
      return pList.join('/')
    }
    // 加载更多，插入到父节点
    async function getMore (node) {
      node.data.loading = true
      const docsPage = await props.leafDataGetApi(node.data.params)
      docsPage.entryList.push(...handleGetMoreNode(docsPage.entryList, node.data.params, node.data.logicPath))
      const parentLogicPath = getParentLogicPath(node.data.logicPath)
      
      docsPage.entryList.forEach(docItem => {
        docItem.logicPath = parentLogicPath + '/' + docItem.name
        if (parentLogicPath !== 'Root') {
          treeRef.value.append(docItem, parentLogicPath)
        }
        // @ts-ignore
        else treeRef.value.append(docItem, treeRef.value.root)
      });
      node.data.loading = false
    } 
  // #endregion
// #endregion
function handleNodeClick (data, node?, nodeComponent?) {
  if (node.data.isGetMore) {
    getMore(node)
    return
  }
  router.push({
    query: {
      logicPath: data.logicPath
    }
  })
  treeRef.value.setCurrentKey(data[_options.value.nodeKey])
  emits('handleNodeClick', data, node, nodeComponent)
}
defineExpose({ treeRef })
</script>

<style lang="scss" scoped>
</style>