# EC2 Instance Setup

Steps to create the EC2 instance for this project.

1. Go to **AWS Console → EC2 → Launch Instance**.
2. **Name**: give the instance a name (e.g. `docker-server`).
3. **Application and OS Image (AMI)**: select **Ubuntu** (latest LTS).
4. **Instance type**: select **t3.small**.
5. **Key pair**: create a new key pair (or select an existing one) and download the `.pem` file — needed for SSH access.
6. **Network settings**: allow SSH (port 22), and HTTP/HTTPS if needed.
7. **Configure storage**: set to **20 GiB**.
8. Click **Launch instance**.

## Connect to the instance

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@<instance-public-ip>
```

## Install Docker

```bash
sudo apt update
sudo apt install docker.io
```

Check available commands:

```bash
docker
```

## Check Docker status

```bash
systemctl status docker
```

Shows whether the Docker service is running (active) or stopped.

```bash
sudo docker ps
```

Lists all currently running containers.

## Run Docker without sudo

```bash
sudo usermod -aG docker ubuntu
newgrp docker
```

Adds the `ubuntu` user to the `docker` group so you don't need `sudo` for every docker command. `newgrp docker` applies the group change to the current session immediately (otherwise you'd need to log out and back in).

- `-a` = append → keep existing groups as they are, just add the `docker` group.
- `-G` = groups → add the user to the specified group(s).

After this, you can drop `sudo`:

```bash
docker ps
```

```bash
docker images
```

Lists all Docker images downloaded/available on the machine.

## Test Docker installation

```bash
docker pull hello-world
```

Downloads the `hello-world` image from Docker Hub to the local machine.

```bash
docker run hello-world
```

Creates and runs a container from the `hello-world` image. It prints a confirmation message and exits — confirming that Docker is installed and working correctly.

# Dockerize and run momo-site

The site (Vite + React) is built into a static bundle and served with nginx, using the multi-stage `Dockerfile` in `frontend/`. A Node/Express + MongoDB backend in `backend/` stores user reviews.

## Project structure

```
docker/
├── docker-compose.yml   # runs frontend + backend + MongoDB together
├── README.md
├── frontend/            # React site (Vite), served by nginx
│   ├── Dockerfile
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

## Why multiple containers?

Instead of putting the frontend, backend, and database into a single container, each one gets its own:

- **Separation of concerns** — one container = one process/responsibility (nginx serving the site, Express serving the API, MongoDB storing data). Easier to reason about, debug, and update.
- **Independent scaling** — if traffic grows, you can scale just the backend (run more `momo-backend` replicas) without touching the frontend or database.
- **Independent rebuilds/restarts** — a code change in `frontend/` only rebuilds/restarts the `momo-frontend` container; `momo-backend` and `momo-mongo` keep running untouched, so data and connections aren't disrupted.
- **Reusable, official images** — MongoDB is pulled as-is from Docker Hub instead of being built and maintained by us, since it already ships as a well-tested official image.
- **Isolation and security** — the backend and database aren't exposed to the host or the internet at all; only the frontend is published on port `3000`. Containers reach each other only over the internal Docker network compose creates.
- **Matches how the app actually works** — the three pieces are already separate processes talking over the network (HTTP calls, MongoDB wire protocol), so giving each its own container just mirrors that natural boundary instead of forcing them to share one filesystem/process space.

`docker-compose.yml` ties these separate containers together — defining how they're built, what ports they expose, and how they find each other by service name — so the whole stack still starts/stops with one command.

## Full-stack deployment (docker compose)

The app runs as three containers, all started with one command:

| Container | What it does | Port |
|---|---|---|
| `momo-frontend` | nginx serves the React site and forwards `/api/*` requests to the backend | `3000` on the host |
| `momo-backend` | Express API: `GET /api/reviews` lists reviews, `POST /api/reviews` saves one (`name` + `review`) | internal only (5000) |
| `momo-mongo` | MongoDB database that stores the reviews | internal only (27017) |

Only the frontend is published to the host. The backend and database are reachable only inside the Docker network that compose creates, where containers find each other by service name (`backend`, `mongo`).

On EC2, allow port **3000** (custom TCP) in the security group.

> On the EC2 Ubuntu instance, `docker.io` doesn't include compose. Install it with `sudo apt install docker-compose-v2`.

## Start everything

Run from the project root (where `docker-compose.yml` is):

```bash
docker compose up -d --build
```

- `up` — creates and starts all the services in `docker-compose.yml`
- `-d` — runs them in the background
- `--build` — builds the `momo-frontend` and `momo-backend` images first, so code changes are included

Visit `http://localhost:3000` (or `http://<instance-public-ip>:3000` on EC2), scroll to **Reviews**, and post one.

```bash
docker compose ps                  # status of the three containers
docker compose logs backend        # backend logs (e.g. "Connected to MongoDB")
```

To see the saved reviews inside MongoDB:

```bash
docker exec -it momo-mongo mongosh momo
```

```js
db.reviews.find()
exit
```

## Tag and push to Docker Hub

```bash
docker login
```

Log in with your Docker Hub username and password (or access token) — required before pushing any image.

Push the two images you built (MongoDB is an official image, so it doesn't need pushing):

```bash
docker tag momo-frontend <your-dockerhub-username>/momo-frontend:latest
docker tag momo-backend <your-dockerhub-username>/momo-backend:latest
docker push <your-dockerhub-username>/momo-frontend:latest
docker push <your-dockerhub-username>/momo-backend:latest
```

After pushing, log in to [hub.docker.com](https://hub.docker.com) in the browser to see both images listed under your repositories.

## Stop the containers

```bash
docker compose stop
```

```bash
docker ps       # running containers only — the momo containers should no longer appear
docker ps -a    # all containers, including stopped — the momo containers still show here
```

Start them again with `docker compose start`.

## Remove the containers

```bash
docker compose down
```

Stops and removes the containers and the network. Reviews are kept, because MongoDB stores its data in the `mongo-data` volume. To delete the reviews as well:

```bash
docker compose down -v
```

## Rebuild after code changes

Edits to files in `frontend/` or `backend/` aren't picked up by running containers — the images have to be rebuilt:

```bash
docker compose up -d --build
```

Only the changed services are rebuilt and restarted. Reviews in MongoDB are not affected.

## Pull and run from Docker Hub

On another machine (e.g. the EC2 instance), copy `docker-compose.yml`, then pull the images and give them the local names compose expects:

```bash
docker pull <your-dockerhub-username>/momo-frontend:latest
docker pull <your-dockerhub-username>/momo-backend:latest
docker tag <your-dockerhub-username>/momo-frontend:latest momo-frontend
docker tag <your-dockerhub-username>/momo-backend:latest momo-backend
docker compose up -d
```

Run without `--build`, so compose uses the pulled images instead of building from source. MongoDB is pulled automatically. Visit `http://localhost:3000` (or `http://<instance-public-ip>:3000`).

## View the volume on disk

Docker stores named volumes (like `mongo-data`) under `/var/lib/docker/volumes/`, which needs root access to browse:

```bash
sudo -i
cd /var/lib/docker
ls
cd volumes
ls
```

Look for a folder named `docker_mongo-data` (or `<project-folder-name>_mongo-data`) — that's where MongoDB's actual data files live on the host, outside any container.

```bash
exit
```

Leaves the root shell opened by `sudo -i`, back to your normal user.

# docker_I
