export const  fieldType = [
    "Single line input" , 
    "Multi line input",
    "Date",
    "User Dropdown",
    "User Group Dropdown",
    "Custom Dropdown",
    "File", 
    "Multiple files"
]
export type FormObject = {
    attr_id: string,
    attr_name:string,
    attr_type: string,
    attr_readable?:boolean,
    attr_field_label:string,
    attr_field_writable?:boolean,
    attr_field_type: typeof fieldType[number],
    attr_field_required?:boolean,
    attr_field_validate?:string,
    attr_field_valid: boolean,
    attr_field_default_value?: any,
}
export const bpmnStepToForm = (step:FormObject[] ) => {
    const baseForm = {
        cols:[]
    };
    step.forEach((formObject:FormObject) => {
        switch(formObject.attr_fieldType){
            case "Single line input":
                baseForm.cols.push(createSingleLineInput(formObject));
                break;
            case "Multi line input":
                baseForm.cols.push(createMultiLineInput(formObject));
                break;
            case "Date":
                baseForm.cols.push(createDateInput(formObject));
                break;
            case "File":
                baseForm.cols.push(createFileInput(formObject));
                break;
            case "Dropdown":
                baseForm.cols.push(createDropdownInput(formObject));
                break;
        }
    })
    
    return baseForm;
}

const createSingleLineInput = (fromObject: FormObject):any => {
    return{}
}

const createMultiLineInput = (fromObject: FormObject) => {
    return{}
}

const createDateInput = (fromObject: FormObject) => {
    return{}
}

const createFileInput = (fromObject: FormObject) => {
     return{}
}

const createDropdownInput = (fromObject: FormObject) => {
     return{}
}