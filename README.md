[![Translation status](https://hosted.weblate.org/widgets/openaedmap/-/svg-badge.svg)](https://hosted.weblate.org/engage/openaedmap/) [![CI](https://github.com/openstreetmap-polska/openaedmap-frontend/actions/workflows/ci_test.yml/badge.svg)](https://github.com/openstreetmap-polska/openaedmap-frontend/actions/workflows/ci_test.yml)

# Open AED Map

This project shows [Automated External Defibrillators (AED)](https://en.wikipedia.org/wiki/Automated_external_defibrillator) locations on a map. The site integrates with [OpenStreetMap](https://www.openstreetmap.org/). It reads AED data from OSM. You can also add a new AED location to OSM.

This is a rewrite of [the first version](https://aed.openstreetmap.org.pl/) to React. Development is in progress.

Production environment: https://openaedmap.org \
Development environment: https://dev.openaedmap.org

# Development
## Bun
We recommend bun instead of npm.
See https://bun.sh/docs/installation for the installation guide.

## Gitflow

`dev` is the main branch. When you push to `dev`, the dev environment deploys automatically.
Create a branch from `dev`. When you finish, make a PR back to `dev`.

To deploy to production, create a git tag.
Use the YYYY-MM-DD format. You can add a suffix with a description.

## Translating
We use [Weblate](https://weblate.org) to manage translations.

If you want to help, go to https://hosted.weblate.org/projects/openaedmap/ and start translating :)

If you add a new language, create an issue or make a PR. Add it to `src/languages.ts` with the 2 letter [ISO 639-1 code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) and the native name. The native name shows in the dropdown.

A language with multiple variants needs an extra suffix. For example, use zh-Hant for Traditional Chinese.

Status:

[![Translation status](https://hosted.weblate.org/widgets/openaedmap/-/multi-auto.svg)](https://hosted.weblate.org/engage/openaedmap/) [![CI](https://github.com/openstreetmap-polska/openaedmap-frontend/actions/workflows/ci_test.yml/badge.svg)](https://github.com/openstreetmap-polska/openaedmap-frontend/actions/workflows/ci_test.yml)

## Local environment

One way to set up the project:
1. Clone the repo and open a terminal in the project directory
2. Install Node version 24 or use [Node version manager](https://github.com/nvm-sh/nvm)
3. Install bun. See https://bun.sh/docs/installation
4. Run `bun install`

The second way: if you use VS Code and have Docker installed, you can use the devContainer extension.

The repo ships a `dev.env` template with sensible defaults for local
development. Symlink it to `.env`. `.env` stays gitignored, so your local
overrides and any secrets are never committed:
```
ln -s dev.env .env
```
If you need custom values, copy it instead (`cp dev.env .env`) and edit `.env`.

*Note: You can use Github Codespaces to develop.*

### Lefthook
We recommend [lefthook](https://github.com/evilmartians/lefthook).
After you install lefthook, run `lefthook install` to configure it.
The formatter and linter run before each git commit.

### Available Scripts

In the project directory, you can run:

#### `bun dev`

Runs the app in development mode.\
Open [http://127.0.0.1:5173](http://127.0.0.1:5173) to view it in your browser.

The page reloads when you make changes.\
You can also see lint errors in the console.

#### `bun prod`

Builds the app for production in the `build` folder.

#### Create sprites from marker icons

Use `npx @beyondtracks/spritezero-cli ./public/img/sprite ./src/marker_icons; spritezero --ratio=2 ./public/img/sprite@2x ./src/marker_icons; spritezero --ratio=4 ./public/img/sprite@4x ./src/marker_icons`

#### Upgrading dependencies
We recommend `bun update --interactive`.

# Data source
The map and AED locations are from [OpenStreetMap](https://www.openstreetmap.org/copyright)

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
