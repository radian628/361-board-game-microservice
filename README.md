# 361-board-game-microservice

Board Game Atlas microservice for CS 361.

## Install/run Instructions
1. Create a file `client-id.txt` in the root directory of this project containing your Board Game Atlas client ID (and nothing else).
2. `npm install`
3. `npm start`

## Usage

### Request Structure

Sample Usage (running locally):
```js
await (await fetch("http://localhost:8080/api", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        filter: { year_published: 2015 },
        fields: ["id", "handle", "url"] 
    }),
    method: "POST"
})).json();
```

This microservice has one endpoint: `/api`. This endpoint accepts POST requests to query data, and accepts a JSON body. This JSON body has two fields: `filter` and `fields`. 

`filter` is a set of key-value pairs representing how to filter the data from the Board Game Atlas server. Its key-value pairs correspond exactly to the query parameters found in the [Board Game Atlas API](https://www.boardgameatlas.com/api/docs/search). All query paramters are supported.

`fields` is a set of fields to return from each game. If included, only the fields listed will be included in the return data. These fields are identical to the properties listed [here](https://www.boardgameatlas.com/api/docs/gameobject).

### Response Structure

Responses are identical to the ones returned by Board Game Atlas. The only difference is that fields are filtered based on what you entered into `fields`. 

### Sequence Diagram
![Sequence diagram describing the above request/response structure](361-board-game-microservice/blob/main/sequence-diagram.jpg?raw=true)