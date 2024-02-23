[![Translation status](https://hosted.weblate.org/widgets/openaedmap/-/svg-badge.svg)](https://hosted.weblate.org/engage/openaedmap/)

# Open AED Map

This project shows [Automated External Defibrillators (AED)](https://en.wikipedia.org/wiki/Automated_external_defibrillator) location on a map. Site is integrated with [OpenStreetMap](https://www.openstreetmap.org/) reading data from OSM and allowing to add AED location to OSM.

This is a rewrite of [the first version](https://aed.openstreetmap.org.pl/) to React. Development is in progress.

Production environment: https://openaedmap.org \
Development environment: https://dev.openaedmap.org

# Development
## Bun
It's recommended to use bun instead of npm.
See https://bun.sh/docs/installation for installation manual

## Gitflow

`dev` is main branch. After pushing to it dev environment is autodeployed.
Create branch off of `dev` branch and when finished make PR back to `dev` branch.

To deploy to production create git tag.
Use YYYY-MM-DD format with optional suffix with description.

## Translating
We are using [Weblate](https://weblate.org) to manage translations.

If you want to help go to https://hosted.weblate.org/projects/openaedmap/ and start translating :)

If new language is added then create an issue or make a PR adding it to `src/languages.ts` with the 2 letter language [ISO 639-1 code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) and native name (this is going to be displayed in dropdown).

Language with multiple variants needs extra suffix e.g. zh-Hant for Traditional Chinese.

Status:

[![Translation status](https://hosted.weblate.org/widgets/openaedmap/-/multi-auto.svg)](https://hosted.weblate.org/engage/openaedmap/)

## Local environment

One way to set up is:
1. Clone repo and open terminal in the project directory
2. Install Node version 20 or use [Node version manager](https://github.com/nvm-sh/nvm)
3. Install bun. See https://bun.sh/docs/installation
4. Run `bun install`

Second way is if you are using VS Code and have Docker installed you can use devContainer extension.

Create .env file and put these variables there:
```
VITE_OSM_API_URL=https://master.apis.dev.openstreetmap.org
VITE_BACKEND_API_URL=https://dev.openaedmap.org
VITE_OSM_OAUTH2_CLIENT_ID=xXaPFXSLizLHuZzoLI1eebHncPdDdVH7nA917S9uFUo
```

*Note: You can use Github Codespaces to develop.*

### Lefthook
It's recommended to use [lefthook](https://github.com/evilmartians/lefthook)
After installing lefthook use `lefthook install` to configure it.
Formatter and linter will run before git commit.

### Available Scripts

In the project directory, you can run:

#### `bun start`

Runs the app in the development mode.\
Open [http://127.0.0.1:5173](http://127.0.0.1:5173) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

#### `bun run build`

Builds the app for production to the `build` folder.

#### Create sprites from marker icons

Use `npx @beyondtracks/spritezero-cli ./public/img/sprite ./src/marker_icons; spritezero --ratio=2 ./public/img/sprite@2x ./src/marker_icons; spritezero --ratio=4 ./public/img/sprite@4x ./src/marker_icons`

#### `bun run css-build`

Build `sass/mystyles.scss` file into `src/mystyles.css` which is included in `index.tsc` and has the adjusted bulma css for the entire app.

Run this if changed e.g. navbar breakpoint or customized bulma further in `sass/mystyles.css`.

#### Upgrading dependencies
`bunx npm-check-updates -ui` is recommended

# Data source
Map and AED locations are from [OpenStreetMap](https://www.openstreetmap.org/copyright)

# Libraries used
- [Maplibre GL JS](https://maplibre.org/maplibre-gl-js-docs/api/)
- [OSM Auth](https://github.com/osmlab/osm-auth)
- [OSM opening_hours](https://github.com/opening-hours/opening_hours.js/)
- [React](https://reactjs.org/docs/getting-started.html)
- [Bulma](https://bulma.io/)
- [Bulma Checkradio](https://wikiki.github.io/form/checkradio/)
- [React Bulma Components](https://react-bulma.dev/en/storybook)
- [Material Design Icons](https://dev.materialdesignicons.com/getting-started/react)
- [spritezero-cli](https://gitlab.com/beyondtracks/spritezero-cli)
- [i18next](https://github.com/i18next/i18next)
- [React-Select](https://react-select.com/home)
