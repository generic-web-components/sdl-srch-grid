import {LitElement, html} from '@polymer/lit-element';
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
        let grid = this._root.querySelector('#vgrid');

          grid.allData = e.detail.payload;
          //grid.items = e.detail.payload;
          grid.url = me.url;
          grid.formData = e.detail.formData;
          grid.expandAll = me.expandAll;

          if (typeof grid.dataProvider == 'undefined') {
            grid.dataProvider = this._sdlDataProvider;
          } 
      });
    });
  }

  _sdlDataProvider(params, callback) {
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
      theme: {
        type: String
      },
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
    console.log(props,props.theme);

    if (typeof props.theme == 'undefined') {
      props.theme = "row-stripes";
    }

    return html`
      <style>
        :host {
          display: block;
        }
      </style>

      <sdl-srch-bar id="srch-bar" ajaxUrl=${props.url}>
        <slot name="search-slot"></slot>
      </sdl-srch-bar>
      
      <vaadin-grid id='vgrid' theme='${props.theme}'>
        <slot name='column-slot'></slot>
      </vaadin-grid>

    `;
  }
}

window.customElements.define('sdl-srch-grid', SdlSrchGrid);

