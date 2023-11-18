import {
    SingleInputField,
    MultiLineInputField,
    DateInputField,
    DateTodayField,
    BooleanField,
    FileInputField,
    CurrentUserInputField,
    CurrentUserNameInputField,
    UserSelectField,
    GetApproveUserList
} from './fields'
import {createFieldOptions} from "./utils";

export const fields: {[key:string] : FieldOption} = {
    single_line_input: {
        group: 'input',
        label: 'Single line input',
        value: 'single_line_input',
        options: {},
        convertFunction: (fieldOption: FieldConverterOption) => {
            const field = SingleInputField();
            return createFieldOptions(field, fieldOption)
        }
    },
    multi_line_input: {
        group: 'input',
        label: "Multi line input",
        value: "multi_line_input",
        options: {},
        convertFunction: (fieldOption: FieldConverterOption) => {
            const field = MultiLineInputField();
            return createFieldOptions(field, fieldOption)
        }
    },
    date: {
        group: 'date',
        label: "Date",
        value: "date",
        options: {},
        convertFunction: (fieldOption: FieldConverterOption) => {
            const field = DateInputField();
            return createFieldOptions(field, fieldOption)
        }
    },
    today: {
        group: 'date',
        label: "Today",
        value: "today",
        options: {},
        convertFunction: (fieldOption: FieldConverterOption) => {
            const field = DateTodayField();
            return createFieldOptions(field, fieldOption)
        }
    },
    current_user: {
        group: 'user',
        label: "Current User",
        value: "current_user",
        options: {},
        convertFunction: (fieldOption: FieldConverterOption) => {
            const field = CurrentUserInputField();
            return createFieldOptions(field, fieldOption)
        }
    },
    current_user_name: {
        group: 'user',
        label: "Current User Name",
        value: "current_user_name",
        options: {},
        convertFunction: (fieldOption: FieldConverterOption) => {
            const field = CurrentUserNameInputField();
            return createFieldOptions(field, fieldOption)
        }
    },
    user_dropdown: {
        group: 'user',
        label: "User Dropdown",
        value: "user_dropdown",
        options: {},
        convertFunction: (fieldOption: FieldConverterOption) => {
            const field = UserSelectField();
            return createFieldOptions(field, fieldOption)
        }
    },
    approve_user_dropdown:{
        group: 'user',
        label: 'Approve User Dropdown',
        value: 'approve_user_dropdown',
        options: {},
        convertFunction: (fieldOption: FieldConverterOption) => {
            const field = UserSelectField();
            field.options.onMounted = GetApproveUserList(fieldOption.formData.attr_id, fieldOption.userApprove);
            return createFieldOptions(field, fieldOption)
        }
    },
    boolean: {
        group: 'data',
        label: "Boolean",
        value: "boolean",
        options: {},
        convertFunction: (fieldOption: FieldConverterOption) => {
            const field = BooleanField();
            return createFieldOptions(field, fieldOption)
        }
    },
    file: {
        group: 'data',
        label: "File",
        value: "file",
        options: {},
        convertFunction: (fieldOption: FieldConverterOption) => {
            const field = FileInputField();
            field.limit = fieldOption.fileLimit || 0;
            return createFieldOptions(field, fieldOption)
        }
    }
}


export const fieldGroup:FieldGroup[] = Object.values(fields).reduce((acc:FieldGroup[], field:FieldOption) => {
    const group = acc.find((item:FieldGroup) => item.value === field.group)
    if(group) {
        group.options.push(field)
    } else {
        acc.push({
            label: field.group,
            value: field.group,
            options: [field]
        })
    }
    return acc
}, [])



export type FieldConverterOption = {
    id:string,
    name:string,
    label: string,
    readable?:boolean,
    writable?:boolean,
    required?:boolean,
    hidden?:boolean,
    disabled?:boolean,
    defaultValue?:any,
    numberStep?:string, // for number input
    fileLimit?:number, // for file input
    userApprove?:string, // for approval user dropdown
    formData?:any
}

export type FieldGroup = {
    label: string,
    value: string,
    options: any
}

export type FieldOption = {
    group: string,
    label:string,
    value: string,
    options:{},
    convertFunction: (formObject: FieldConverterOption) => any
}