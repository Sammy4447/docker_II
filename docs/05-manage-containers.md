# 05 — Manage Containers

Stop, start, remove, and rebuild the app's containers.

## Stop the Containers

```bash
docker compose stop
```

Verify:

```bash
docker ps       # running containers only: the momo containers no longer appear
docker ps -a    # all containers, including stopped ones: the momo containers still appear
```

Start them again with:

```bash
docker compose start
```

## Remove the Containers

```bash
docker compose down
```

Stops and removes the containers and the network. **Reviews are kept**, because MongoDB stores its data in the `mongo-data` volume (see [07 — Data Persistence with Volumes](07-volumes.md)).

To delete the volume (and all reviews) as well:

```bash
docker compose down -v
```

## Rebuild After Code Changes

Running containers do not pick up edits made in `frontend/` or `backend/`, so the images must be rebuilt:

```bash
docker compose up -d --build
```

Only the changed services are rebuilt and restarted. Data in MongoDB is not affected.

---

**Previous:** [04 — Run with Docker Compose](04-run-with-docker-compose.md) · **Next:** [06 — Docker Hub](06-docker-hub.md)
