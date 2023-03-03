import '../../../dp-components/typing/table'
export type TableColumnSetting = {
    [key:string] : TableColumnSettingItem
}

export type TableColumnSettingItem = {
    columns: TableColumnItem[],
    events: string[],
    options: TableColumnSettingOptions
}
export type TableColumnSettingOptions = {
    pageSize: number
}
export type TableColumnItem = {
    id?: string | any,
    property?: string,
    label?: string,
    sortable?:boolean,
    slot ?: string,
    align ?: string,
    width ?: string | number,
    defaultValue ?: any,
    headerAlign ?: string,
    isFilter ?: boolean,
    canNotDelete ?:boolean,
    prop?: string,
    type?: string
}
export type TableBase = {
    commands: any[]
}
export type TableBaseSetting = {
    [key:string] : TableBase
}
export enum TABLE {
    META_CAPTURE_PROFILE = "metaCaptureProfile",
    META_IMPORT_MAPPING = 'metaImportMapping',
    META_PROFILE_DIALOG = "metaProfileDialog",
    META_LIST = "metaList",
    META_DISPLAY_LIST = 'metaDisplayList',
    META_RELATED_LIST = 'metaRelatedList',
    CHILD_FORM = 'childForm',
    HIERARCHIAL_FORM = 'hierarchicalForm',
    SIMPLE_FORM = 'simpleForm',
    ADMIN_WORKFLOW = 'adminWorkflow',
    VERSION_POPOVER = 'versionPopOver',
    ALL_TASK = 'allTask',
    COMPLETE_TASK = 'completeTask',
    MY_TASK = 'myTask',
    SMART_FOLDER = 'smartFolder',
    FILE_REQUEST_DETAIL = 'fileRequestDetail',
    FILE_REQUEST_INDEX = 'fileRequestIndex',
    ADHOC_Submitted_TASK = 'adhocSubmittedTask',
    ADHOC_Approval_TASK = 'adhocApprovalTask',
    ADHOC_Completed_TASK = 'adhocCompletedTask',
    ACTIVE_TASK = 'activeTask',
    CLIENT_TRASH = 'trash'
}

