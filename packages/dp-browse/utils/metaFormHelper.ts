let vformIndex = 1
export function getMetaApplyFormGridItem (colSpan1: number = 20, colSpan2: number = 4, customClass:string[] = ["meta-button-flex-end"]) {
    const gridItem = {
        "key": 1000000000000000,
        "type": "grid",
        "category": "container",
        "icon": "grid",
        "cols": [
            {
                "type": "grid-col",
                "category": "container",
                "icon": "grid-col",
                "internal": true,
                "widgetList": [],
                "options": {
                    "name": "gridCol10000000001",
                    "hidden": false,
                    "span": colSpan1,
                    "offset": 0,
                    "push": 0,
                    "pull": 0,
                    "responsive": false,
                    "md": 12,
                    "sm": 12,
                    "xs": 12,
                    "customClass": ""
                },
                "id": "grid-col-10000000001"
            },
            {
                "type": "grid-col",
                "category": "container",
                "icon": "grid-col",
                "internal": true,
                "widgetList": [],
                "options": {
                    "name": "gridCol10000000002",
                    "hidden": false,
                    "span": colSpan2,
                    "offset": 0,
                    "push": 0,
                    "pull": 0,
                    "responsive": false,
                    "md": 12,
                    "sm": 12,
                    "xs": 12,
                    customClass
                },
                "id": "grid-col-10000000002"
          }
        ],
        "options": {
            "name": "grid-options-1000000000000000",
            "hidden": false,
            "gutter": 12,
            "colHeight": null,
            "customClass": []
        },
        "id": "grid-1000000000000000"
    }
    const gridId = new Date().valueOf() + vformIndex++
    gridItem.key = gridId
    gridItem.id = 'grid' + gridId
    gridItem.options.name = 'grid' + gridId
    gridItem.cols.forEach(colsItem => {
        const colId = new Date().valueOf() + vformIndex++
        colsItem.id = 'col' + colId
        colsItem.options.name = 'col' + colId
    });
    return gridItem
}
export function getMetaApplyButton (widgetName: string) {
    const buttonId = new Date().valueOf() + vformIndex++
    const buttonObject = {
        "key": buttonId,
        "type": "button",
        "icon": "button",
        "formItemFlag": false,
        "id": 'button' + buttonId,
        "options": {
            "name": 'button' + buttonId,
            // @ts-ignore
            "label": $t('dpButtom_apply'),
            "columnWidth": "200px",
            "size": "",
            "displayStyle": "block",
            "disabled": false,
            "hidden": false,
            "type": "",
            "plain": false,
            "round": false,
            "circle": false,
            "icon": null,
            "customClass": "",
            "onCreated": "",
            "onMounted": "",
            "onClick": `const name = '${widgetName}'\nconst value = this.getWidgetRef(name).getValue()\nconst vform = this.getFormRef()\nvform.$emit('emit', 'handleApply', {\n  name,\n  value\n})`
        }
    }
    return buttonObject
}
export function getMetaAISlot (widgetName: string) {
    const slotId = new Date().valueOf() + vformIndex++
    const slotObject = {
        "key": slotId,
        "type": "slot",
        "icon": "slot-field",
        "formItemFlag": false,
        "id": 'slot' + slotId,
        "options": {
            "name": 'slot-' + widgetName,
            "label": 'slot-' + widgetName,
            "hidden": false
        }
    }
    return slotObject
}