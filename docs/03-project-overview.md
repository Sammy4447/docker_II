# 03 — Project Overview

The app is a review site with three parts. Each part runs in its own container:

- a Vite + React frontend, served by nginx
- a Node/Express backend
- a MongoDB database

## Architecture

| Container | Role | Port |
|---|---|---|
| `momo-frontend` | nginx serves the built React site and forwards `/api/*` requests to the backend | `80` on the host → `80` in the container |
| `momo-backend` | Express API: `GET /api/reviews` lists reviews, `POST /api/reviews` saves one (`name` + `review`) | Internal only (`5000`) |
| `momo-mongo` | MongoDB database (official `mongo:7` image) that stores the reviews | Internal only (`27017`) |

Only the frontend is published to the host. The backend and database are reachable only inside the Docker network that Compose creates. On that network, containers find each other by service name (`backend`, `mongo`).

## Project Structure

```
docker/
├── docker-compose.yml   # runs frontend + backend + MongoDB together
├── README.md
├── docs/                # step-by-step guides (this folder)
├── frontend/            # React site (Vite), served by nginx
│   ├── Dockerfile       # multi-stage: build with Node, serve with nginx
│   ├── nginx.conf       # serves the site and forwards /api/* to the backend
│   ├── index.html
│   ├── package.json
│   ├── public/
│   └── src/
└── backend/             # Express API for reviews
    ├── Dockerfile
    ├── package.json
    ├── server.js
    └── models/Review.js
```

## Why Multiple Containers?

The frontend, backend, and database each get their own container instead of sharing one:

- **Separation of concerns:** one container has one responsibility. nginx serves the site, Express serves the API, and MongoDB stores data. Each part is easier to understand, debug, and update.
- **Independent scaling:** if traffic grows, you can scale only the backend without touching the frontend or the database.
- **Independent rebuilds and restarts:** a change in `frontend/` rebuilds and restarts only `momo-frontend`. The backend and database keep running, so data and connections are not disrupted.
- **Reusable official images:** MongoDB is pulled as-is from Docker Hub, so we don't have to build and maintain our own image.
- **Isolation and security:** the backend and database are never exposed to the host or the internet. Only the frontend is published, on port `80`.
- **Matches how the app works:** the three parts are already separate processes that talk over the network (HTTP and the MongoDB wire protocol). Separate containers follow that same boundary.

`docker-compose.yml` ties these containers together. It defines how they are built, which ports they expose, and how they find each other, so the whole stack starts and stops with a single command.

---

**Previous:** [02 — SSH and Install Docker](02-ssh-and-install-docker.md) · **Next:** [04 — Run with Docker Compose](04-run-with-docker-compose.md)
