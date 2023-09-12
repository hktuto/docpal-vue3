

import { API, InlineTool, InlineToolConstructorOptions } from '@editorjs/editorjs';
import './variableSelect.scss'
import * as Dom from '../utils/dom';
import {IconLink} from '../utils/icon.js';
import { SelectionUtils } from '../utils/selection';
const IconUnlink = IconLink;

type Nodes = {
    toolButtons?: HTMLElement;
    toolButtonLink?: HTMLElement;
    toolButtonUnlink?: HTMLElement;
    inputWrapper?: HTMLElement;
    inputField?: HTMLElement;
    loader?: HTMLElement;
    actionsWrapper?: HTMLElement;
    searchResults?: HTMLElement;
    searchItemWrapper?: HTMLElement;
    searchItem?: HTMLElement;
}

const DICTIONARY = {
    pasteOrSearch: 'Paste or search',
    pasteALink: 'Paste a link',
    searchRequestError: 'Cannot process search request because of',
    invalidServerData: 'Server responded with invalid data',
    invalidUrl: 'Link URL is invalid',
  };

const DEBOUNCE_TIMEOUT = 250;

export default class VariableSelect implements InlineTool {
    selection: SelectionUtils;

    static get shortcut() {
        return'CMD+l'
    };

    static get KEYS() {
        return {
            ENTER: 13,
            UP: 38,
            DOWN: 40,
        }
    }

    typingTimer!: NodeJS.Timeout;

    config!: { variables: string[]; };

    api!:API;

    nodes:Nodes;

    range?:Range;

    static get tagName () {
        return 'variable-select';
    }

    static get CSS() {
        return {
          iconWrapper: 'dp-variable-select__icon-wrapper',
    
          hidden: 'dp-variable-select__hidden',
    
          actionsWrapper: 'dp-variable-select__actions-wrapper',
    
          field: 'dp-variable-select__field',
          fieldLoading: 'dp-variable-select__field--loading',
          fieldInput: 'dp-variable-select__field-input',
    
          foundItems: 'dp-variable-select__items',
    
          searchItem: 'dp-variable-select__search-item',
          searchItemSelected: 'dp-variable-select__search-item--selected',
          searchItemName: 'dp-variable-select__search-item-name',
          searchItemDescription: 'dp-variable-select__search-item-description',
        };
    }


    static get isInline() {
        return true;
    }
    
    static get title() {
        return 'Select Variable';
    }

    constructor({api, config}: InlineToolConstructorOptions) {
        this.api = api;
        this.config = config || { variables: [] };
        this.selection = new SelectionUtils();
        this.nodes = {
            toolButtons: undefined,
            toolButtonLink: undefined,
            toolButtonUnlink: undefined,
            inputWrapper: undefined,
            inputField: undefined,
            loader: undefined,
            actionsWrapper: undefined,
            searchResults: undefined,
            searchItemWrapper: undefined,
            searchItem: undefined,
        };
    }


