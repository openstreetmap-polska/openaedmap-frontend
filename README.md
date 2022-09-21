[![Translation status](https://hosted.weblate.org/widgets/openaedmap/-/svg-badge.svg)](https://hosted.weblate.org/engage/openaedmap/)

# Open AED Map

This project shows [Automated External Defibrillators (AED)](https://en.wikipedia.org/wiki/Automated_external_defibrillator) location on a map. Site is integrated with [OpenStreetMap](https://www.openstreetmap.org/) reading data from OSM and allowing to add AED location to OSM.

This is a rewrite of [the first version](https://aed.openstreetmap.org.pl/) to React. Development is in progress.

Production environemnt: https://openaedmap.org \
Development environment: https://dev.openaedmap.org

# Development
## Gitflow

Branches:
- main - for prod environment
- dev - for dev environment

Create branch off of `dev` branch and when finished make PR back to `dev` branch.

Pushes to both branches result in auto deployment.

## Translating
We are using [Weblate](https://weblate.org) to manage translations.

If you want to help go to https://hosted.weblate.org/projects/openaedmap/ and start translating :)

If new language is added then create an issue or make a PR adding it to `src/i18n.ts` with the 2 letter language ISO 639-1 code and native name (this is going to be displayed in dropdown).

Status:

[![Translation status](https://hosted.weblate.org/widgets/openaedmap/-/multi-auto.svg)](https://hosted.weblate.org/engage/openaedmap/)

## Local environment

One way to set up is:
1. Clone repo and open terminal in the project directory
2. Install Node version 18 or use [Node version manager](https://github.com/nvm-sh/nvm)
3. Run `npm install`

Second way is if you are using VS Code and have Docker installed you can use devContainer extension.

Create .env file and put these variables there:
```
SKIP_PREFLIGHT_CHECK=true
REACT_APP_VERSION=$npm_package_version
REACT_APP_OSM_API_URL=https://master.apis.dev.openstreetmap.org
REACT_APP_OSM_OAUTH2_CLIENT_ID=xXaPFXSLizLHuZzoLI1eebHncPdDdVH7nA917S9uFUo
REACT_APP_OSM_OAUTH2_CLIENT_SECRET=vSfLjZquQ5xlcD9Lq9rhyDuH1ItpakgY5DW59WrRtHY
HOST=127.0.0.1
```

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://127.0.0.1:3000](http://127.0.0.1:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

# Data source
Map and AED locations are from [OpenStreetMap](https://www.openstreetmap.org/copyright)

# Libraries used
- [Maplibre GL JS](https://maplibre.org/maplibre-gl-js-docs/api/)
- [OSM Auth](https://github.com/osmlab/osm-auth)
- [OSM opening_hours](https://github.com/opening-hours/opening_hours.js/)
- [React](https://reactjs.org/docs/getting-started.html)
- [Bulma](https://bulma.io/) 
- [Bulma Tooltip](https://bulma-tooltip.netlify.app/)
- [Bulma Collapsible](https://bulma-collapsible.netlify.app/)
- [React Bulma Components](https://react-bulma.dev/en/storybook)
- [Material Design Icons](https://dev.materialdesignicons.com/getting-started/react)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
