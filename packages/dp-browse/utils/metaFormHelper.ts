let vformIndex = 1
export function getMetaApplyFormGridItem () {
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
                    "span": 20,
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
                    "span": 4,
                    "offset": 0,
                    "push": 0,
                    "pull": 0,
                    "responsive": false,
                    "md": 12,
                    "sm": 12,
                    "xs": 12,
                    "customClass": ["meta-button-flex-end"]
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
    const buttonObject = {
        "key": 92926,
        "type": "button",
        "icon": "button",
        "formItemFlag": false,
        "id": "button33665",
        "options": {
            "name": "button33665",
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
    const buttonId = new Date().valueOf() + vformIndex++
    buttonObject.key = buttonId
    buttonObject.id = 'button' + buttonId
    buttonObject.options.name = 'button' + buttonId
    return buttonObject
}
