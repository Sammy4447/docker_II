# Momo Site — Dockerized Full-Stack App

A review site built from a Vite + React frontend (served by nginx), a Node/Express backend, and a MongoDB database. Each part runs in its own container, and Docker Compose runs them together. The app is deployed on an AWS EC2 instance.

## Guides

Follow these in order:

| # | Guide | What it covers |
|---|---|---|
| 01 | [Create an EC2 Instance](docs/01-create-ec2-instance.md) | Launch an Ubuntu server on AWS and open port 80 (HTTP) |
| 02 | [SSH and Install Docker](docs/02-ssh-and-install-docker.md) | Connect to the server, install Docker and Compose, run Docker without `sudo` |
| 03 | [Project Overview](docs/03-project-overview.md) | Architecture, folder structure, and why the app uses multiple containers |
| 04 | [Run with Docker Compose](docs/04-run-with-docker-compose.md) | Build and start the stack, check logs, inspect MongoDB |
| 05 | [Manage Containers](docs/05-manage-containers.md) | Stop, start, remove, and rebuild containers |
| 06 | [Docker Hub](docs/06-docker-hub.md) | Push images to Docker Hub and pull them on another machine |
| 07 | [Data Persistence with Volumes](docs/07-volumes.md) | How the `mongo-data` volume keeps reviews safe |

## Quick Start

```bash
docker compose up -d --build
```

Then open `http://localhost` (or `http://<instance-public-ip>` on EC2).

## Command Cheat Sheet

| Task | Command |
|---|---|
| Build and start everything | `docker compose up -d --build` |
| Show container status | `docker compose ps` |
| View backend logs | `docker compose logs backend` |
| Stop containers | `docker compose stop` |
| Start stopped containers | `docker compose start` |
| Remove containers (keep data) | `docker compose down` |
| Remove containers and data | `docker compose down -v` |
| Open the MongoDB shell | `docker exec -it momo-mongo mongosh momo` |
| List running containers | `docker ps` |
| List all containers | `docker ps -a` |
| List images | `docker images` |
