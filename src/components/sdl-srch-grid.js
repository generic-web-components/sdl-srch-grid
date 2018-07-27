import {LitElement, html} from '@polymer/lit-element';
import '@polymer/iron-form/iron-form.js';
import '@sdl-web/sdl-srch-bar/src/components/sdl-srch-bar.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-tree-toggle.js';
import '@vaadin/vaadin-grid/vaadin-grid-sorter.js';
import {repeat} from 'lit-html/lib/repeat'

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
        grid.items = e.detail.payload;
      });
    });
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
      }
    }
  }

  _render(props) {
    var me = this;
    let templates = "";

      return html`
      <style>
        :host {
          display: block;
        }
      </style>

      <sdl-srch-bar id="srch-bar" theme="row-stripes" ajaxUrl=${this.url}>
        <slot name="search-slot"></slot>
      </sdl-srch-bar>

      <vaadin-grid id="vgrid">
        <slot name="column-slot"></slot>
      </vaadin-grid>

    `;
  }
}

window.customElements.define('sdl-srch-grid', SdlSrchGrid);

