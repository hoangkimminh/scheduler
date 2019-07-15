# Night Watch scheduler

## INSTALLATION

### Requirements

- Node.js >= 8
- MongoDB >= 3
- Dotenv files: `.env.production` and/or `.env.development`

### Instructions

```bash
$ yarn install
$ yarn start # yarn dev for development
```

## DOCUMENTATION

### Environment Variables

- `MONGODB_URI` (string): MongoDB URI
- `CRAWLER_ADDRESS` (string): Address of crawler service

### Routes

#### GET `/`

> Just for testing

##### Response body

- `iam`: `"/"`

#### GET `/watch`

> Get all active watches

##### Response body

Array of objects:

- `id` (string): ID of the watch
- `interval` (positive integer): Number of seconds between executions
- `payload` (object): Payload passed to the crawler

#### POST `/watch`

> Add a new watch

##### Request body

- `interval` (positive integer): Number of seconds between executions
- `payload` (object): Payload passed to the crawler

##### Response body

- `success` (boolean): Status

#### GET `/watch/:id`

> Get the active watch with `id`

##### Route parameters

- `id` (string): ID of the watch

##### Response body

- `id` (string): ID of the watch
- `interval` (positive integer): Number of seconds between executions
- `payload` (object): Payload passed to the crawler

#### DELETE `/watch/:id`

> Delete/disable the active watch with `id`

##### Route parameters

- `id` (string): ID of the watch

##### Response body

- `success` (boolean): Status
