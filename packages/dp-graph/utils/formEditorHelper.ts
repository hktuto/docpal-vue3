import {useWorkflowGraph} from "../composables/useWorkflowGraph";
import { DefaultForm,  } from "./defaultFormObject";
import {
    createApproveUserDropDown,
    createBooleanInput, createCurrentUserInput,
    createDateInput,
    createMultiLineInput,
    createSingleLineInput, createUserDropdownInput, createFileInput
} from "./fieldConverter";
type FieldType = "single_line_input" | "multi_line_input" | "date" | "boolean" | "current_user" | "user_dropdown" | "approve_user_dropdown"  | "file" 

export type FormObject = {
    attr_id: string,
    attr_name:string,
    attr_type: string,
    attr_readable?:boolean,
    attr_field_label:string,
    attr_field_writable?:boolean,
    attr_field_type: FieldType,
    attr_field_required?:boolean,
    attr_field_hidden?:boolean,
    attr_field_disabled?:boolean,
    attr_field_validate?:string,
    attr_field_valid: boolean,
    attr_field_default_value?: any,
    attr_target_step?: string,
    attr_file_limit?: number,
}


type FormJsonRequestBody = {
    jsonValue: string,
    processKey: string,
    userTaskId: string,
}
export const allFormToJson =():FormJsonRequestBody[] => {
    const {bpmnJson} = useWorkflowGraph()
    
    const process = bpmnJson.value.definitions.process;
    const processKey = process.attr_id;
    const userTasks = Array.isArray(process['userTask']) ? process['userTask'] : [process['userTask']];
    // loop userTasks and convert to formJSON
    const formJsonList:FormJsonRequestBody[] = [];
    userTasks.forEach((userTask:any) => {
        const userTaskId = userTask.attr_id;
        const formJson = bpmnStepToForm(userTask.extensionElements['flowable:formProperty'], userTask);
        formJsonList.push({
            jsonValue: JSON.stringify(formJson),
            processKey,
            userTaskId
        })
    })
    if(process['startEvent'] && process['startEvent'].extensionElements && process['startEvent'].extensionElements['flowable:formProperty']){
        const startEvent = process['startEvent'];
        const userTaskId = startEvent.attr_id;
        const formJson = bpmnStepToForm(startEvent.extensionElements['flowable:formProperty'], startEvent);
        formJsonList.push({
            jsonValue: JSON.stringify(formJson),
            processKey,
            userTaskId
        })
    }
    return formJsonList;
}
export const bpmnStepToForm = (step:FormObject[], form:any ) => {
    const baseForm = DefaultForm();
    baseForm.widgetList = [] ;
    step.forEach((formObject:FormObject) => {
        console.log(formObject.attr_field_type)
        const field = fieldOptions[formObject.attr_field_type].convertFunction(formObject)
        baseForm.widgetList.push(field)
    })
    
    return baseForm;
}


type Options = {
    label: string,
    value: string,
    options: any,
    convertFunction: (formObject: FormObject) => any
}
type FieldOptions = {
    [K in FieldType]: Options
}
export const fieldOptions:FieldOptions = {
    single_line_input: {
        label: 'Single line input',
        value: 'single_line_input',
        options:  {},
        convertFunction: createSingleLineInput
    },
    multi_line_input: {
        label: "Multi line input",
        value: "multi_line_input",
        options:{},
        convertFunction: createMultiLineInput
    },
    date: {
        label: "Date",
        value: "date",
        options:{},
        convertFunction: createDateInput
    },
    boolean: {
        label: "Boolean",
        value: "boolean",
        options:{},
        convertFunction: createBooleanInput
    },
    current_user: {
        label: "Current User",
        value: "current_user",
        options:{},
        convertFunction: createCurrentUserInput
    },
    user_dropdown: {
        label: "User Dropdown",
        value: "user_dropdown",
        options:{},
        convertFunction: createUserDropdownInput
    },
    approve_user_dropdown: {
        label: "Approve User Dropdown",
        value: "approve_user_dropdown",
        options:{
            attr_target_step: "string"
        },
        convertFunction: createApproveUserDropDown
    },
    file: {
        label: "File",
        value: "file",
        options:{
            attr_file_limit: "number"
        },
        convertFunction: createFileInput
    },
    
}