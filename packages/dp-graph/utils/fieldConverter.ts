import {
    CurrentUserInputField,
    DateInputField, GetApproveUserList,
    MultiLineInputField,
    SelectInputField, SingleFileInputField,
    SingleInputField
} from "./defaultFormObject";
import {useWorkflowGraph} from "../composables/useWorkflowGraph";
import {FormObject} from "./formEditorHelper";

export const createSingleLineInput = (formObject: FormObject):any => {
    const field = SingleInputField();
    return createFieldOptions(field, {
        name: formObject.attr_id,
        label: formObject.attr_field_label,
        readonly: formObject.attr_field_writable,
        disabled: formObject.attr_field_disabled,
        hidden: formObject.attr_field_hidden,
        required: formObject.attr_field_required,
    })
}

export const createMultiLineInput = (formObject: FormObject) => {
    const field = MultiLineInputField();
    return createFieldOptions(field, {
        name: formObject.attr_id,
        label: formObject.attr_field_label,
        readonly: formObject.attr_field_writable,
        disabled: formObject.attr_field_disabled,
        hidden: formObject.attr_field_hidden,
        required: formObject.attr_field_required,
    })

}

export const createDateInput = (formObject: FormObject) => {
    const field= DateInputField();
    return createFieldOptions(field, {
        name: formObject.attr_id,
        label: formObject.attr_field_label,
        readonly: formObject.attr_field_writable,
        disabled: formObject.attr_field_disabled,
        hidden: formObject.attr_field_hidden,
        required: formObject.attr_field_required,
    })
}

export const createCurrentUserInput = (formObject: FormObject) => {
    const field= CurrentUserInputField();
    return createFieldOptions(field, {
        name: formObject.attr_id,
        label: formObject.attr_field_label,
        readonly: formObject.attr_field_writable,
        disabled: formObject.attr_field_disabled,
        hidden: formObject.attr_field_hidden,
        required: formObject.attr_field_required,
    });
}

export const createFileInput = (formObject: FormObject) => {
    const field = SingleFileInputField();
    field.options.limit = formObject.attr_file_limit || undefined;
    return createFieldOptions(field, {
        name: formObject.attr_id,
        label: formObject.attr_field_label,
        readonly: formObject.attr_field_writable,
        disabled: formObject.attr_field_disabled,
        hidden: formObject.attr_field_hidden,
        required: formObject.attr_field_required,
    });
}

export const createBooleanInput = (formObject: FormObject) => {
}
export const createApproveUserDropDown = (formObject: FormObject) => {
    const { bpmnJson } = useWorkflowGraph()
    const field = SelectInputField();
    field.options.onMounted = GetApproveUserList(bpmnJson.value.definitions.process.attr_id, formObject.attr_target_step);
    return createFieldOptions(field, {
        name: formObject.attr_id,
        label: formObject.attr_field_label,
        readonly: formObject.attr_field_writable,
        disabled: formObject.attr_field_disabled,
        hidden: formObject.attr_field_hidden,
        required: formObject.attr_field_required,
    });
}

export const createUserDropdownInput = (formObject: FormObject) => {
    const field= CurrentUserInputField();
    return createFieldOptions(field, {
        name: formObject.attr_id,
        label: formObject.attr_field_label,
        readonly: formObject.attr_field_writable,
        disabled: formObject.attr_field_disabled,
        hidden: formObject.attr_field_hidden,
        required: formObject.attr_field_required,
    });
}
type FormOptions = {
    readonly?: boolean,
    disabled?: boolean,
    hidden?: boolean,
    required?: boolean,
    name?: string,
    label?: string,
    [key:string]: any
}
function createFieldOptions(field:any, options:FormOptions)  {
    field.options = Object.assign(field.options, options)
    field.key = Date.now()
    field.id = 'form_' + field.options.name
    return field
}