import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Table from '@editorjs/table';
import NestedList from '@editorjs/nested-list';
import  Paragraph from '@editorjs/paragraph';
import VariableOptions from './VariableOptions';
import LinkInlineTool from './VariableLink';
export const useEditor = (editorId:string, data:any, variables:Ref<string[]> ) => {

    const editor = ref();
    function createEditor():void{
        editor.value = new EditorJS({
            holderId: editorId,
            autofocus: true,
            data:data.value,
            tools:{
                header: {
                    class: Header,
                    inlineToolbar: true,
                },
                list : {
                    class: NestedList,
                    inlineToolbar: true,
                },
                table:{
                    class: Table,
                    inlineToolbar: true,
                },
                link:{
                    class: LinkInlineTool,
                    config:{
                        variables: variables.value
                    }
                },
                paragraph: {
                    class: Paragraph,
                    inlineToolbar: true,
                },
                VariableOptions: {
                    class: VariableOptions,
                    config:{
                        variables: variables.value
                    }
                },
                
            },
            i18n:{
                messages:{
                    toolNames: {
                        "Text": "Text",
                        "Heading": "Heading",
                        "List": "List",
                        "Warning": "Warning",
                        "Checklist": "Checklist",
                        "Quote": "Quote",
                        "Delimiter": "Delimiter",
                        "Table": "Table",
                        "Link": "Link",
                        "Marker": "Marker",
                        "Bold": "Bold",
                        "Italic": "Italic",
                        "InlineCode": "InlineCode",
                    },
                    blockTunes: {
                        "delete": {
                            "Delete": "Delete"
                        },
                        "moveUp": {
                            "Move up": "Move up"
                        },
                        "moveDown": {
                            "Move down": "Move down"
                        }
                    },
                }
            },
            onChange: (api, event) => {
                
                const data = api.saver.save().then((outputData) => {
                    calculateVariable(outputData);
                });
            },
            onReady:() => {
                if(data.value.emailTemplateJson) {
                    const json = JSON.parse(data.value.emailTemplateJson);
                    // 不要渲染空的json
                    if(json.blocks.length > 0) {
                        setData(json);
                    }
                }
            }
        })
    }

    function dispose():void{
        editor.value?.destroy();
        editor.value = null;
    }

    function setData(data:any):void{
        editor.value?.render(data);
    }

    function calculateVariable(data:any) {
        const newVariable:string[] = [];
        for( const block of data.blocks) {
            var t = document.createElement('template');
            t.innerHTML = block.data.text;
            // found by tag name "var"
            const newsVars = t.content.querySelectorAll('a.ce-text-item');
            newsVars.forEach((variable) => {
                newVariable.push(variable.textContent as string);
            });
            const varLink = t.content.querySelectorAll('a.ce-link-item');
            // push data-url to variable
            varLink.forEach((variable) => {
                const dataURL = variable.getAttribute('data-url');
                const regex = /\${(.*?)}/g;
                const matches = dataURL?.match(regex);
                if(matches) {
                    matches.forEach((variable:any) => {
                        newVariable.push(variable.replace('${', '').replace('}', ''));
                    })
                }
            })
            // remove t from memory
            t.remove();
        }
        // get string if ${} in data.subject
        const regex = /\${(.*?)}/g;
        const matches = data.subject?.match(regex);
        if(matches) {
            matches.forEach((variable:any) => {
                newVariable.push(variable.replace('${', '').replace('}', ''));
            })
        }
        // variables.value = newVariable;
        // remove duplicate
        
        variables.value = [... new Set(newVariable)];
    }

    async function getData(){
        const data = await editor.value?.save();
        let html = '<html><body>'
        for( const block of data.blocks) {
            console.log(block.type)
            switch(block.type){
                case 'header':
                    html += `<h${block.data.level}>${htmlToString(block.data.text)}</h${block.data.level}>`;
                    break;
                case 'paragraph':
                    html += `<p>${htmlToString(block.data.text)}</p>`;
                    break;
                case 'list':
                    html += `<ul>${ block.data.items.map( (item:any) => `<li>${htmlToString(item.content)}</li>`) }</ul>`;
                    break;
                case 'table':
                    html += `<table>${blockToTable(block.data.content)}</table>`;
                    break;
            }
                
        }
        html += '</body></html>';
        return {
            html,
            json: data,
            variable: variables.value
        }
    }

    function blockToTable(block:any):string{
        let html = '';
        for( const row of block){
            html += '<tr>';
            for( const cell of row){
                html += `<td>${htmlToString(cell)}</td>`;
            }
            html += '</tr>';
        }
        return html;
    }

    function htmlToString(html:string):string{
        var t = document.createElement('template');
        t.innerHTML = html;  
        
        const varText = t.content.querySelectorAll('a.ce-text-item');
        // replace all var tag with span
        varText.forEach((variable) => {
            
            variable.replaceWith('<span  th:utext="${' + variable.textContent + '}"></span>');
        });
        const varLink = t.content.querySelectorAll('a.ce-link-item');

        varLink.forEach((variable) => {
            // variable.setAttribute('href', '${' + variable.getAttribute('data-url') + '}');
            // change href to th:href
            // chceck if data start with  http or https
            const dataURL = variable.getAttribute('data-url');
            if(dataURL?.startsWith('http') || dataURL?.startsWith('https')) {
                variable.replaceWith(`<a href="${variable.getAttribute('data-url')}">${variable.textContent} </a>`);
            } else {
                variable.replaceWith(`<a th:href="${variable.getAttribute('data-url')}">${variable.textContent} </a>`);
            }
        })
        var txt = document.createElement("textarea");
        txt.innerHTML = t.innerHTML;
        const stringHtml = txt.value;
        t.remove();
        txt.remove();
        // wrap html and body tag in stringHtml
        return stringHtml;
    }
    

    return {
        createEditor,
        dispose,
        setData,
        variables,
        getData
    }

    
}