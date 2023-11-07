import {useWorkflowGraph} from "../composables/useWorkflowGraph";
import { DefaultForm,  } from "./defaultFormObject";
import {createBooleanInput, createDateInput, createMultiLineInput, createSingleLineInput} from "./fieldConverter";
type FieldType = "single_line_input" | "multi_line_input" | "date" | "boolean" | "current_user" | "user_dropdown" | "user_group_dropdown" | "custom_dropdown" | "file" | "multiple_files"

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
        convertFunction: createSingleLineInput
    },
    user_dropdown: {
        label: "User Dropdown",
        value: "user_dropdown",
        options:{},
        convertFunction: createSingleLineInput
    },
    user_group_dropdown: {
        label: "User Group Dropdown",
        value: "user_group_dropdown",
        options:{},
        convertFunction: createSingleLineInput
    },
    custom_dropdown: {
        label: "Custom Dropdown",
        value: "custom_dropdown",
        options:{},
        convertFunction: createSingleLineInput
    },
    file: {
        label: "File",
        value: "file",
        options:{},
        convertFunction: createSingleLineInput
    },
    multiple_files: {
        label: "Multiple files",
        value: "multiple_files",
        options:{},
        convertFunction: createSingleLineInput
    }
    
}