import {Ref} from "vue-demi";
import {BPMNJSON, ServiceTask} from "../../types";
import {addBoundaryTask} from "../boundary";

export type ServiceType = "email" | "document" | "dueEmail";

/**
 * Adds a new service task to the given target ID with the specified type and BPMN JSON.
 *
 * @param {string} targetId - The ID of the target.
 * @param {ServiceType} [type="email"] - The type of the service task. Default is "email".
 * @param {Ref<BPMNJSON>} bpmnJson - The BPMN JSON.
 */
export const addNewServiceTask = (targetId:string, type:ServiceType = "email", bpmnJson: Ref<BPMNJSON>) => {
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
    // check if service task is array
    if(Array.isArray(bpmnJson.value.definitions.process.serviceTask)){
        bpmnJson.value.definitions.process.serviceTask.push(newService)
    }else{
        bpmnJson.value.definitions.process.serviceTask = [bpmnJson.value.definitions.process.serviceTask,newService]
    }
    if(type !== 'dueEmail') {
        // check if targetId has next step in SequenceFlow, if yes, rewrite the SequenceFlow to newID
        const otherToNode = bpmnJson.value.definitions.process.sequenceFlow.find(item => item.attr_sourceRef === targetId);
        if(otherToNode){
            otherToNode.attr_sourceRef = newID
        }
        bpmnJson.value.definitions.process.sequenceFlow.push({
            attr_sourceRef: targetId,
            attr_targetRef: newID
        })
    }else {
        addBoundaryTask(bpmnJson, newService, targetId)
    }
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

