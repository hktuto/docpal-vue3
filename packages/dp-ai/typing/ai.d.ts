declare namespace AiChat {
	interface chatRecord {
        author: string,
        question?: string,
        answer?: string,
        searchResult?: any,
        parentId?: string | any,
        id?: string | any,
        type?: 'search' | 'explain' | 'question' | 'loading' | 'notFound' | 'timeout',
        createdDate?: Date
    }
}
