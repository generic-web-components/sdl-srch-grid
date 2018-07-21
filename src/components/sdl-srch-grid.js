import {LitElement, html} from '@polymer/lit-element';
import '@polymer/iron-form/iron-form.js';
import '@sdl-web/sdl-srch-bar/src/components/sdl-srch-bar.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';

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

    <vaadin-grid aria-label="Basic Binding Example" items='[{
    "_id": "1",
    "age": "33",
    "eyeColor": "green",
    "name": "Boy Blue",
    "gender": "male"
  },{
    "_id": "2",
    "age": "44",
    "eyeColor": "blue",
    "name": "Jack Spratt",
    "gender": "male"
  }]'>
      <vaadin-grid-column width="60px" flex-grow="0">
        <template class="header">#</template>
        <template></template>
      </vaadin-grid-column>

      <vaadin-grid-column>
        <template class="header">Name</template>
        <template>[[item.name]]</template>
      </vaadin-grid-column>

      <vaadin-grid-column width="8em">
        <template class="header">Gender</template>
        <template>
          <div style="white-space: normal">[[item.gender]]</div>
        </template>
      </vaadin-grid-column>

      <vaadin-grid-column>
        <template class="header">Eye Color</template>
        <template>[[item.eyeColor]]</template>
      </vaadin-grid-column>

    </vaadin-grid>
    `;
  }

}

window.customElements.define('sdl-srch-grid', SdlSrchGrid);