export const defaultSetting: TableColumnSetting = {
    [TABLE.ALL_TASK] : {
        columns: [
            { id:1, label: 'table_name', property: 'taskName', sortable: true },
            { id:2, label: 'workflow_workflow', property: 'processDefinitionName', sortable: true, isFilter: true },
            { id:3, slot: 'status', property: 'status', label: 'common_status' },
            { id:4, slot: 'assignee', property: 'assignee', label: 'workflow_assignee' },
            { id:5, label: 'workflow_createDate', property: 'createDate', sortable: true },
            { id:6, label: 'workflow_dueDate', property: 'dueDate', sortable: true },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.META_CAPTURE_PROFILE]: {
        columns: [
            { label: 'dpTable_id', property: 'profileID', sortable: true },
            { label: 'dpTable_name', property: 'profileName' },
            { slot: 'action', property: 'action', label: 'dpTable_actions' }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.META_IMPORT_MAPPING] :{
        columns: [
            { label: 'docType_property', property: 'key', sortable: true },
            { label: 'table_label', property: 'label' },
            { slot: 'action', property: 'action', label: 'table.action' }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.META_PROFILE_DIALOG] :{
        columns: [
            { property: 'title', label: 'title' },
            { property: 'name', label: 'name' }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.META_LIST] : {
        columns: [
            { slot: 'icon' },
            { label: 'docType_documentType', property: 'name', sortable: true },
            { slot: 'metaMapping', label: 'docType_metaMapping' },
            { slot: 'metaProfile', label: 'docType_metaMapping', },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.META_DISPLAY_LIST] : {
        columns: [
            { label: 'docType_property', property: 'metaData', sortable: true },
            { label: 'form_vocabulary', property: 'vocabulary' },
            { label: 'form_length', property: 'length', align: 'right', width: '100' },
            { slot: 'isRequire', label: 'form_isRequire', property: 'isRequire', width: '100' },
            { slot: 'display', property: 'display', label: 'form_display' },
            { slot: 'action', property: 'action', label: 'table_action' }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.META_RELATED_LIST] : {
        columns: [
            { label: 'dpTable_documentType', property: 'type', sortable: true },
            { label: 'rightDetail_meta', property: 'meta' },
            { slot: 'action', property: 'action', label: 'table_actions' }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.CHILD_FORM] : {
        columns: [
            { property: 'id', label: 'id', slot: "id" },
            { property: 'label', label: 'dpTable_label' },
            { property: 'parentEntryID', label: 'parentEntryID', slot: "parentEntryID"},
            { property: 'obsolete', label: 'obsolete', slot: "obsolete", width: '100', align: 'center', headerAlign: 'center', defaultValue: false },
            { property: 'order', label: 'order', defaultValue: 0 }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.HIERARCHIAL_FORM]:{
        columns: [
            { property: 'id', label: 'id', slot: "id" },
            { property: 'label', label: 'dpTable_label' },
            { property: 'obsolete', label: 'obsolete', slot: "obsolete", width: '100', align: 'center', headerAlign: 'center', defaultValue: false },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.SIMPLE_FORM]: {
        columns: [
            { property: 'id', label: 'id', slot: "id" },
          { property: 'label', label: 'dpTable_label' },
          { property: 'obsolete', label: 'obsolete', slot: "obsolete", width: '100', align: 'center', headerAlign: 'center', defaultValue: false },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.ADMIN_WORKFLOW] : {
        columns: [
            { label: 'dpTable_selection', slot: 'selection', canNotDelete: true, },
            // { label: 'common.status', property: 'name', sortable: true, isFilter: true, type: 'tag' },
            // { slot: 'status', property: 'status', label: i18n.t('common_status') },
            { label: 'table_name', property: 'taskName', sortable: true },
            { label: 'workflow_workflow', property: 'processDefinitionName', sortable: true, isFilter: true },
            { label: 'role.creator', property: 'startUserId', sortable: true, isFilter: true },
            { label: 'workflow_assignee', slot: 'assignee', property: 'assignee' },
            // { slot: 'status', property: 'status', label: i18n.t('common_status') },
            // { slot: 'assignee', property: 'assignee', label: i18n.t('workflow_assignee')  },
            { label: 'workflow_createDate', property: 'createDate', sortable: true },
            { label: 'workflow_dueDate', property: 'dueDate', sortable: true },
            { label: 'dpTable_actions', slot: 'action', property: 'action' }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.VERSION_POPOVER] : {
        columns: [
            { label: 'file_versionNumber', property: 'version', sortable: true },
            { label: 'table_lastModified', property: 'time', sortable: true },
            { slot: 'action', property: 'action', label: 'table_action' }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.COMPLETE_TASK] : {
        columns: [
            { label: 'table_name', property: 'taskName', sortable: true },
            { slot: 'workflow', label: 'workflow_workflow', property: 'workflow' },
            // { label: 'workflow_workflow', property: 'name', sortable: true },
            { label: 'workflow_createDate', property: 'createDate', sortable: true },
            { label: 'table_completeDate', property: 'completeDate', sortable: true },
            { slot: 'duration', label: 'table_duration', property: 'duration' }
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.ACTIVE_TASK] : {
        columns: [
            { label: 'table_name', property: 'taskName', sortable: true },
            { slot: 'workflow', label: 'workflow_workflow', property: 'workflow' },
            { id:3, slot: 'status', property: 'status', label: 'common_status' },
            { id:4, slot: 'assignee', property: 'assignee', label: 'workflow_assignee' },
            { label: 'workflow_createDate', property: 'createDate', sortable: true },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.MY_TASK] : {
        columns: [
            { label: 'table_name', property: 'taskName', sortable: true },
            { label: 'workflow_workflow', property: 'processDefinitionName', sortable: true, isFilter: true },
            { slot: 'status', label: 'common_status', property: 'status', },
            { slot: 'assignee', label: 'workflow_assignee', property: 'assignee', },
            { label: 'workflow_createDate', property: 'createDate', sortable: true },
            { label: 'workflow_dueDate', property: 'dueDate', sortable: true },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.SMART_FOLDER] : {
        columns: [
            { slot: 'icon', property: 'isFolder' },
            { label: 'table_name', property: 'name', sortable: true },
            // { label: 'table_path', property: 'path', sortable: true },
            { label: 'table_modifiedDate', property: 'modifiedDate', sortable: true },
            { label: 'table_type', property: 'type', sortable: true },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.FILE_REQUEST_DETAIL] : {
        columns: [
            { slot: 'selection' },
            { slot: 'expand' },
            { label: 'dpDocument_fileName', property: 'initName', sortable: true },
            { slot: 'fileType', label: 'dpDocument_fileType', property: 'documentType', sortable: true },
            { slot: 'approve',label: 'dpTool_approve', property: 'approve', sortable: true, align: 'center' },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.FILE_REQUEST_INDEX] : {
        columns: [
            { label: 'dpTable_email', property: 'email', sortable: true },
            { label: 'dpTable_location', property: 'documentId', sortable: true },
            { label: 'dpTable_message', property: 'message', sortable: true },
            { label: 'dpTable_status', property: 'status', sortable: true, slot: 'status' },
            { label: 'dpTable_createdDate', property: 'createdDate', sortable: true },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.ADHOC_Submitted_TASK] : {
        columns: [
            { label: 'table_path', property: 'documentPath', sortable: true },
            // { label: 'info_version', property: 'documentStartVersion' },
            // { label: 'role.creator', property: 'user_creator_id', sortable: true, isFilter: true },
            { label: 'role.approvers', property: 'user_approver_id', sortable: true, isFilter: true },
            { label: 'workflow_createDate', property: 'createDate', sortable: true },
            // { label: 'table_completeDate', property: 'completeDate', sortable: true },
            // { slot: 'duration', label: 'table_duration', property: 'duration' }
            // { label: 'table_duration', property: 'duration', align:"right", sortable: true },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.ADHOC_Approval_TASK] : {
        columns: [
            { label: 'table_path', property: 'documentPath', sortable: true },
            { label: 'role.creator', property: 'user_creator_id', sortable: true, isFilter: true },
            { label: 'workflow_createDate', property: 'createDate', sortable: true },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.ADHOC_Completed_TASK] : {
        columns: [
            { label: 'table_path', property: 'documentPath', sortable: true },
            { label: 'info_version', property: 'documentApprovalVersion', align: 'right', width: '70' },
            { label: 'role.creator', property: 'user_creator_id', sortable: true, isFilter: true, width: '150' },
            { label: 'workflow_createDate', property: 'createDate', sortable: true, align: 'center', width: '130' },
            { label: 'role.approver', property: 'approvedBy', sortable: true, isFilter: true, width: '150' },
            { label: 'dpTable_approvedDate', property: 'approvedDate', sortable: true, align: 'center', width: '130' },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.ADHOC_Completed_TASK] : {
        columns: [
            { label: 'table_path', property: 'documentPath', sortable: true },
            { label: 'info_version', property: 'documentApprovalVersion', align: 'right', width: '70' },
            { label: 'role.creator', property: 'user_creator_id', sortable: true, isFilter: true, width: '150' },
            { label: 'workflow_createDate', property: 'createDate', sortable: true, align: 'center', width: '130' },
            { label: 'role.approver', property: 'approvedBy', sortable: true, isFilter: true, width: '150' },
            { label: 'dpTable_approvedDate', property: 'approvedDate', sortable: true, align: 'center', width: '130' },
        ],
        events: [],
        options: { pageSize: 20 }
    },
    [TABLE.CLIENT_TRASH] : {
        columns: [
            { id: '1', label: 'tableHeader_name', prop: 'name' },
            { id: '2', label: 'tableHeader_path', prop: 'logicalPath' },
            { id: '3', label: 'tableHeader_type', prop: 'type' },
            { id: '4', label: 'trash_deleteBy', prop: 'properties.principalName' },
            { id: '5', label: 'trash_date', prop: "properties.trashed_date" }
        ],
        events: ['delete', 'restored'],
        options: { pageSize: 20 }
    }
}
