# 06 — Docker Hub: Push and Pull Images

Share the built images through Docker Hub, then run them on another machine without building from source.

## Log In

```bash
docker login
```

Log in with your Docker Hub username and password (or an access token). You must log in before you can push an image.

## Tag and Push

Only the two custom images need to be pushed. MongoDB is an official image, so it doesn't.

```bash
docker tag momo-frontend <your-dockerhub-username>/momo-frontend:latest
docker tag momo-backend  <your-dockerhub-username>/momo-backend:latest

docker push <your-dockerhub-username>/momo-frontend:latest
docker push <your-dockerhub-username>/momo-backend:latest
```

After pushing, log in to [hub.docker.com](https://hub.docker.com) to see both images listed under your repositories.

## Pull and Run on Another Machine

On another machine (e.g. the EC2 instance):

1. Copy `docker-compose.yml` to the machine.
2. Pull the images and tag them with the local names Compose expects:

```bash
docker pull <your-dockerhub-username>/momo-frontend:latest
docker pull <your-dockerhub-username>/momo-backend:latest

docker tag <your-dockerhub-username>/momo-frontend:latest momo-frontend
docker tag <your-dockerhub-username>/momo-backend:latest  momo-backend

docker compose up -d
```

Run **without** `--build`, so Compose uses the pulled images instead of building from source. MongoDB is pulled automatically.

Open `http://localhost` (or `http://<instance-public-ip>`).

---

**Previous:** [05 — Manage Containers](05-manage-containers.md) · **Next:** [07 — Data Persistence with Volumes](07-volumes.md)
