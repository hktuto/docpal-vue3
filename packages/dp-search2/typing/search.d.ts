
declare namespace Search {
	type suggestionOption = {
        label: string,
        key: string,
        optionLabel: string,
        optionValue: string,
        children: suggestionOption[]
    }
    interface suggestionItem {
        name : string,
        label : string,
        filter? : boolean,
        keywords? : string[],
        optionItems : suggestionOption[],
    }
}
