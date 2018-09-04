import {LitElement, html} from '@polymer/lit-element/lit-element.js';
import '@polymer/iron-form/iron-form.js';
//import 'jquery/dist/jquery.min.js';
import '@sdl-web/sdl-srch-bar/src/components/sdl-srch-bar.js';
import '@vaadin/vaadin-grid/all-imports.js';
import '@vaadin/vaadin-button/vaadin-button.js';

/**
 * `sdl-srch-grid`
 * Search Grid Element
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SdlSrchGrid extends LitElement {

  constructor() {
    super();
    var me = this;

    me._polyfill_Closest();

    // console.log("sdl-srch-grid constructor called...")
    this.addEventListener('rendered', async (e) => {
      console.log("RENDERED...")

      var gridSlot = this._root.querySelector('#grid-slot');
      var gridNodes = gridSlot.assignedNodes();
      if (typeof gridNodes == 'undefined' || typeof gridNodes[0] == 'undefined' 
          || typeof gridNodes[0].nodeName == 'undefined' || ! gridNodes[0].nodeName == "VAADIN-GRID") {
        alert("Sorry, no vaadin grid was put into 'grid-slot'  -- Currently vaadin-grid is the only grid supported")
        return 0;
      }
      var grid = gridNodes[0];
      me.grid = grid;

      grid.addEventListener("mouseover", function(e) {  
        var path = me._getEventPath(e);


        // var tr = e.target.closest("tr");
        if (typeof path !== 'undefined') {
          for (var i=0; i<path.length; i++) {
            if (/^TR$/.test(path[i].nodeName)) {
              me.dispatchEvent(new CustomEvent('sdl-srch-grid-mouseover', {
                bubbles: true,
                composed: true,
                detail: {
                  target: path[i],
                  formData: path[i]._item
                }
              }));  
            }
          }
        }
      });

      grid.addEventListener("mouseout", function(e) {  
        var path = me._getEventPath(e);
        // var tr = e.target.closest("tr");
        if (typeof path !== 'undefined') {
          for (var i=0; i<path.length; i++) {
            if (/^TR$/.test(path[i].nodeName)) {
              me.dispatchEvent(new CustomEvent('sdl-srch-grid-mouseout', {
                bubbles: true,
                composed: true,
                detail: {
                  target: path[i],
                  formData: path[i]._item
                }
              }));  
            }
          }
        }
      });

      grid.addEventListener('click', function(e){
        if (typeof e.target !== 'undefined' && typeof e.target.tagName !== 'undefined' && e.target.tagName.match(/BUTTON/g)) {
          var id = e.target.id;
          if (typeof id === 'undefined') {
            alert("Sorry, an 'id' has not been defined for a button");
            return 0;           
          }    
          
          switch (true) {
              case /add-/.test(id):
                console.log("ADD BUTTON clicked");
                // Throw the Add Event.
                // Then Bring up the Add Form if defined.
                me.dispatchEvent(new CustomEvent('sdl-srch-grid-add', {
                  bubbles: true,
                  composed: true,
                  detail: {
                    target: e.target
                  }
                }));  
                break;
            case /edit-/.test(id):
                var uniqueId = me._extractId(id);
                console.log("EDIT BUTTON clicked  --> ID=",uniqueId); 
                var recObj = grid.items.find(o => o._id === uniqueId);
                // Find the record in the Data Array and return it in the event.
                // If Edit Slot is filled in Bring up the form with data loaded.
                me.dispatchEvent(new CustomEvent('sdl-srch-grid-edit', {
                  bubbles: true,
                  composed: true,
                  detail: {
                    target: e.target,
                    formData: recObj
                  }
                })); 
                break;
            case /delete-/.test(id):
                var uniqueId = me._extractId(id);
                console.log("DELETE BUTTON clicked --> ID=", uniqueId); 
                var recObj = grid.items.find(o => o._id === uniqueId);
                // Send url with DELETE of this item.
                me.dispatchEvent(new CustomEvent('sdl-srch-grid-delete', {
                  bubbles: true,
                  composed: true,
                  detail: {
                    target: e.target,
                    formData: recObj
                  }
                }));       
                break;
            default:
                var uniqueId = me._extractId(id);
                console.log("CUSTOM BUTTON clicked --> ID=", uniqueId); 
                console.log("Button 'id' does not follow 'add-', 'edit-', 'delete-' convention");
                var recObj = grid.items.find(o => o._id === uniqueId);
                // Send url with DELETE of this item.
                me.dispatchEvent(new CustomEvent('sdl-srch-grid-custom', {
                  bubbles: true,
                  composed: true,
                  detail: {
                    target: e.target,
                    formData: recObj
                  }
                }));       
                break;
          }
        } 
      });


      me.addEventListener("changed", function(e) {

        grid.expandAll = me.expandAll;
        grid.url = me.url;
        grid.formData = e.detail.formData;

        // If they have 'hasChildren' field in their data we assume it is a tree
        //  We provide the treeDataProvider for trees.
        if (typeof e.detail.payload[0].hasChildren != 'undefined') {
          grid.allData = e.detail.payload;
          grid.dataProvider = this._treeDataProvider;
        } else {
          grid.items = e.detail.payload;
        }
      });
    });
  }

  _treeDataProvider(params, callback) {
    var grid = this;
    grid.filteredData = [];

    // Combine the params.filter with the sdl-srch-bar formData
    // Note:  This could be used if we decide to filter everything on client side
    params.filters = Object.assign(params.filters, grid.formData);

    for(var i=0; i<grid.allData.length; i++) {
      if (typeof params.parentItem != 'undefined' && params.parentItem != null) {
        // When parentItem is defined then we are in a tree.
        // So, Get only the records that match the parentItem.
        if (grid.allData[i].parentItem == params.parentItem._id) {
          grid.filteredData.push(grid.allData[i]); 
          if (typeof grid.expandAll != 'undefined' && grid.expandAll) {
            grid.expandedItems.push(grid.allData[i]);
          }
        }
      } else {
        // params parentItem is not set -- so just return the top most level 
        //   which may be the entire list - if we are not in a tree
        if (typeof grid.allData[i].parentItem == 'undefined' || grid.allData[i].parentItem == '' 
              || grid.allData[i].parentItem == null || grid.allData[i].parentItem == 'null' ) {
          grid.filteredData.push(grid.allData[i]); 
          if (typeof grid.expandAll != 'undefined' && grid.expandAll) {
            grid.expandedItems.push(grid.allData[i]);
          }
        }
      }
    }

    const startIndex = params.page * params.pageSize;
    const pageItems = grid.filteredData.slice(startIndex, startIndex + params.pageSize);
    // Inform grid of the requested tree level's full size
    const treeLevelSize = grid.filteredData.length;
    callback(pageItems, treeLevelSize);
  }

  _didRender(props, changedProps, prevProps) {
    console.log('_didRender');
    this.dispatchEvent(new CustomEvent('rendered'));  
  }

  _extractId(id){
    var idParts = id.split("-");
    return idParts[idParts.length-1];
  }


  _getEventPath(evt) {
    var path = (evt.composedPath && evt.composedPath()) || evt.path,
        target = evt.target;

    if (path != null) {
        // Safari doesn't include Window, but it should.
        return (path.indexOf(window) < 0) ? path.concat(window) : path;
    }

    if (target === window) {
        return [window];
    }

    function getParents(node, memo) {
        memo = memo || [];
        var parentNode = node.parentNode;

        if (!parentNode) {
            return memo;
        }
        else {
            return getParents(parentNode, memo.concat(parentNode));
        }
    }

    return [target].concat(getParents(target), window);
}

  /**
   * Get the closest matching element up the DOM tree.
   * @private
   * @param  {Element} elem     Starting element
   * @param  {String}  selector Selector to match against
   * @return {Boolean|Element}  Returns null if not match found
   */
    _getClosestUp  ( elem, selector ) {

    // Element.matches() polyfill
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i = matches.length;
          while (--i >= 0 && matches.item(i) !== this) {}
          return i > -1;
        };
    }

    // Get closest match
    for ( ; elem && elem !== document; elem = elem.parentNode ) {
      console.log(elem.tagName,elem.path);
      if ( elem.matches( selector )) return elem;
    }
    return null;
  };


  /**
 * Element.closest() polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
 */
