# \<sdl-srch-grid\>

Generic Search Grid Element.  

Based on the high end vaadin grid component and sdl-srch-bar component.  You can specify the "url" to handle everything about the grid including loading and filtering.   

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element In Development Mode

```
$ cd sdl-srch-grid
$ polymer serve
```

## Build the sdl-srch-bar demo & component
```
$ ./sdlMake 
```

Once you run this build there will be two build directories created:  build-demo & build-component


##  Run the es6 version of the Demo (Assuming you installed at SERVER_ROOT using npm)
```
{SERVER_ROOT}/node_modules/@sdl-web/sdl-srch-grid/build-demo/es6-bundled/demo/index.html
```

##  Include sdl-srch-grid-loader.js to use as stand-alone bundled component 
or 
##  Include sdl-srch-grid.js directly if including in a polymer project. 
```
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes">

    <title>sdl-srch-grid demo</title>


<!-- If using as a stand-alone-component:  use sdl-srch-grid-loader.js
<script src="./node_modules/@sdl-web/sdl-srch-grid/build-component/sdl-srch-grid-loader.js"></script> -->

<!-- If using in an existing polymer project:  use sdl-srch-grid.js directly-->
<!-- <script type="import" src="@sdl-web/sdl-srch-grid/src/components/sdl-srch-grid.js"></script>  -->

<!-- Now add sdl-srch-grid to html section -->
<sdl-srch-grid id='srch-grid' url='./data/srch-data-8000.txt'>  

  <!-- Put whatever input fields (and styling) you want into 'search-slot' -->
  <form slot="search-slot">
    <paper-input name="input1" label="Filter Search">
      <iron-icon icon="search" id="srch-icon" slot="prefix"></iron-icon>
    </paper-input>
  </form>

  <!-- Add your columns using vaadin-grid-column into the 'column-slot' -->
  <vaadin-grid-column slot="column-slot">
    <template class="header">Name</template>
    <template>[[item.name]]</template>
  </vaadin-grid-column>
  <vaadin-grid-column slot="column-slot">
    <template class="header"><vaadin-grid-sorter path="gender">Gender</vaadin-grid-sorter></template>
    <template>[[item.gender]]</template>
  </vaadin-grid-column>
  <vaadin-grid-column slot="column-slot">
    <template class="header">Eye Color</template>
    <template>[[item.eyeColor]]</template>
  </vaadin-grid-column>     

</sdl-srch-grid>

  </body>
</html>

```
