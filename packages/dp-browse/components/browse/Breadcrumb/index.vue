<template>
    <div class="breadCrumbContainer">
        <!-- {{data}} -->
        <div  class="breadContainer">
            
            <div v-loading="pending" class="breadItem pointer home" @click="navigate(rootPath)" >
                <SvgIcon :src="'/icons/breadcrumb_home.svg'" />
            </div>
            <div v-if="displayBread && displayBread.length > 0" class="divider">
                <ElIcon><ArrowRight/></ElIcon>
            </div>
            <template v-for="(item,index) in displayBread" :key="displayBread.id">
                <DropzoneContainer class="drop" :doc="item" >
                <div  :class="{breadItem:true, pointer: index < displayBread.length - 1 }" 
                        @click="() => {if(index === displayBread.length - 1 )return; navigate(item.path)}"
                        @contextmenu="(event) => {if(index < displayBread.length - 1 )return ; handleRightClick(item, event)}">
                    {{item.name}}
                </div>
                </DropzoneContainer>
                <div v-if="index < displayBread.length - 1" class="divider">
                    <ElIcon><ArrowRight/></ElIcon>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {Back, ArrowRight} from '@element-plus/icons-vue'
import { GetBreadcrumb } from 'dp-api'
import { EmitFlags } from 'typescript';
const router = useRouter();
const props = withDefaults(defineProps<{
    path:string,
    rootPath: string
}>(),{
    path:'/',
    rootPath: '/'
})
const emit = defineEmits(['go-parent'])
const { data, refresh, pending } = useAsyncData(() => GetBreadcrumb(props.path));

const displayBread = computed(() => data.value?.filter(d => d.isFolder)|| []);

watch(props, () => {
    refresh()
})

async function goParent() {
    const path = data.value[data.value.length - 2]? data.value[data.value.length - 2].path : props.rootPath;
    
    router.replace({
        path:'/browse',
        query:{
            path
        }
    })
    emit('go-parent')
}

function navigate(path) {
    router.push({
        path:'/browse',
        query:{
            path
        }
    })
}
function handleRightClick (item, event) {
    event.preventDefault();
    const data = {
        isFolder: true,
        idOrPath: item.path,
        pageX: event.pageX,
        pageY: event.pageY,
        doc: item,
        actions: {
            cut: false,
            copy: false,
            rename: false,
            delete: false
        }
    }
    const ev = new CustomEvent('fileRightClick',{ detail: data })
    document.dispatchEvent(ev)
}


defineExpose({
    goParent
})
</script>

<style lang="scss" scoped>
.breadCrumbContainer{
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    gap : calc(var(--el-component-size-small) / 3 );
}
.breadContainer{
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
    gap: calc(var(--el-component-size-small) / 3 );
}
.breadItem{
    padding: 4px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    color: var(--color-grey-400);
    font-size: var(--el-font-size-small);
    border-radius: 4px;
    &.home {
        --icon-size: 24px;
        border-radius: 50%;
        height: 32px;
        background: var(--color-grey-050);
    }
    &.pointer{
        
        &:hover{
            --icon-color: var(--el-color-white);
            background: var(--el-color-primary);
            color: var(--el-color-white);
        }
    }
}

.drop{
    position: relative;
}
</style>