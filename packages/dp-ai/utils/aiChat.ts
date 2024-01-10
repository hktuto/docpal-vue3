export class aiChatRecord {
    public author: string;
    public createdDate: Date;
    public text: string | undefined;
    public id: string;
    public type: string;
    public searchResult: any
    constructor(params: AiChat.chatRecord){ //接收参数
        this.author = params.author
        if(params.text) this.text = params.text;
        this.type = params.type || 'question'
        this.searchResult = params.searchResult

        this.createdDate = new Date();
        this.id = params.id || this.createdDate.valueOf().toString();
    }
}
