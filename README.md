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

### Routes

#### GET `/`

> Just for testing

##### Response body

- iam: `"/"`

#### POST `/watch`

> Add a new watch

##### Request body

- interval (positive integer): Number of seconds between executions
- payload (object): Payload passed to the crawler

##### Response body

- success (boolean): Status
