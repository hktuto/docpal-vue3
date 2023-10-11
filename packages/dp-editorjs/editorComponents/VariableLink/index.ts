
/**
 * Import functions
 */
import * as Dom from '../utils/dom';
import { SelectionUtils } from '../utils/selection';
import { Utils } from '../utils/utils';
import { InlineTool, InlineToolConstructorOptions } from '@editorjs/editorjs';
import {IconLink, IconUnlink} from '@codexteam/icons'

/**
 * @typedef {object} SearchItemData
 * @property {string} href - link target
 * @property {string} name - link name
 * @property {string} description - link description
 */

const DICTIONARY = {
  pasteOrSearch: 'Search or add new',
  pasteALink: 'Search or add new',
  searchRequestError: 'Cannot process search request because of',
  invalidServerData: 'Server responded with invalid data',
  invalidUrl: 'Link URL is invalid',
};

/**
 * Timeout before search in ms after key pressed
 *
 * @type {number}
 */
const DEBOUNCE_TIMEOUT = 250;

/**
 * @typedef {string} NavDirection
 */
/**
 * Enum specifying keyboard navigation directions
 *
 * @enum {NavDirection}
 */
const NavDirection = {
  Next: 'Next',
  Previous: 'Previous',
};

/**
 * Link Autocomplete Tool for EditorJS
 */
export default class VariableLink implements InlineTool {
  api: any;
  config: any;
  selection: SelectionUtils;
  searchEndpointUrl: any;
  searchQueryParam: any;
  nodes: { toolButtons: HTMLElement | undefined; toolButtonLink:  HTMLElement | undefined; toolButtonUnlink:  HTMLElement | undefined; actionsWrapper:  HTMLElement | undefined; inputWrapper:  HTMLElement | undefined; inputField:  HTMLElement | undefined; searchResults:  HTMLElement | undefined; linkDataWrapper:  HTMLElement | undefined; linkDataTitleWrapper:  HTMLElement | undefined; linkDataName:  HTMLElement | undefined; linkDataDescription:  HTMLElement | undefined; linkDataURL:  HTMLElement | undefined; };
  tagName: string;
  KEYS: { ENTER: number; UP: number; DOWN: number; };
  typingTimer: null;
  /**
   * Specifies Tool as Inline Toolbar Tool
   *
   * @returns {boolean}
   */
  static get isInline() {
    return true;
  }

  /**
   * Sanitizer Rule
   * Leave <a> tags
   *
   * @returns {object}
   */
  static get sanitize() {
    return {
      var: true,
      a: true,
    };
  }

  /**
   * Title for hover-tooltip
   *
   * @returns {string}
   */
  static get title() {
    return 'Variable Link';
  }

  /**
   * Set a shortcut
   *
   * @returns {string}
   */
  get shortcut() {
    return 'CMD+L';
  }

  /**
   * @private
   *
   * @returns {object<string, string>} — keys and class names
   */
  static get CSS() {
    return {
      iconWrapper: 'ce-link-autocomplete__icon-wrapper',

      hidden: 'ce-link-autocomplete__hidden',

      actionsWrapper: 'ce-link-autocomplete__actions-wrapper',

      field: 'ce-link-autocomplete__field',
      fieldLoading: 'ce-link-autocomplete__field--loading',
      fieldInput: 'ce-link-autocomplete__field-input',

      foundItems: 'ce-link-autocomplete__items',

      searchItem: 'ce-link-autocomplete__search-item',
      searchItemSelected: 'ce-link-autocomplete__search-item--selected',
      searchItemName: 'ce-link-autocomplete__search-item-name',
      searchItemDescription: 'ce-link-autocomplete__search-item-description',

      linkDataWrapper: 'ce-link-autocomplete__link-data-wrapper',
      linkDataTitleWrapper: 'ce-link-autocomplete__link-data-title-wrapper',
      linkDataName: 'ce-link-autocomplete__link-data-name',
      linkDataDescription: 'ce-link-autocomplete__link-data-description',
      linkDataURL: 'ce-link-autocomplete__link-data-url',

      linkItem: 'ce-link-item',
    };
  }

