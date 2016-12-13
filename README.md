# Guess Athletes REST API

This is the API accompanying the Guess Athletes app. It handles all data access and user scoring/tracking.

## Installation

1. Either create a `config.json` file or set the `NODE_CONFIG` environment variable with the contents of the `config-sample.json` and appropriate parameters filled in.

2. Run `npm install`.

3. Start the server with `npm server`.

## API Reference

### Authentication

Some endpoints require user authentication via a Facebook access token. This token should be retrieved by the frontend client via the appropriate Facebook SDK.

Include the Facebook access token as an `Authorization: Bearer [token]` request header, or with an `access_token=[token]` query parameter in the URL. 

### Endpoints

**User**
- GET `/user` - all user listing with names and scores
- ^GET `/user/{id}`
- ^POST `/user/{id}/result`

**Athlete**
- GET `/athlete`
- GET `/athlete/{id}`


**Game**
- GET `/game/matchup`

*^ denotes authentication required*
