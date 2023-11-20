import {FieldConverterOption} from "./options";


export const createFieldOptions = (field:any, options:FieldConverterOption) => {
    field.options = Object.assign(field.options, options)
    field.key = Date.now()
    field.id = 'form_' + field.options.name
    return field
}