<template>
    <NuxtLayout class="fit-height withPadding " :backPath="`/workflow?tab=all`">
        <div class="page">
    <template v-if="tasks.length > 0">
    </template>
    <template v-else>
      <div class="noResultContainer">
        <h1>The Task already completed or not exist</h1>
        <Button Button type="primary" @click="() => $router.push({path:'/workflow'})">Back</Button>
      </div>
    </template>
  </div>
    </NuxtLayout>
</template>



<script lang="ts" setup>
import { api } from 'dp-api'
import {ElMessage} from 'element-plus'
const route = useRoute()
const router = useRouter()
const processInstanceId = computed(() => route.query.processInstanceId);
const tasks = ref<any>([])
const loading = ref(false);
const getLatestTask = async(processInstanceId:string) => {
    loading.value = true;
    try {
        tasks.value = await await api.post('/docpal/workflow/tasks/', {
            processInstanceId
        }).then(res => res.data.data)
        if (tasks.value.length > 0) {
            const taskId = tasks.value[0].id
            router.push((`/workflow/${taskId}`))
        }
    } catch (error) {
        ElMessage.error('task no valid');
    }
    loading.value = false;
}

onMounted(() => {
    // if no processInstanceId, throw error
    if(!processInstanceId.value) {
        ElMessage.error('no processInstanceId');
    }
    getLatestTask(processInstanceId.value as string);
})
</script>