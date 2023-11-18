
import { fields, DefaultForm  } from 'dp-form'
import type { FieldConverterOption, } from "dp-form";


export type FormObject = {
    attr_id: string,
    attr_name:string,
    attr_type: string,
    attr_readable?:boolean,
    attr_field_label:string,
    attr_field_writable?:boolean,
    attr_field_type: string,
    attr_field_required?:boolean,
    attr_field_hidden?:boolean,
    attr_field_disabled?:boolean,
    attr_field_validate?:string,
    attr_field_valid: boolean,
    attr_field_default_value?: any,
    attr_target_step?: string,
    attr_file_limit?: number,
}


export const bpmnStepToForm = (step:FormObject[], form:any ) => {
    const baseForm = DefaultForm();
    baseForm.widgetList = [] ;
    step.forEach((formObject:FormObject) => {
        // make FormObject to fieldOption
        const option = bpmnOptionToFormCreatorOption(formObject, form)

        if(!fields[formObject.attr_field_type]) {
            console.log('not found', formObject.attr_field_type)
            return;
        }
        const field = fields[formObject.attr_field_type].convertFunction(option)
        baseForm.widgetList.push(field)
    })
    
    return baseForm;
}

export const bpmnOptionToFormCreatorOption = (step:FormObject, form:any ):FieldConverterOption => {
    return {
        id: step.attr_id,
        name: step.attr_name,
        label: step.attr_field_label,
        required: step.attr_field_required,
        hidden: step.attr_field_hidden,
        disabled: step.attr_field_disabled,
        defaultValue: step.attr_field_default_value,
        numberStep: step.attr_target_step,
        fileLimit: step.attr_file_limit,
        userApprove: step.attr_target_step,
        formData: form
    }
}

