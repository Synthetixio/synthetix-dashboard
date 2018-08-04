# Havven Dashboard website

This site uses Netlify for the hosting.

## Branches

The `master` branch is the dev version which automatically deploys to https://dashboard-staging.havven.io.
The `live` branch automatically deploys to https://dashboard.havven.io.

## Requirements

- node: We recommend installing this with [nvm](https://github.com/creationix/nvm)
- [yarn](https://yarnpkg.com/lang/en/docs/install/)
- [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Install

```sh
yarn
```

## Run

```sh
yarn start
```


## Build the Static Site

```sh
yarn build
```

## Analyze package modules

```sh
yarn build:analyze
```

yarn 