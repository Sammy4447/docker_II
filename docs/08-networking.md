# 08 — Docker Networking

How the three containers find and talk to each other, and why only the frontend is reachable from outside.

## The Request Path

```
Browser
   │  http://<host>:80
   ▼
┌──────────────────────── Docker network: <project-folder-name>_default ────────────────────────┐
│                                                                                               │
│   momo-frontend (nginx :80)  ──/api/──▶  momo-backend (:5000)  ──▶  momo-mongo (:27017)       │
│        ▲                                                                                      │
└────────┼──────────────────────────────────────────────────────────────────────────────────────┘
         │
   published with "80:80" — the only port open on the host
```

1. The browser connects to port 80 on the host, which Docker forwards to nginx in `momo-frontend`.
2. nginx serves the React files itself and forwards any `/api/` request to `backend:5000`.
3. The backend connects to MongoDB at `mongo:27017`.

## The Default Compose Network

`docker compose up` creates a network for the project automatically, named `<project-folder-name>_default` (for example `docker_default`), and attaches every service to it. Nothing about networks has to be written in `docker-compose.yml`.

```bash
docker network ls
docker network inspect docker_default    # replace with your network name; lists the attached containers and their IPs
```

## Service Names Are Hostnames

On a Compose network, Docker runs a built-in DNS server (at `127.0.0.11` inside each container) that resolves each **service name** to that container's IP. That is why the code never uses IP addresses:

| Where | Hostname used |
|---|---|
| `docker-compose.yml` → backend `MONGO_URL` | `mongodb://mongo:27017/momo` |
| `frontend/nginx.conf` → `proxy_pass` | `http://backend:5000` |

Container IPs change every time a container is recreated, but service names stay the same.



## `ports` vs `EXPOSE`

| | What it does |
|---|---|
| `EXPOSE 5000` (Dockerfile) | Documentation only. Says which port the app listens on. Opens nothing. |
| `ports: "80:80"` (Compose) | **Publishes** the port: traffic to host port 80 is forwarded to container port 80. Format is `"HOST:CONTAINER"`. |

Containers on the same network can reach each other on **any** port, published or not. Publishing is only needed for traffic coming from outside Docker (the browser, `curl` on the host).

In this project only the frontend publishes a port. From the host:

```bash
curl http://localhost/api/reviews     # works: goes through nginx
curl http://localhost:5000            # fails: the backend is not published
```

This keeps the backend and database private. Only nginx faces the internet.

## Network Drivers

| Driver | Use |
|---|---|
| `bridge` | Default. A private network on one host. Compose uses a user-defined bridge network. |
| `host` | The container shares the host's network directly; no isolation, no port mapping. |
| `none` | No networking at all. |
| `overlay` | Spans several hosts (used by Docker Swarm). |

> Docker also has a built-in network literally named `bridge`, used by `docker run` when no network is given. It does **not** resolve container names, so containers on it can reach each other only by IP. Compose creates its own network instead so that names work.

## Do It Without Compose

The same setup with plain `docker` commands, to see what Compose does behind the scenes:

```bash
docker network create momo-net

docker run -d --name mongo   --network momo-net mongo:7
docker run -d --name backend --network momo-net \
  -e MONGO_URL=mongodb://mongo:27017/momo -e PORT=5000 momo-backend
docker run -d --name frontend --network momo-net -p 80:80 momo-frontend
```

Here the hostnames are the container names (`--name`). Stop the Compose stack first (`docker compose down`), since port 80 and the images are shared. Clean up afterwards:

```bash
docker rm -f frontend backend mongo
docker network rm momo-net
```

---

**Previous:** [07 — Data Persistence with Volumes](07-volumes.md) · **Back to:** [README](../README.md)
