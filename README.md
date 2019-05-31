# front-end

This explains setup and development the front-end for the application running on https://sonne.0ds.de
Configure your development and production environments to use the correct hosts (.env.* files).

# deployment

## manual installation

Our configuration and deployment uses the following folders:

  - `/srv/http/sonne` contains the installed [django application](https://github.com/sonne-academic/django-middleware).
  - `/srv/http/static` contains the output of the build script.

`npm install && npm run build` should take care of everything and place the output in the `dist` folder.
Copy the contents of this folder to `/srv/http/static` (or where ever you want to have it), the webserver should take care of the rest.
For details on the webserver configuration, see the [django application](https://github.com/sonne-academic/django-middleware).

## CI/CD

If you're using gitlab and the same folders as we do, the gitlab-runners will take care of that for you.
The `.gitlab-ci` is split into two runners: one for building and one for deploying.
We use a more beefy server to build the JavaScript files, once this completed successfully, the runner on the webserver will copy it to where it should be.

# development

 - `npm install` Project setup
 - `npm run serve` Compiles and hot-reloads for development
 - `npm run build` Compiles and minifies for production
 - `npm run test` Run your tests (if there were any)
 - `npm run lint` Lints and fixes files

See [Configuration Reference](https://cli.vuejs.org/config/) for details on the vue configuration.

## project structure

 - `inkscape` contains all svg sources.
 - `public` contains the minified svg files and the *index.html* entry-point for the frontend
 - `scripts` contains a script for patching an older version of cytoscape.js (which would be run through package.json).
 - `src` contains the important bits of the vue project.
   - `types` for the typescript interfaces that are not in typescript.
   - `store` contains the vue-ex store for the logging information
   - `plugins` has vue plugins:
     - `vue-cy` is the managment for Cytoscape.js
     - `vue-solr` describes the communitaction between the frontend and the backend.
   - `components` contain all vue single file components that are used by `App.vue`

### components

<img src=./inkscape/frontend-impl.svg>

`Cytoscape.vue` manages the canvas that is used by Cytoscape.js, and initializes the context menu.
This is also the main link between vue and cytoscape, it will catch all (relevant) events and instruct vue to display the correct side-pane.

`GlobalLog.vue` will show any errors that happen client or server side, it depends on the vue-ex store in `src/store`.

`SearchBox.vue` is the little box that will emit new search nodes onto the cytoscape canvas.

`nodes/` contains the detailed implementation of what is displayed in the sidebar. Depending on the selected cytoscape node(s) these do all the work and communication.

`Embed/` contains the elements that are used by these nodes, most are there to show matching publications.

`Emitters/` are the elements that will place a new node on the canvas.

`util/` contains the spinning hourglass that is used everywhere (and some unused stuff).
