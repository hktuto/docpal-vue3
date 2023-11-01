export const  fieldType = ["single line input" , "multi line input","date","file"]
export type FormObject = {
    attr_id: string,
    attr_name:string,
    attr_type: string,
    attr_readable?:boolean,
    attr_fieldType: typeof fieldType[number],
    attr_required?:boolean,
    attr_validate?:string,
    attr_default_value?: any,
}
export const bpmnStepToForm = (step:FormObject[] ) => {
    const baseForm = {
        cols:[]
    };
    console.log(step);
    step.forEach((formObject:FormObject) => {
        switch(formObject.attr_fieldType){
            case "single line input":
                baseForm.cols.push(createSingleLineInput(formObject));
                break;
            case "multi line input":
                baseForm.cols.push(createMultiLineInput(formObject));
                break;
            case "date":
                baseForm.cols.push(createDateInput(formObject));
                break;
            case "file":
                baseForm.cols.push(createFileInput(formObject));
                break;
            case "dropdown":
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