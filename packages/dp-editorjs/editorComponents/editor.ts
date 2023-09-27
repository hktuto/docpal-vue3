import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Table from '@editorjs/table';
import NestedList from '@editorjs/nested-list';
import  Paragraph from '@editorjs/paragraph';
import VariableOptions from './variableOptions';

export const useEditor = (editorId:string, data:any, variable:Ref<string[]> ) => {

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
                paragraph: {
                    class: Paragraph,
                    inlineToolbar: true,
                },
                VariableOptions: {
                    class: VariableOptions,
                    config:{
                        variables: variable.value
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
                    setData(JSON.parse(data.value.emailTemplateJson));
                }
            }
        })
    }

    function dispose():void{
        editor.value?.destroy();
        editor.value = null;
    }

    function setData(data:any):void{
        console.log(editor.value, data)
        editor.value?.render(data);
    }

    function calculateVariable(data:any) {
        const newVariable:string[] = [];
        for( const block of data.blocks) {
            var t = document.createElement('template');
            t.innerHTML = block.data.text;
            // found by tag name "var"
            const variables = t.content.querySelectorAll('var');
            variables.forEach((variable) => {
                newVariable.push(variable.textContent as string);
            });
            // remove t from memory
            t.remove();
        }
        // remove duplicate
        
        // variable.value = [... new Set(newVariable)];
    }

    async function getData(){
        const data = await editor.value?.save();
        let html = '';
        for( const block of data.blocks) {
            switch(block.type){
                case 'header':
                    html += `<h${block.data.level}>${htmlToString(block.data.text)}</h${block.data.level}>`;
                    break;
                case 'paragraph':
                    html += `<p>${htmlToString(block.data.text)}</p>`;
                    break;
                case 'list':
                    html += `<ul>${ block.data.items.map( (item:string) => `<li>${htmlToString(item)}</li>`) }</ul>`;
                    break;
                case 'table':
                    html += `<table>${blockToTable(block.data.content)}</table>`;
                    break;
            }
                
        }
        return {
            html,
            json: data,
            variable: variable.value
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
        const variables = t.content.querySelectorAll('var');
        // replace all var tag with span
        variables.forEach((variable) => {
            variable.replaceWith('${' + variable.textContent + '}');
        });
        return t.innerHTML;
    }
    

    return {
        createEditor,
        dispose,
        setData,
        variable,
        getData
    }

    
}