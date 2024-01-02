/***
 * 不清楚什么时候用interface/type，能用 interface 实现，就用 interface , 如果不能就用 type
 */
declare namespace Search {
	interface suggestionOption {
        label: string,
        key: string,
        optionLabel: string,
        optionValue: string | any,
        children?: suggestionOption[]
    }
    interface optionItem {
        label: string | any,
        value?: string | number | boolean,
        children?: optionItem[]
    }
    interface conditionItem {
        name : string,
        label : string,
        filter? : boolean,
        keywords? : string[],
        max?: number,
        optionItems : optionItem[],
    }
    interface conditionMap {
        [name: string]: conditionItem
    }
}
