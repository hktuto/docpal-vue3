import { 
    GetSTypesApi,
    GetUsersAndGroupsApi,
    GetSCollectionsApi,
    GetSTagsApi,
    GetSModifiedDateApi,
    GetSSizeApi,
} from 'dp-api'
export async function getConditionStore() {
    return {
        type :{ 
            name: 'type', 
            label: 'search_documentType',
            filter: true,
            keywords: ['type', $t('search_documentType')],
            optionItems: await GetSTypesApi()
        },
        collections: {
            name: 'collections', 
            label: 'search_collections',
            filter: true,
            keywords: ['collections', $t('search_collections')],
            optionItems: await GetSCollectionsApi()
        },
        tags: {
            name: 'tags', 
            label: 'search_tags',
            filter: true,
            keywords: ['tags', $t('search_tags')],
            optionItems: await GetSTagsApi()
        },
        creator: { 
            name: 'creator', 
            label: 'search_authors',
            filter: true,
            keywords: ['creator', $t('search_authors')],
            optionItems: await GetUsersAndGroupsApi()
        },
        authors: { 
            name: 'authors', 
            label: 'search_contributors',
            filter: true,
            keywords: ['authors', $t('search_contributors')],
            optionItems: await GetUsersAndGroupsApi()
        },
        modified: { 
            name: 'modified', 
            label: 'search_modificationDate',
            keywords: ['modified', $t('search_modificationDate')],
            optionItems: await GetSModifiedDateApi(),
            max: 1
        },
        size: { 
            name: 'size', 
            label: 'search_size',
            keywords: ['size', $t('search_size')],
            optionItems: await GetSSizeApi(),
            max: 1
        }
    }
}
export function getSuggestKeywordList(conditionStore: any): string[] {
    return Object.keys(conditionStore).reduce((prev: string[], key: string) => {
        const item = conditionStore[key]
        if (item.keywords) prev.push(...item.keywords)
        return prev
    }, [])
}

export function getSuggestList(conditionStore: any): Search.suggestionItem[] {
    return Object.keys(conditionStore).reduce((prev: any[],key: string) => {
        const sItem = conditionStore[key]
        sItem.optionItems.forEach((pItem: any) => {
            if (pItem.children) {
                pItem.children.forEach((cItem: any) => {
                    prev.push({
                        label: sItem.label,
                        key: sItem.name,
                        optionLabel: cItem.label,
                        optionValue: cItem.value
                    })
                })
            }
            else prev.push({
                label: sItem.label,
                key: sItem.name,
                optionLabel: pItem.label,
                optionValue: pItem.value
            })
        });
        return prev
    }, [])
}