    surround(range: Range): void {
        // throw new Error('Method not implemented.');
        if(!this.nodes.actionsWrapper || !this.nodes.toolButtonUnlink) return;
        this.toggleVisibility(this.nodes.actionsWrapper, true);
        const isLinkSelected = this.nodes.toolButtonUnlink.classList.contains(this.api.styles.inlineToolButtonActive);

        this.selection.setFakeBackground();
        this.selection.save();

        this.range = range;

        if (!isLinkSelected && this.nodes.inputField && this.nodes.inputWrapper) {
            /**
             * Show focused input field
             */
            this.toggleVisibility(this.nodes.inputWrapper, true);
            this.nodes.inputField.focus();
          } else {
            const parentAnchor = this.selection.findParentTag(VariableSelect.tagName);

            this.selection.expandToTag(parentAnchor as HTMLElement);

            this.selection.removeFakeBackground();
            this.api.inlineToolbar.close();
          }
    }
    checkState(selection: Selection) {
        const text = selection.anchorNode;

        /**
         * Selection is empty
         */
        if (!text) {
            return;
        }
        const parentA = this.selection.findParentTag(VariableSelect.tagName);

        if (!parentA) {
            return;
          }
      
          this.toggleVisibility(this.nodes.actionsWrapper, true);

         /**
         * If link has name or description then show title wrapper
         */
        if (parentA.dataset.name || parentA.dataset.description) {
            this.toggleVisibility(this.nodes.linkDataTitleWrapper, true);
        }

        /**
         * Show 'unlink' icon
         */
        this.toggleVisibility(this.nodes.toolButtonLink, false);
        this.toggleVisibility(this.nodes.toolButtonUnlink, true);
        this.nodes.toolButtonUnlink.classList.add(this.api.styles.inlineToolButtonActive);
    }
    renderActions?(): HTMLElement {
        // throw new Error('Method not implemented.');
        console.log('renderActions')
        this.nodes.actionsWrapper = Dom.make('div', [ VariableSelect.CSS.actionsWrapper ]);
        this.toggleVisibility(this.nodes.actionsWrapper, false);

        this.nodes.inputWrapper = Dom.make('div', VariableSelect.CSS.field);
        this.nodes.inputField = Dom.make('input', VariableSelect.CSS.fieldInput, {
            placeholder: this.api.i18n.t(DICTIONARY.pasteALink),
          });

        this.nodes.inputWrapper.appendChild(this.nodes.inputField);
        this.toggleVisibility(this.nodes.inputWrapper, false);

        this.nodes.searchResults = Dom.make('div', VariableSelect.CSS.foundItems);
        this.nodes.searchResults.addEventListener('mouseenter', () => {
            const searchItems = this.getSearchItems() as HTMLElement[];
      
            searchItems.forEach((item:HTMLElement) => {
              item.classList.remove(VariableSelect.CSS.searchItemSelected);
            });
          });
        
        this.nodes.searchResults.addEventListener('click', (event:any) => {
            if(!event.target) return;
            const closestSearchItem = event.target?.closest(`.${VariableSelect.CSS.searchItem}`);
        
            /**
             * If click target search item is missing then do nothing
             */
            if (!closestSearchItem) {
                return;
            }
        
            /**
             * Preventing events that will be able to happen
             */
            event.preventDefault();
            event.stopPropagation();
        
            this.searchItemPressed(closestSearchItem);
        });
        
        return this.nodes.actionsWrapper;
    }
    

    /**
     * Create icon button on toolbar
     * @return {HTMLDivElement}
     * @public
     * @readonly
     */
    render(): HTMLElement {
        // create 
        this.nodes.toolButtons = Dom.make('button', this.api.styles.inlineToolButton);
        this.nodes.toolButtonLink = Dom.make('span', VariableSelect.CSS.iconWrapper, {
            innerHTML: IconLink,
          });
        this.nodes.toolButtons.appendChild(this.nodes.toolButtonLink);
    
        this.nodes.toolButtonUnlink = Dom.make('span', VariableSelect.CSS.iconWrapper, {
        innerHTML: IconUnlink,
        });
        this.toggleVisibility(this.nodes.toolButtonUnlink, false);
        this.nodes.toolButtons.appendChild(this.nodes.toolButtonUnlink);

        return this.nodes.toolButtons;
    }

    //#region  helper functions
    toggleVisibility(element:HTMLElement, isVisible = true) {
        /**
         * If not "isVisible" then add "hidden" class
         */
        element.classList.toggle(VariableSelect.CSS.hidden, !isVisible);
    }

    getSearchItems() {
        const nodesList = this.nodes.searchResults?.querySelectorAll(`.${VariableSelect.CSS.searchItem}`) || [] as HTMLElement[];

        return Array.from(nodesList);
    }

    searchItemPressed(element: HTMLElement) {
        if (!element.dataset || !element.dataset['variable']) {
            return;
          }
          const data = element.dataset['variable'];

          const newLink = this.selection.findParentTag(VariableSelect.tagName);

          const selectedText = this.range?.extractContents();
            if(!newLink || !selectedText || !this.range) return;

            const newTag = Dom.make(VariableSelect.tagName, [VariableSelect.CSS.searchItem]);
            newTag.dataset['variable'] = data;
            newTag.appendChild(selectedText);
            this.range.insertNode(newTag);
            this.api.selection.expandToTag(newTag);
          Object.keys(element.dataset).forEach(key => {
            if (key === 'variable') {
              return;
            }
      
            newLink.dataset[key] = element.dataset[key];
          });

          this.selection.collapseToEnd();
            this.api.inlineToolbar.close();
    }

    //#endregion

    clear?(): void {
        if (this.selection.isFakeBackgroundEnabled) {
            // if actions is broken by other selection We need to save new selection
            const currentSelection = new SelectionUtils();
      
            currentSelection.save();
      
            this.selection.restore();
            this.selection.removeFakeBackground();
            this.selection.clearSaved();
      
            // and recover new selection after removing fake background
            currentSelection.restore();
          }
    }
}
  
