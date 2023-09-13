import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Table from '@editorjs/table';
import NestedList from '@editorjs/nested-list';
import  Paragraph from '@editorjs/paragraph';
import VariableOptions from './variableOptions';

export const useEditor = (editorId:string, data:any, variable:Ref<string[]> ) => {

    const editor = ref();
    const editingVariable = ref<string[]>([]);

    function createEditor():void{
        editor.value = new EditorJS({
            holderId: editorId,
            autofocus: true,
            data,
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
                        /**
                         * Each subsection is the i18n dictionary that will be passed to the corresponded Block Tune plugin
                         * The name of a plugin should be equal the name you specify in the 'tunes' section for that plugin
                         *
                         * Also, there are few internal block tunes: "delete", "moveUp" and "moveDown"
                         */
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
        const variable:string[] = [];
        for( const block of data.blocks) {
            console.log(block);
        }
        editingVariable.value = variable;
    }
    

    return {
        createEditor,
        dispose,
        setData,
        variable
    }

    
}