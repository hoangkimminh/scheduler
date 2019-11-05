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

- `PORT` (number): Port number to run the server
- `MONGODB_URI` (string): MongoDB URI
- `CRAWLER_ADDRESS` (string): Address of crawler service

### Routes

#### 1. GET `/`

> Just for testing

##### Response body

- `iam`: `"/"`

#### 2. GET `/watches`

> Get all active watches

##### Response body

Array of objects:

- `_id` (ObjectID): ID of the watch
- `interval` (positive integer): Number of seconds between executions
- `payload` (object): Payload passed to the crawler

#### 3. POST `/watches`

> Schedule a watch

##### Request body

- `interval` (positive integer): Number of seconds between executions
- `payload` (object): Payload passed to the crawler

#### 4. GET `/watches/:id`

> Get the active watch with `id`

##### Route parameters

- `id` (ObjectID): ID of the watch

##### Response body

- `_id` (ObjectID): ID of the watch
- `interval` (positive integer): Number of seconds between executions
- `payload` (object): Payload passed to the crawler

#### 5. DELETE `/watches`

> Delete/disable an active watch

##### Request body

- `payload` (object): Payload passed to the crawler
