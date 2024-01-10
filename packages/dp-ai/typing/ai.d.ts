declare namespace AiChat {
	interface chatRecord {
        author: string,
        text?: string,
        searchResult?: any,
        parentId?: string | any,
        id?: string | any,
        type?: 'search' | 'question' | 'odd' | 'loading',
        createdDate?: Date
    }
}
