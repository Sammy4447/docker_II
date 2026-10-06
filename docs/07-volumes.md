# 07 — Data Persistence with Volumes

MongoDB stores its data in a **named volume** called `mongo-data`, mounted at `/data/db` inside the container:

```yaml
services:
  mongo:
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

A volume lives outside the container's filesystem. The data survives container rebuilds, restarts, and `docker compose down`. It is deleted only by `docker compose down -v`.

## View the Volume on Disk

Docker stores named volumes under `/var/lib/docker/volumes/`, which requires root access:

```bash
sudo -i
cd /var/lib/docker/volumes
ls
```

Look for a folder named `docker_mongo-data` (the format is `<project-folder-name>_mongo-data`). MongoDB's actual data files live there on the host.

When you are done, leave the root shell:

```bash
exit
```

---

**Previous:** [06 — Docker Hub](06-docker-hub.md) · **Back to:** [README](../README.md)