  /**
   * Initialize basic data
   *
   * @param {object} options - tools constructor params
   * @param {object} options.config — initial config for the tool
   * @param {object} options.api — methods from Core
   */
  constructor({ config, api }:InlineToolConstructorOptions) {
    /**
     * Essential tools
     */
    this.api = api;
    this.config = config || {};
    this.selection = new SelectionUtils();

    /**
     * Config params
     */
    this.searchEndpointUrl = this.config.endpoint;
    this.searchQueryParam = this.config.queryParam;

    this.nodes = {
      toolButtons: undefined,
      toolButtonLink: undefined,
      toolButtonUnlink: undefined,

      actionsWrapper: undefined,
      inputWrapper: undefined,
      inputField: undefined,

      searchResults: undefined,

      linkDataWrapper: undefined,
      linkDataTitleWrapper: undefined,
      linkDataName: undefined,
      linkDataDescription: undefined,
      linkDataURL: undefined,
    };

    /**
     * Define tag name for a link element
     */
    this.tagName = 'A';

    /**
     * Key codes
     */
    this.KEYS = {
      ENTER: 13,
      UP: 38,
      DOWN: 40,
    };

    /**
     * Define debounce timer
     */
    this.typingTimer = null;
  }

  /**
   * Create element with buttons for toolbar
   *
   * @returns {HTMLDivElement}
   */
  render():HTMLElement {
    /**
     * Create wrapper for buttons
     *
     * @type {HTMLButtonElement}
     */
    this.nodes.toolButtons = Dom.make('button', this.api.styles.inlineToolButton);

    /**
     * Create Link button
     *
     * @type {HTMLSpanElement}
     */
    this.nodes.toolButtonLink = Dom.make('span', VariableLink.CSS.iconWrapper, {
      innerHTML: IconLink,
    });
    this.nodes.toolButtons.appendChild(this.nodes.toolButtonLink);

    /**
     * Create Unlink button
     *
     * @type {HTMLSpanElement}
     */
    this.nodes.toolButtonUnlink = Dom.make('span', VariableLink.CSS.iconWrapper, {
      innerHTML: IconUnlink,
    });
    this.toggleVisibility(this.nodes.toolButtonUnlink, false);
    this.nodes.toolButtons.appendChild(this.nodes.toolButtonUnlink);

    return this.nodes.toolButtons;
  }

