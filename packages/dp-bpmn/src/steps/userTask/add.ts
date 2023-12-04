import {Ref} from "vue-demi";
import {BPMNJSON, ExclusiveGateway, ServiceTask, UserTask} from "../../types";
import {linkSequenceFlow} from "../sequence";

export type UserType = "form" | "approve";
export const addUserTask = (sourceData:UserTask | ServiceTask | ExclusiveGateway, type:UserType = "form", bpmnJson:Ref<BPMNJSON>, isSourceExclusive: boolean = false, exclusiveData?: ExclusiveGateway) => {
    const newID = 'sig-user-'+ type +'-' + new Date().getTime()
    const newTask = {...newUserTask};
    newTask.attr_id = newID;
    newTask.attr_name = type;
    if(type === 'approve') {
        newTask.extensionElements['flowable:formProperty'].push({
            "attr_field_label": "Approve",
            "attr_field_type": "boolean",
            "attr_field_required": true,
            "attr_field_hidden": false,
            "attr_field_disabled": false,
            "attr_id": "approved",
            "attr_name": "Approve",
            "attr_type": "boolean",
            "attr_field_valid": true
        })
    }
    // add user task to bpmnJson
    if(Array.isArray(bpmnJson.value.definitions.process.userTask)){
        bpmnJson.value.definitions.process.userTask.push(newTask)
    }else{
        bpmnJson.value.definitions.process.userTask = [bpmnJson.value.definitions.process.userTask,newTask]
    }
    linkSequenceFlow(bpmnJson, sourceData, newTask, type)
    
}

const newUserTask:UserTask = {
    'attr_flowable:candidateGroups':"administrators",
    'attr_flowable:formFieldValidation':true,
    attr_id: "approvalForm",
    attr_name: "form",
    extensionElements:{
        'flowable:formProperty':[
                {
                    "attr_field_label": "label",
                    "attr_field_type": "single_line_input",
                    "attr_field_hidden": false,
                    "attr_field_disabled": true,
                    "attr_id": "businessKey",
                    "attr_name": "Business Key",
                    "attr_type": "string",
                    "attr_field_valid": true
                }
        ],
        'flowable:taskListener':{
            "flowable:field": {
                "flowable:expression": {
                    "__cdata": "${variables:get(user_approver_id)}"
                },
                "attr_name": "assignee"
            },
            "attr_delegateExpression": "${autoAssignTaskListener}",
            "attr_event": "create"
        },
        'modeler:activiti-idm-candidate-group':{
            "__cdata": "true",
            "attr_xmlns:modeler": "http://flowable.org/modeler"
        },
        'modeler:group-info-name-administrators':{
            "__cdata": "Administrators group",
            "attr_xmlns:modeler": "http://flowable.org/modeler"
        },
        "modeler:initiator-can-complete":{
            "__cdata": "false",
            "attr_xmlns:modeler": "http://flowable.org/modeler"
        }
    }
}

