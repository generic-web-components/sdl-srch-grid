import {LitElement, html} from '@polymer/lit-element/lit-element.js';
import '@polymer/iron-form/iron-form.js';
//import 'jquery/dist/jquery.min.js';
import '@sdl-web/sdl-srch-bar/src/components/sdl-srch-bar.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-tree-toggle.js';
import '@vaadin/vaadin-grid/vaadin-grid-sorter.js';
import '@vaadin/vaadin-grid/vaadin-grid-selection-column.js';

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

    // console.log("sdl-srch-grid constructor called...")
    this.addEventListener('rendered', async (e) => {
      me.addEventListener("changed", function(e) {
        let gridSlot = this._root.querySelector('#grid-slot');
        let nodes = gridSlot.assignedNodes();
        if (typeof nodes == 'undefined' || typeof nodes[0] == 'undefined' 
            || typeof nodes[0].nodeName == 'undefined' || ! nodes[0].nodeName == "VAADIN-GRID") {
          alert("Sorry, no vaadin grid was put into 'grid-slot'  -- Currently vaadin-grid is the only grid supported")
          return 0;
        }

        let grid = nodes[0];
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
      </style>

      <sdl-srch-bar id="srch-bar" ajaxUrl=${props.url}>
        <slot name="search-slot"></slot>
      </sdl-srch-bar>
      
      <slot id="grid-slot" name="grid-slot"></slot>
    `;
  }
}

window.customElements.define('sdl-srch-grid', SdlSrchGrid);