  /**
   * Render actions element
   *
   * @returns {HTMLDivElement}
   */
  renderActions() {
    /**
     * Render actions wrapper
     *
     * @type {HTMLDivElement}
     */
    this.nodes.actionsWrapper = Dom.make('div', [ VariableLink.CSS.actionsWrapper ]);
    this.toggleVisibility(this.nodes.actionsWrapper, false);

    /**
     * Render input field
     *
     * @type {HTMLDivElement}
     */
    this.nodes.inputWrapper = Dom.make('div', VariableLink.CSS.field);
    this.nodes.inputField = Dom.make('input', VariableLink.CSS.fieldInput, {
      placeholder: this.api.i18n.t(DICTIONARY.pasteALink),
    });

    this.nodes.inputWrapper.appendChild(this.nodes.inputField);
    this.toggleVisibility(this.nodes.inputWrapper, false);

    /**
     * Render search results
     *
     * @type {HTMLDivElement}
     */
    this.nodes.searchResults = Dom.make('div', VariableLink.CSS.foundItems);
    /**
     * To improve UX we need to remove any 'selected' classes from search results
     */
    this.nodes.searchResults.addEventListener('mouseenter', () => {
      const searchItems = this.getSearchItems();

      searchItems.forEach(item => {
        item.classList.remove(VariableLink.CSS.searchItemSelected);
      });
    });
    /**
     * Enable search results click listener
     */
    this.nodes.searchResults.addEventListener('click', (event) => {
      const closestSearchItem = event.target.closest(`.${VariableLink.CSS.searchItem}`);

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

    /**
     * Listen to pressed enter key or up and down arrows
     */
    this.nodes.inputField.addEventListener('keydown', this.fieldKeydownHandler.bind(this));

    /**
     * Listen to input
     */
    this.nodes.inputField.addEventListener('input', this.fieldInputHandler.bind(this));

    /**
     * Render link data block
     */
    this.nodes.linkDataWrapper = Dom.make('div', VariableLink.CSS.linkDataWrapper);
    this.toggleVisibility(this.nodes.linkDataWrapper, false);

    this.nodes.linkDataTitleWrapper = Dom.make('div', VariableLink.CSS.linkDataTitleWrapper);
    this.nodes.linkDataWrapper.appendChild(this.nodes.linkDataTitleWrapper);
    this.toggleVisibility(this.nodes.linkDataTitleWrapper, false);

    this.nodes.linkDataName = Dom.make('div', VariableLink.CSS.linkDataName);
    this.nodes.linkDataTitleWrapper.appendChild(this.nodes.linkDataName);
    this.nodes.linkDataDescription = Dom.make('div', VariableLink.CSS.linkDataDescription);
    this.nodes.linkDataTitleWrapper.appendChild(this.nodes.linkDataDescription);

    this.nodes.linkDataURL = Dom.make('A', VariableLink.CSS.linkDataURL);
    this.nodes.linkDataWrapper.appendChild(this.nodes.linkDataURL);

    /**
     * Compose actions block
     */
    this.nodes.actionsWrapper.appendChild(this.nodes.inputWrapper);
    this.nodes.actionsWrapper.appendChild(this.nodes.searchResults);
    this.nodes.actionsWrapper.appendChild(this.nodes.linkDataWrapper);

    return this.nodes.actionsWrapper;
  }

  /**
   * Process keydown events to detect arrow keys or enter pressed
   *
   * @param {KeyboardEvent} event — keydown event
   * @returns {void}
   */
  fieldKeydownHandler(event) {
    const isArrowKey = [this.KEYS.UP, this.KEYS.DOWN].includes(event.keyCode);
    const isEnterKey = this.KEYS.ENTER === event.keyCode;

    /**
     * If key is not an arrow or enter
     */
    if (!isArrowKey && !isEnterKey) {
      return;
    }

    /**
     * Preventing events that will be able to happen
     */
    event.preventDefault();
    event.stopPropagation();

    /**
     * Choose handler
     */
    switch (true) {
        /**
         * Handle arrow keys
         */
      case isArrowKey: {
        const direction = event.keyCode === this.KEYS.DOWN ? NavDirection.Next : NavDirection.Previous;

        this.navigate(direction);
        break;
      }

        /**
         * Handle Enter key
         */
      case isEnterKey:
        this.processEnterKeyPressed();
        break;
    }
  }

  /**
   * Input event listener for a input field
   *
   * @param {KeyboardEvent} event — input event
   * @returns {void}
   */
  fieldInputHandler(event) {
    /**
     * Stop debounce timer
     */
    clearTimeout(this.typingTimer);

    /**
     * Get input value
     */
    const searchString = event.target.value;


    /**
     * Define a new timer
     */
    this.typingTimer = setTimeout(async () => {
      /**
       * Show the loader during request
       */
      try{
        this.toggleLoadingState(true);
        const items = await this.searchRequest(searchString);
        this.generateSearchList(items);
      } catch (e) {

      }

      this.toggleLoadingState(false);
    }, DEBOUNCE_TIMEOUT);
  }

  /**
   * Hides / shows loader
   *
   * @param {boolean} state - true to show
   * @returns {void}
   */
  toggleLoadingState(state) {
    this.nodes.inputWrapper.classList.toggle(VariableLink.CSS.fieldLoading, state);
  }

  /**
   * Navigate found items
   *
   * @param {NavDirection} direction - next or previous
   * @returns {void}
   */
  navigate(direction) {
    /**
     * Getting search items
     */
    const items = this.getSearchItems();
    const selectedItem = this.getSelectedItem();

    if (!items.length) {
      return;
    }

    /**
     * Next: index + 1
     * Prev: index - 1
     */
    const indexDelta = direction === NavDirection.Next ? 1 : -1;
    const selectedItemIndex = selectedItem ? items.indexOf(selectedItem) : -1;
    let nextIndex = selectedItemIndex + indexDelta;

    if (nextIndex > items.length - 1) {
      nextIndex = 0;
    } else if (nextIndex < 0) {
      nextIndex = items.length - 1;
    }

    if (selectedItem) {
      selectedItem.classList.remove(VariableLink.CSS.searchItemSelected);
    }

    items[nextIndex].classList.add(VariableLink.CSS.searchItemSelected);
  }

  /**
   * Process enter key pressing
   *
   * @returns {void}
   */
  processEnterKeyPressed() {
    /**
     * Try to get selected item
     *
     * @type {Element|null}
     */
    const selectedItem = this.getSelectedItem();

    /**
     * If any item was manually selected then process click on it
     */
    if (selectedItem) {
      this.searchItemPressed(selectedItem);

      return;
    }

    /**
     * Get input field value
     */
    const href = this.nodes.inputField.value;

    /**
     * If input field is empty then do nothing
     */
    if (!href || !href.trim()) {
      return;
    }



    /**
     * Get the first item from the search list
     * This item exists because input href is valid
     *
     * @type {Element}
     */
    const composedItem = this.getSearchItems()[0];

    /**
     * "Press" search item
     */
    this.searchItemPressed(composedItem);
  }

  /**
   * Get search items
   *
   * @returns {Element[]}
   */
  getSearchItems() {
    const nodesList = this.nodes.searchResults.querySelectorAll(`.${VariableLink.CSS.searchItem}`);

    return Array.from(nodesList);
  }

  /**
   * Find selected item
   *
   * @returns {Element|null}
   */
  getSelectedItem() {
    return this.nodes.searchResults.querySelector(`.${VariableLink.CSS.searchItemSelected}`);
  }

  /**
   * Remove search result elements
   *
   * @returns {void}
   */
  clearSearchList() {
    this.nodes.searchResults.innerHTML = '';
  }

  /**
   * Fill up a search list results by data
   *
   * @param {SearchItemData[]} items — items to be shown
   * @returns {void}
   */
  generateSearchList(items:any[] = []) {
    // TODO: generate list from config and input value
    /**
     * Clear list first
     */
    this.clearSearchList();

    /**
     * If items data is not an array
     */
    if (!Utils.isArray(items)) {

      return;
    }

    /**
     * If no items returned
     */
    if (items.length === 0) {
      return;
    }

    /**
     * Fill up search list by new elements
     */
    items.forEach(item => {
      const searchItem = Dom.make('div', [ VariableLink.CSS.searchItem ]);

      /**
       * Create a name for a link
       */
      const searchItemName = Dom.make('div', [ VariableLink.CSS.searchItemName ], {
        innerText: item.name || item.href,
      });

      searchItem.appendChild(searchItemName);

      /**
       * Create a description element
       */
      if (item.description) {
        const searchItemDescription = Dom.make('div', [ VariableLink.CSS.searchItemDescription ], {
          innerText: item.description,
        });

        searchItem.appendChild(searchItemDescription);
      }

      /**
       * Save all keys to item's dataset
       */
      Object.keys(item).forEach(key => {
        searchItem.dataset[key] = item[key];
      });

      this.nodes.searchResults.appendChild(searchItem);
    });
  }

  /**
   * Process 'press' event on the search item
   *
   * @param {Element} element - pressed item element
   * @returns {void}
   */
  searchItemPressed(element:any) {
    /**
     * If no useful dataset info was given then do nothing
     */
    if (!element.dataset || !element.dataset['href']) {
      return;
    }

    /**
     * Get link's href
     */
    let href = element.dataset['href'];
    // check include in variables
    // if yes wrap with ${}
    if( this.config.variables.find((item:any) => item === href) ) {
        href = '${' + href + '}';
    }
    /**
     * Restore origin selection
     */
    this.selection.restore();
    this.selection.removeFakeBackground();

    /**
     * Create a link by default browser's function
     */
    // document.execCommand('createLink', false, href);
    // const newTag = Dom.make(this.tagName, [VariableLink.CSS.searchItem]);
    // newTag.innerHTML = href;
    // newTag.dataset['href'] = href;
    // newTag.href = href;
    // this.selection.currentRange.insertNode(newTag);
    // document.execCommand('insertHtml', false, `<a href='${href}' class="${VariableLink.CSS.linkItem}">${href}</a>` )
    document.execCommand('createLink', false, href )
    // this.selection.savedSelectionRange.insertNode(newTag);
    // this.api.selection.expandToTag(newTag);
    /**
     * Get this link element
     */
    const newLink = this.selection.findParentTag(this.tagName);
    // if newLink exists, then add class
    if(newLink) {
      newLink.classList.add(VariableLink.CSS.linkItem);
      newLink.dataset.url = href;
    }
    /**
     * Fill up link element's dataset
     */


    /**
     * Collapse selection and close toolbar
     */
    this.selection.collapseToEnd();
    this.api.inlineToolbar.close();
  };

  /**
   * Handle clicks on the Inline Toolbar icon
   *
   * @param {Range} range — range to wrap with link
   * @returns {void}
   */
  surround(range) {
    if (!range) {
      return;
    }

    /**
     * Show actions wrapper
     */
    this.toggleVisibility(this.nodes.actionsWrapper, true);

    /**
     * Get result state after checkState() function
     * If tool button icon unlink is active then selected text is a link
     *
     * @type {boolean}
     */
    const isLinkSelected = this.nodes.toolButtonUnlink.classList.contains(this.api.styles.inlineToolButtonActive);
    /**
     * Create a fake selection
     */
    this.selection.currentRange = range;
    this.selection.setFakeBackground();
    this.selection.save();

    /**
     * Check if link is in the selection
     */
    if (!isLinkSelected) {
      /**
       * Show focused input field
       */
      this.toggleVisibility(this.nodes.inputWrapper, true);
      this.nodes.inputField.focus();
    } else {
      /**
       * Get the nearest link tag
       */
      const parentAnchor = this.selection.findParentTag(this.tagName);
      /**
       * Expand selection
       */
      this.selection.expandToTag(parentAnchor);
      // const text = range.extractContents();
      // range.insertNode(text);
      // parentAnchor?.remove();
      /**
       * Remove the link
       */
      document.execCommand('unlink');

      /**
       * Remove fake selection and close toolbar
       */
      this.selection.removeFakeBackground();
      this.api.inlineToolbar.close();
    }
  }

  /**
   * Check for a tool's state
   *
   * @param {Selection} selection — selection to be passed from Core
   * @returns {void}
   */
  checkState(selection) {
    const text = selection.anchorNode;

    /**
     * Selection is empty
     */
    if (!text) {
      return;
    }

    /**
     * Find the nearest link tag
     */
    const parentA = this.api.selection.findParentTag(this.tagName);
    /**
     * If no link tag then do nothing
     */
    // 如果parent a存在，且class包含linkItem，则显示unlink
    if (!parentA || !parentA.classList.contains(VariableLink.CSS.linkItem)) {
      return;
    }

    this.toggleVisibility(this.nodes.actionsWrapper, true);

    /**
     * Fill up link data block
     */
    this.nodes.linkDataName.innerText = parentA.dataset.name || '';
    this.nodes.linkDataDescription.innerText = parentA.dataset.description || '';
    this.nodes.linkDataURL.innerText = parentA.href || '';
    this.nodes.linkDataURL.href = parentA.href || '';
    this.nodes.linkDataURL.target = '_blank';

    /**
     * If link has name or description then show title wrapper
     */
    if (parentA.dataset.name || parentA.dataset.description) {
      this.toggleVisibility(this.nodes.linkDataTitleWrapper, true);
    }

    /**
     * Show link data block
     */
    // this.toggleVisibility(this.nodes.linkDataWrapper, true);

    /**
     * Show 'unlink' icon
     */
    this.toggleVisibility(this.nodes.toolButtonLink, false);
    this.toggleVisibility(this.nodes.toolButtonUnlink, true);
    this.nodes.toolButtonUnlink.classList.add(this.api.styles.inlineToolButtonActive);
  }

  /**
   * Show or hide target element
   *
   * @param {HTMLElement} element — target element
   * @param {boolean} isVisible — visibility state
   * @returns {void}
   */
  toggleVisibility(element, isVisible = true) {
    /**
     * If not "isVisible" then add "hidden" class
     */
    element.classList.toggle(VariableLink.CSS.hidden, !isVisible);
  }

  /**
   * concat config variables and user input value
   *
   * @param {string} inputValue - search string input
   *
   * @returns {Promise<any[]>}
   */
  searchRequest(inputValue:string):any[] {
    const { variables } = this.config as any;
    const allOptions:Set<string> = new Set(variables);
    allOptions.add(inputValue);
    return Array.from(allOptions).map((item) => ({
      name: item,
      href: item,
    }))
  }

  /**
   * Do we need to send requests to the server
   *
   * @returns {boolean}
   */
  // TODO : remove
  isServerEnabled() {
    return !!this.searchEndpointUrl;
  }

  /**
   * Function called with Inline Toolbar closing
   *
   * @returns {void}
   */
  clear() {
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