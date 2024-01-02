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
            label: 'search.documentType',
            filter: true,
            keywords: ['type', $t('search.documentType')],
            optionItems: await GetSTypesApi()
        },
        collections: {
            name: 'collections', 
            label: 'search.collections',
            filter: true,
            keywords: ['collections', $t('search.collections')],
            optionItems: await GetSCollectionsApi()
        },
        tags: {
            name: 'tags', 
            label: 'search.tags',
            filter: true,
            keywords: ['tags', $t('search.tags')],
            optionItems: await GetSTagsApi()
        },
        creator: { 
            name: 'creator', 
            label: 'search.authors',
            filter: true,
            keywords: ['creator', $t('search.authors')],
            optionItems: await GetUsersAndGroupsApi()
        },
        authors: { 
            name: 'authors', 
            label: 'search.contributors',
            filter: true,
            keywords: ['authors', $t('search.contributors')],
            optionItems: await GetUsersAndGroupsApi()
        },
        modified: { 
            name: 'modified', 
            label: 'search.modificationDate',
            keywords: ['modified', $t('search.modificationDate')],
            optionItems: await GetSModifiedDateApi(),
            max: 1
        },
        size: { 
            name: 'size', 
            label: 'search.size',
            keywords: ['size', $t('search.size')],
            optionItems: await GetSSizeApi(),
            max: 1
        }
    }
    let result = { ...normal }
    if(assetType) {
        const dynamic: Search.conditionMap = {
            width: { 
                name: 'width', 
                label: 'search.width',
                keywords: ['width', $t('search.width')],
                optionItems: await GetSearchExtendsApi(assetType, 'width'),
            },
            height: { 
                name: 'height', 
                label: 'search.hight',
                keywords: ['height', $t('search.hight')],
                optionItems: await GetSearchExtendsApi(assetType, 'height'),
            },
            duration: { 
                name: 'duration', 
                label: 'search.duration',
                keywords: ['duration', $t('search.duration')],
                optionItems: await GetSearchExtendsApi(assetType, 'duration'),
            },
            mimeType: {
                name: 'mimeType', 
                label: 'search.mimeType',
                keywords: ['mimeType', $t('search.mimeType')],
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