import {DefaultForm } from './fields';
import {fields} from "./options";

export const formCreator =  (steps:any[]) => {
    const baseForm = DefaultForm();
    baseForm.widgetList = [] ;
    steps.forEach((step:any) => {
        const field = fields[step.type].convertFunction(step)
        baseForm.widgetList.push(field)
    })
    return baseForm;
}