_polyfill_Closest() {
  if (!Element.prototype.closest) {
    if (!Element.prototype.matches) {
      Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }
    Element.prototype.closest = function (s) {
      var el = this;
      var ancestor = this;
      if (!document.documentElement.contains(el)) return null;
      do {
        if (ancestor.matches(s)) return ancestor;
        ancestor = ancestor.parentElement;
      } while (ancestor !== null);
      return null;
    };
  }
}


  _getClosestDown (elem, selector) {
    var firstElem = elem.querySelector(selector);
    return firstElem;
  }

  updateRecord(record) {
    var foundIndex = this.grid.items.findIndex(x => x._id == record._id);
    this.grid.items[foundIndex] = record;
    this.grid.clearCache();
  }

  insertRecord(record) {
    this.grid.items.splice(0, 0, record);
    this.grid.clearCache();
  }

  deleteRecord(record) {
    var foundIndex = this.grid.items.findIndex(x => x._id == record._id);
    this.grid.items.splice(foundIndex, 1);
    this.grid.clearCache();
  }

  renderComplete() {
    console.log("completed render...")
  }

  static get properties() { 
    return { 
      url: {
        type: String
      }, 
      expandAll: {
        type: Boolean
      }
    }
  }

  _render(props) {
    var me = this;

    return html`
      <style>
        :host {
          display: block;
        }

        .button-active {
          opacity: 1
        }

        .button-inactive {
          opacity: .05
        }
      </style>

      <sdl-srch-bar id="srch-bar" ajaxUrl=${props.url}>
        <slot name="search-slot"></slot>
      </sdl-srch-bar>
      
      <slot id="grid-slot" name="grid-slot"></slot>
    `;
  }
}

window.customElements.define('sdl-srch-grid', SdlSrchGrid);

