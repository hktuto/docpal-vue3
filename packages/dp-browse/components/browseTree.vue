<template>
    <div class="treeContainer">
        <ElTree
            node-key="path"
            :load="loadNode"
            lazy
        >
             <template #default="{ node, data }">
                 <span :class="data.isFolder">{{ data.name }}</span>
             </template>
        </ElTree>

    </div>
</template>

<script lang="ts" setup>
import type Node from 'element-plus/es/components/tree/src/model/node'

const props = withDefaults(defineProps<{path:string}>(), {
    path: '/'
});

async function loadNode(node: Node, resolve:any):void {
    if(node.level === 0) {
        const res = await GetChildThumbnail('/');
        res.forEach(item => {  
          item.showInput = false  // 设置后才可以重命名
          item.children = []     // 设置后 fileListView 才可以显示
        })
        return resolve(res)
    }
    const res = await GetChildThumbnail(node.data.path);
    res.forEach(item => {  
        item.showInput = false  // 设置后才可以重命名
        item.children = []     // 设置后 fileListView 才可以显示
    })
    return resolve(res)

}


</script>
