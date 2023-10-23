import { Message } from 'element-ui';


import { ref, useContext, watch } from '@nuxtjs/composition-api';
import { defineStore } from 'pinia';
import isBetween from 'dayjs/plugin/isBetween';

import dayjs from 'dayjs';
import { useAuthStore } from './auth';
import { Task, TaskProperties, Workflow } from '~/models/Workflow';
import { useTime } from '~/compossible/useTime'

dayjs.extend(isBetween);

export const UseWorkflow = defineStore('workflow',() => {

    // @ts-ignore
    const { $axios, i18n } = useContext();
    const myTask = ref<Task[]>([])
    const userIdRef = ref<string>()

    const authStore = useAuthStore()

    const { formatDate } = useTime()
    // @ts-ignore
    const extraWorkflow = ref(window.extraWorkflow);
    const avalibleWorkflowList = ref<Workflow[]>([])

    function isExtraWorkflow(item:Workflow) {
        return avalibleWorkflowList.value.find( listItem => listItem === item);
    }
    async function getWorkflowList() {
        const list = await $axios.$post<Workflow[]>(
            '/docpal/workflow/process/list',
            {}
          );
          avalibleWorkflowList.value = [...list ]
    }

    const filterSameDueDate = (taskList: Task[] = [], dateBefore: number = 0) => {
        return taskList.filter( t => {
            const tDate = dayjs(t.createDate).add(3, 'day');
            const targetDate = dayjs().subtract(dateBefore, 'day');
            return  tDate.isSame(targetDate)
        })
    }

    const filterDueDate = (taskList: Task[] = [], dateBefore: number = 0):Task[] => {
        return taskList.filter( t => {
            const tDate = dayjs(t.createDate).add(3, 'day');
            const targetDate = dayjs().add(dateBefore, 'day');
            return  tDate.isBetween(dayjs(), targetDate)
        })
    }
    const getMyTask = async(params = <any>{}) =>{
        if(!authStore.user?.username) {
            const user = authStore.user
            params.userId = user.username
        }else{
            params.userId = authStore.user?.username
        }
        if(!params.userId) return
        const tasks = await $axios.$post('/docpal/workflow/tasks/personal', params);
        myTask.value = tasks;
        return tasks
    }

    const getFromProperties = async(processKey: string):Promise<TaskProperties[]> => {
        try {
            return await $axios.$post('/docpal/workflow/properties',{ processKey })
        } catch (error) {
            // handle error
            return []
        }
    }
    const getTasks = async(param) => {
        try {
            return await $axios.$post('/docpal/workflow/tasks', param)
        } catch (error) {
            // handle error
            return null
        }
    }


    const getAllTask = async():Promise<Task[]> => {
        try {

            let userId = "";
            if(!authStore.user?.username) {
                const user = authStore.user;
                userId = user.username
            }else{
                userId = authStore.user?.username
            }
            if(!userId) return
            await getMyTask();
            const tasks = await $axios.$post('/docpal/workflow/tasks/user', {
                userId
            });
            return tasks.concat(myTask.value)
        } catch (error) {
            console.log(error)
            return []
        }
    }

    const claimTaskForMe = async(taskId:string) => {
        let userId = "";

        if(!authStore.user?.username) {
            const user = authStore.user;
            userId = user.userId
        }else{
            userId = authStore.user?.username
        }
        if(!userId) return
        await $axios.$post('/docpal/workflow/task/claim', {
            taskId, userId
        });
    }

    const getTask = async(taskId:string) => await $axios.$post('/docpal/workflow/task', { taskId })
    const getTaskByProcessInstanceId = async(processInstanceId:string) => await $axios.$get('/docpal/workflow/task', { params: {processInstanceId} })
    const deleteTask = async(param: Object) => {
        try{
            const response = await $axios.$delete('/docpal/workflow/task', {data: param});
            return response
        }catch(err){
            return null
        }
    }
    const getFormProperties = async(taskId:string) => {
        try {
            const response = await $axios.$post('/docpal/workflow/properties', { taskId })
            return response
        } catch (error) {
            // handle error
            return []
        }
    }
    const saveProperties = async(param) => {
        try {
            const response = await $axios.$post('/docpal/workflow/properties/save', param)
            return response
        } catch (error) {
            // handle error
            return error.response.data
        }
    }
    const formSubmit = async(param) => {
        try {
            const response = await $axios.$post('/docpal/workflow/form/submit', param)
            return response || true
        } catch (error) {
            // return error.response.data
            return null
        }
    }

    const getActivity = async(processInstanceId:string) => {
        try {

            const response = await $axios.$post('/docpal/workflow/history/activity', { processInstanceId, pageSize:-1 })

            return response.list.filter(i => i.activityName).reverse()
        } catch (error) {
            console.log(error);
        }
    }
    const setDueDate = async(taskId:string, dueDate:string) => {
        await $axios.$post('/docpal/workflow/task/dueDate',{
            taskId,
            dueDate
        })
    }
    const taskClaim = async(taskId:string, userId: string) => {
        try {
            const response = await $axios.$post('/docpal/workflow/task/claim', { taskId, userId })
            Message.success('Task Claimed');
            const newDate = dayjs().add(2, 'days').toISOString();
            await setDueDate(taskId, newDate);
            return response
        } catch (error) {
            return error.response.data
        }
    }

    const taskUnClaim = async(taskId:string) => {
        const response = await $axios.$post('/docpal/workflow/task/unclaim', { taskId })
        Message.success('Task Unclaimed');
        return response
    }

    const taskCancelApi = async(param) => {
        try {
            const response = await $axios.$delete('/docpal/workflow/process/deleteProcessInstanceByCreator', { params: param })
            Message.success(`${i18n.t('commons_success')}`);
            return response
        } catch (error) {
            Message.error(`${i18n.t('commons_error')}`);
            return null
        }
    }

    const sendTaskComment = async(param) => {
        const response = await $axios.$post('/docpal/workflow/task/comment', param)
        Message.success('Message Post Success');
        return response
    }
    const getTaskComment = async(taskId:string) => {
        try {
            const response = await $axios.$post('/docpal/workflow/task/comments', { taskId })
            return response
        } catch (error) {
            // handle error
            return []
        }
    }
    const getProcessCommentApi = async(processInstanceId: string) => {
        const response = await $axios.$get('/docpal/workflow/comment/process', {params: { processInstanceId }})
        return response
    }
    const sendProcessCommentsApi = async(params) => {
        try {
            const response = await $axios.$post('/docpal/workflow/comment/process', {}, {params})
            return response
        } catch (error) {
            // handle error
            return []
        }
    }

    const getUserId = () => {
        let userId = "";
        if(!authStore.user?.username) {
            const user = authStore.user;
            userId = user.userId
        }else{
            userId = authStore.user?.username
        }
        userIdRef.value = userId
    }

    // #region module: attachment
    const attachmentInfoGetApi = async(attachmentId) => {
        try {
            const response = await $axios.$get(`/docpal/workflow/task/attachment/info?attachmentId=${attachmentId}`)
            return response
        } catch (error) {
            // handle error
            return false
        }
    }
    const attachmentGetApi = async(attachmentId) => {
        try {
            const response = await $axios.$get(`/docpal/workflow/task/attachment?attachmentId=${attachmentId}`, { responseType: 'blob'})
            return response
        } catch (error) {
            // handle error
            return false
        }
    }
    const attachmentPreviewGetApi = async(attachmentId) => {
        try {
            const response = await $axios.$get(`/docpal/workflow/task/attachment/preview?attachmentId=${attachmentId}`, { responseType: 'blob'})
            return response
        } catch (error) {
            // handle error
            return false
        }
    }
    const attachmentPostApi = async(attachmentId) => {
        try {
            const response = await $axios.$post(`/docpal/workflow/task/attachment?attachmentId=${attachmentId}`)
            return response
        } catch (error) {
            // handle error
            return false
        }
    }
    const attachmentPutApi = async(param) => {
        try {
            const response = await $axios.$put('/docpal/workflow/task/attachment', param)
            return response
        } catch (error) {
            // handle error
            return false
        }
    }
    const attachmentDeleteApi = async(attachmentId) => {
        try {
            const response = await $axios.$delete(`/docpal/workflow/task/attachment?attachmentId=${attachmentId}`)
            return response
        } catch (error) {
            // handle error
            return false
        }
    }

    const attachmentDownloadApi = async(idOrPath) => {
        try {
            const response = await $axios.$post('/nuxeo/document/attachment/download', { idOrPath })
            return response
        } catch (error) {
            // handle error
            Message.error(i18n.t('dpTip_downloadFailed') as string)
            return false
        }
    }

    const workflowFilesUploadApi = async(param: Object) => {
        try{
            const response = await $axios.$post('/docpal/workflow/files/upload',param);
            return response
        }catch(err){
            // Message.error(`${i18n.t('responseMsg_errorCode_2')}`)
            return null
        }
    }

    const taskFormJsonGetApi = async(param) => {
        try{
            const response = await $axios.$get('/docpal/relation/query', {params: param} );
            return response
        }catch(err){
            return err.response.data ? err.response.data : null
        }
    }
    // #endregion

    // history
    const taskCompleteGetApi = async(param) => {
        try{
            const response = await $axios.$post('/docpal/workflow/history/task', param );
            return response
        }catch(error){
            Message.error(i18n.t('commons_error') as string)
            return null
        }
    }
    const historyProcessGetApi = async(param) => {
        try{
            const response = await $axios.$post('/docpal/workflow/history/process', param );
            return response
        }catch(error){
            Message.error(i18n.t('commons_error') as string)
            return null
        }
    }
    const activeProcessGetApi = async(param) => {
        try{
            const response = await $axios.$post('/docpal/workflow/process/active', param );
            return response
        }catch(error){
            Message.error(i18n.t('commons_error') as string)
            return null
        }
    }
    const historyActivityGetApi = async(param) => {
        try{
            const response = await $axios.$post('/docpal/workflow/history/activity', param );
            return response
        }catch(error){
            Message.error(i18n.t('commons_error') as string)
            return null
        }
    }
    //
    const processStartApi = async(param) => {
        try{
            const response = await $axios.$post('/docpal/workflow/process/start', param );
            return response
        }catch(error){
            const msg = error.response?.data?.message ? error.response.data.message : i18n.t('commons_error') as string
            Message.error(msg)
            return null
        }
    }
    // #region module: Adhoc Approval
        const getAdHocHistory = async(documentId: string) => {
            const res = await $axios.$post(`/docpal/workflow/queryAdhocApprovalPage`,{
                documentId,
                "pageNum": 1,
                "pageSize": 100
            });
            return res.data;
        }
        const getAdHocPage = async(param) => {
            const res = await $axios.$post(`/docpal/workflow/queryAdhocApprovalPage`, param);
            return res.data;
        }
        const canAdhocApi = async(documentId) => {
            try{
                const response = await $axios.$get('/docpal/workflow/isDocumetIdCanStartAdhoc', {params: { documentId }} );
                return response.code === 200
            }catch(error){
                return false
            }
        }
        const startAdhocApi = async(params) => {
            try{
                const response = await $axios.$post('/docpal/workflow/process/start', params );
                return response
            }catch(error){
                Message.error(`${i18n.t('commons_error')}`);
                return null
            }
        }
        const canApprovalAdhocApi = async(documentId, userId) => {
            try{
                const response = await $axios.$get('/docpal/workflow/isDocumetIdCanApproval', {params: { documentId, userId }} );
                return response.code === 200
            }catch(error){
                Message.error(`${i18n.t('commons_error')}`);
                return false
            }
        }
        const auditAdhocApi = async(params) => {
            try{
                const response = await $axios.$post('/docpal/workflow/submitAdhocApproval', params );
                return response
            }catch(error){
                const errorMessage = error.response.body.message;
                if(errorMessage) {
                    Message.error(`${i18n.t(`adhoc_error_${errorMessage}`)}`);
                }else{
                    Message.error(`${i18n.t('commons_error')}`);
                }
                return null
            }
        }
    // #endregion

    const { isLogin } = useAuthStore();
    watch(() => isLogin, (bool) => {
        if (bool) {
            getUserId()
        }
    },{ immediate: true})

    return {
        myTask,
        getTasks,
        getMyTask,
        getAllTask,
        taskCompleteGetApi,
        filterDueDate,
        filterSameDueDate,
        getFromProperties,
        claimTaskForMe,

        getTask,
        getTaskByProcessInstanceId,
        deleteTask,
        getFormProperties,
        saveProperties,
        formSubmit,
        getActivity,
        taskClaim,
        taskUnClaim,
        taskCancelApi,

        sendTaskComment,
        getTaskComment,
        getProcessCommentApi,
        sendProcessCommentsApi,
        userIdRef,

        formatDate,

        attachmentInfoGetApi,
        attachmentGetApi,
        attachmentPreviewGetApi,
        attachmentPostApi,
        attachmentPutApi,
        attachmentDeleteApi,
        attachmentDownloadApi,
        workflowFilesUploadApi,

        // history
        taskFormJsonGetApi,
        historyProcessGetApi,
        historyActivityGetApi,
        activeProcessGetApi,

        processStartApi,

        canAdhocApi,
        startAdhocApi,
        canApprovalAdhocApi,
        auditAdhocApi,
        getAdHocHistory,
        getAdHocPage,


        // extra contetn
        extraWorkflow,
        getWorkflowList,
        isExtraWorkflow,
        avalibleWorkflowList,
    }
})
