import {Ref} from "vue-demi";
import {BPMNJSON, ExclusiveGateway, ServiceTask, UserTask} from "../../types";
import {addBoundaryTask} from "../boundary";
import {linkSequenceFlow} from "../sequence";

export type ServiceType = "email" | "document" | "dueEmail";

/**
 * Adds a new service task to the given target ID with the specified type and BPMN JSON.
 *
 * @param {UserTask | ServiceTask | ExclusiveGateway} sourceData - The data of the source.
 * @param {ServiceType} [type="email"] - The type of the service task. Default is "email".
 * @param {Ref<BPMNJSON>} bpmnJson - The BPMN JSON.
 */
export const addNewServiceTask = (sourceData:UserTask | ServiceTask | ExclusiveGateway, type:ServiceType = "email", bpmnJson: Ref<BPMNJSON>) => {
    const newID = 'sig'+ new Date().getTime()
    let newService;
    switch(type){
        case 'email':
            newService = {...newEmail}
            break
        case 'document':
            newService = {...newDocument}
            break
        case 'dueEmail':
            newService = {...newEmail}
            break
    }
    newService.attr_id = newID
    // add task to bpmnJson
    if(Array.isArray(bpmnJson.value.definitions.process.serviceTask)){
        bpmnJson.value.definitions.process.serviceTask.push(newService)
    }else{
        bpmnJson.value.definitions.process.serviceTask = [bpmnJson.value.definitions.process.serviceTask,newService]
    }
    // sequenceFlow logic
    linkSequenceFlow(bpmnJson, sourceData, newService, type)

}

const newEmail:ServiceTask = {
    'attr_flowable:async': true,
    'attr_flowable:delegateExpression':"${sendNotificationDelegate}",
    'attr_flowable:exclusive':false,
    attr_id:"submitFormNotification",
    attr_name:"Email Notification",
    extensionElements:{
        'flowable:field': [
            {
                attr_name: "notificationType",
                'flowable:string' : {
                    __cdata: "notification.workflow-editor-submit"
                }
            },
        ]
    }
}

const newDocument:ServiceTask = {
    'attr_flowable:delegateExpression':"${generateDocumentDelegate}",
    'attr_flowable:exclusive':false,
    attr_id:"submitFormNotification",
    attr_name:"Generate Document",
    extensionElements:{
        'flowable:field': [
            {
                attr_name: "templateId",
                'flowable:expression' : {
                    __cdata: ""
                }
            },
            {
                attr_name:"parentPath",
                'flowable:expression' : {
                    __cdata: ""
                }
            },
            {
                attr_name:"variables",
                'flowable:expression' : {
                    __cdata: ""
                }
            },
            {
                attr_name:"documentType",
                'flowable:expression' : {
                    __cdata: ""
                }
            },
        ]
    }
}

