# Nexus CRM — Backend

REST API for the Nexus CRM. Express, MongoDB, JWT.

## Quick start

```bash
npm install
cp .env.example .env
# edit .env with your values
npm run dev
```

## Environment

| Variable | Description |
|----------|-------------|
| PORT | Server port (default 5000) |
| NODE_ENV | development / production |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | JWT signing key |
| JWT_EXPIRES_IN | Token lifetime (e.g. 7d) |
| CLIENT_URL | Frontend origin for CORS |

## Seed

```bash
npm run seed
```

Creates 3 demo users and 8 sample clients.

## Endpoints

**Auth** — `/api/auth`

| Method | Path | Access |
|--------|------|--------|
| POST | /register | public |
| POST | /login | public |
| GET | /me | authenticated |
| POST | /logout | authenticated |

**Clients** — `/api/clients`

| Method | Path | Roles |
|--------|------|-------|
| GET | / | all |
| POST | / | admin, agent |
| GET | /:id | all |
| PATCH | /:id | admin, agent |
| DELETE | /:id | admin |

**Users** — `/api/users`

| Method | Path | Roles |
|--------|------|-------|
| GET | / | admin |
| PATCH | /:id/role | admin |

**Stats** — `/api/stats`

| Method | Path | Roles |
|--------|------|-------|
| GET | /overview | all |

## Response shape

```json
{ "success": true, "data": {}, "message": null, "meta": null }
```

Paginated list endpoints include `meta: { total, page, pages }`.

## Roles

- admin — full access
- agent — can manage clients assigned to them
- viewer — read-only
