# Guess Athletes REST API

This is the API accompanying the Guess Athletes app. It handles all data access and user scoring/tracking.

## Installation

1. Either create a `config.json` file or set the `NODE_CONFIG` environment variable with the contents of the `config-sample.json` and appropriate parameters filled in.

2. Run `npm install`.

3. Start the server with `npm server`.

## Endpoints

GET `/user`
POST `/user`
GET `/user/{id}`
POST `/user/{id}/result`

GET `/athlete`
GET `/athlete/{id}`

GET `/game/matchup`
