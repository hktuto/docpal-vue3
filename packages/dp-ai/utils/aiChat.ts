export class aiChatRecord {
    public author: string;
    public createdDate: Date;
    public question: string | undefined;
    public answer: string | undefined;
    public id: string;
    public type: string;
    public searchResult: any
    constructor(params: AiChat.chatRecord){ //接收参数
        this.author = params.author
        if(params.question) this.question = params.question;
        if(params.answer) this.answer = params.answer;
        this.type = params.type || 'question'
        this.searchResult = params.searchResult

        this.createdDate = new Date();
        this.id = params.id || this.createdDate.valueOf().toString();
    }
}
