# Food Rescue Network Backend

A REST API backend that connects hotels with NGOs to redistribute surplus food and reduce food waste.

## Features

- HOTEL and NGO registration and login
- Password hashing with bcrypt
- JWT authentication and role-based authorization
- Add and list food donations
- View available food
- NGOs can claim food and mark it as picked up
- View food added by a hotel
- View food claimed by an NGO
- Food expiry and quantity validation

## Tech Stack

- Node.js
- Fastify
- TypeScript
- Sequelize ORM
- MySQL
- JWT
- bcrypt

## Setup

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file in the project root with your local MySQL credentials and a strong JWT secret. Never commit `.env` to GitHub.

### Start the development server

```bash
npm run dev
```

### Build

```bash
npm run build
```

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/users/register` | Register HOTEL or NGO |
| POST | `/api/users/login` | Login and get a token |
| GET | `/api/food` | List food |
| GET | `/api/food/available` | List available food |
| POST | `/api/food/add` | Add food (HOTEL) |
| PATCH | `/api/food/:id/claim` | Claim food (NGO) |
| PATCH | `/api/food/:id/pickup` | Complete pickup (NGO) |
| GET | `/api/food/my-claimed` | View NGO's claimed food |
| GET | `/api/food/my-added` | View HOTEL's added food |

Protected endpoints require a bearer token in the Authorization header.

## Food Rescue Workflow

1. A hotel registers and logs in.
2. The hotel adds a food donation.
3. An NGO registers and logs in.
4. The NGO claims available food.
5. The NGO marks the food as picked up.
6. Both roles can view their relevant food records.

## Testing

The main APIs were tested using Postman.

## Security

Keep credentials and `.env` private. Configure CORS and production database migrations before deployment.
