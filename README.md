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
- **GET `/user`** - all user listing with names and scores
- **^GET `/user/me`** - get authenticated user details including stats
- **^GET `/user/me/friends`** - list the user's Facebook friends who have played the game along with their stats
- **^POST `/user/me/result`** - send a new game result with format `{ winner: [id], lower: [id], correct: [boolean] }`; response body contains updated user stats

**Athlete**
- **GET `/athlete`** - all athlete listing
- **GET `/athlete/{id}`** - get athlete details

**Game**
- **GET `/game/matchup`** - get a new athlete matchup as an array of 2 athlete IDs

*^ denotes authentication required*
