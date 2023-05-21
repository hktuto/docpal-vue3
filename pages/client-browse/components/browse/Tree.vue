<template>
    <div class="treeContainer">
        <ElTree
            ref="treeRef"
            node-key="path"
            :load="loadNode"
            :highlight-current="true"
            :indent="8"
            :default-expanded-keys="defaultExpandedKeys"
            icon="ArrowDown"
            lazy
            @node-click="nodeClick"
        >
             <template #default="{ node, data }">
                 <browse-tree-item :doc="data" />
             </template>
        </ElTree>

    </div>
</template>

<script lang="ts" setup>
import type Node from 'element-plus/es/components/tree/src/model/node'
import { GetChildThumbnail } from 'dp-api'
const router = useRouter()
const defaultExpandedKeys = ref([]);
const currentPath = ref('/');
const treeRef = ref();
const props = withDefaults(defineProps<{path:string}>(), {
    path: '/'
});
async function loadNode(node: Node, resolve:any):void {
    if(node.level === 0) {
        const res = await GetChildThumbnail('/');
        res.forEach(item => {  
          item.showInput = false
          if(!item.isFolder){
              item.children = []     // 设置后 fileListView 才可以显示
          }  // 设置后才可以重命名
        })
        return resolve(res)
    }
    const res = await GetChildThumbnail(node.data.path);
    res.forEach(item => {  
        item.showInput = false  // 设置后才可以重命名
        if(item.isFolder){
              item.children = []     // 设置后 fileListView 才可以显示
          }      // 设置后 fileListView 才可以显示
    })
    return resolve(res)
}


function nodeClick(node){
    router.push({
        path: '/browse',
        query:{
            path: node.path
        }
    })
    currentPath.value = node.path;
}

watch(props.path, (newPath) => {
    if(path !== currentPath.value) {

    }
})

</script>
