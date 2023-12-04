

export type BPMNJSON = {
    definitions :{
        attr_exporter: string,
        attr_exporterVersion: string,
        attr_expressionLanguage: string,
        attr_targetNamespace: string,
        attr_typeLanguage: string,
        attr_workflowTemplate: string,
        attr_xmlns: string,
        [key : string]: any
    },
    process:{
        'attr_flowable:candidateStarterGroups': string
        attr_id: string
        attr_isExecutable: boolean
        attr_name: string
        boundaryEvent:BoundaryEvent | BoundaryEvent[],
        endEvent: EndEvent,
        exclusiveGateway: ExclusiveGateway | ExclusiveGateway[],
        sequenceFlow: SequenceFlow | SequenceFlow[],
        serviceTask: ServiceTask | ServiceTask[],
        startEvent: StartEvent,
        userTask: UserTask | UserTask[],
        [key : string]: any
    }

}
export type StartEvent = {
    'attr_flowable:formFieldValidation':boolean
    attr_id:"start"
    attr_name:"Start"
    extensionElements?: FormExtensionElements
}
export type BoundaryEvent = {
    attr_attachedToRef:string
    attr_cancelActivity:true
    attr_id: string
    type?:string,
    timerEventDefinition:{timeDuration: string}
}

export type EndEvent = {
    attr_id: 'end', attr_name: 'End'
}

export type ExclusiveGateway = {
    attr_id: string,
    approve?: boolean
    type?:string,
}

export type SequenceFlow = {
    attr_id: string, 
    attr_sourceRef: string, 
    attr_targetRef: string,
    type?:string,
    conditionExpression?:{
        attr_xsi:string,
        __cdata:string
    }
}

export type FormExtensionElements = {
    'flowable:formProperty': BpmnFormField[]
}

export type TemplateExtensionElements = {
    'flowable:field' : TemplateField[]
}

export type TemplateField = {
    attr_name:string,
    'flowable:expression'? :{
        __cdata:string
    }
    'flowable:string'? :{
        __cdata:string
    }
    attr_path ?:string // only for document template path
    attr_required?: string,
    attr_type?:string,
    [key : string]: any
}

export type BpmnFormField = {
    attr_field_disabled?:boolean
    attr_field_hidden?:boolean
    attr_field_label?:string
    attr_field_required?: boolean
    attr_field_type?:string
    attr_field_valid?:boolean
    attr_field_writable?:boolean
    attr_fixed?: boolean
    attr_id:string
    attr_name:string
    attr_type:string
    [key : string]: any
}

export type ServiceTask ={
    'attr_flowable:async'?:true
    'attr_flowable:delegateExpression':string
    'attr_flowable:exclusive'?:boolean
    attr_id:string
    attr_name:string
    type?:string,
    extensionElements?: TemplateExtensionElements
}

export type UserTask = {
    'attr_flowable:candidateGroups':string
    'attr_flowable:formFieldValidation':true
    attr_id:string
    attr_name:string
    type?:string,
    extensionElements: {
        'flowable:formProperty': BpmnFormField[],
        'flowable:taskListener': {
            attr_delegateExpression: "${autoAssignTaskListener}"
            attr_event:string
            'flowable:field': {
                attr_name:string,
                'flowable:expression': {
                    __cdata:string
                }
            }
        },
        [key : string]: any
    }

}
