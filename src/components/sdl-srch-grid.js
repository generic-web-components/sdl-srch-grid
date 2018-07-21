import {LitElement, html} from '@polymer/lit-element';
import '@polymer/iron-form/iron-form.js';
import '@sdl-web/sdl-srch-bar/src/components/sdl-srch-bar.js';

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
        console.log(e.detail);
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
      ajaxUrl: {
        type: String
      }
    }
  }

  _render(props) {
      return html`
      <style>
        :host {
          display: block;
        }
      </style>

      <sdl-srch-bar id="srch-bar2">
        <slot></slot>
      </sdl-srch-bar>
    `;
  }

}

window.customElements.define('sdl-srch-grid', SdlSrchGrid);

