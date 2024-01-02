import { 
    GetSTypesApi,
    GetUsersAndGroupsApi,
    GetSCollectionsApi,
    GetSTagsApi,
    GetSModifiedDateApi,
    GetSSizeApi,
    GetSearchExtendsApi
} from 'dp-api'
export async function getConditionStore(assetType?: string): Promise<Search.conditionMap> {
    const normal: Search.conditionMap = {
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
    let result = { ...normal }
    if(assetType) {
        const dynamic: Search.conditionMap = {
            width: { 
                name: 'width', 
                label: 'search_width',
                keywords: ['width', $t('search_width')],
                optionItems: await GetSearchExtendsApi(assetType, 'width'),
            },
            height: { 
                name: 'height', 
                label: 'search_hight',
                keywords: ['height', $t('search_hight')],
                optionItems: await GetSearchExtendsApi(assetType, 'height'),
            },
            duration: { 
                name: 'duration', 
                label: 'search_duration',
                keywords: ['duration', $t('search_duration')],
                optionItems: await GetSearchExtendsApi(assetType, 'duration'),
            },
            mimeType: {
                name: 'mimeType', 
                label: 'search_mimeType',
                keywords: ['mimeType', $t('search_mimeType')],
                optionItems: await GetSearchExtendsApi(assetType, 'mimeType'),
            }
        }
        switch (assetType) {
            case 'Video':
                result.duration = dynamic.duration
            case 'Picture':
                result.width = dynamic.width
                result.height = dynamic.height
            case 'Audio':
                result.mimeType = dynamic.mimeType
                break;
        
            default:
                break;
        }
    }
    return result
}
export function getSuggestKeywordList(conditionStore: Search.conditionMap): string[] {
    return Object.keys(conditionStore).reduce((prev: string[], key: string) => {
        const item = conditionStore[key]
        if (item.keywords) prev.push(...item.keywords)
        return prev
    }, [])
}

export function getSuggestList(conditionStore: Search.conditionMap): Search.suggestionOption[] {
    return Object.keys(conditionStore).reduce((prev: Search.suggestionOption[],key: string) => {
        const sItem = conditionStore[key]
        sItem.optionItems.forEach((pItem: Search.optionItem) => {
            if (pItem.children) {
                pItem.children.forEach((cItem: Search.optionItem) => {
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