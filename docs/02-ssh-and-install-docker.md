# 02 — SSH and Install Docker

Connect to the EC2 instance, install Docker, and confirm it works.

## Connect via SSH

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@<instance-public-ip>
```

`chmod 400` makes the key file readable only by you. SSH refuses keys with looser permissions.

## Install Docker and Docker Compose

```bash
sudo apt update
sudo apt install docker.io
sudo apt install docker-compose-v2
```

> On Ubuntu, the `docker.io` package does not include Compose, so `docker-compose-v2` must be installed separately.

Run `docker` with no arguments to list all available commands.

## Check Docker Status

```bash
systemctl status docker
```

Shows whether the Docker service is running (`active`) or stopped.

```bash
sudo docker ps
```

Lists all currently running containers.

## Run Docker Without `sudo`

```bash
sudo usermod -aG docker ubuntu
newgrp docker
```

This adds the `ubuntu` user to the `docker` group, so Docker commands no longer need `sudo`.

| Flag / Command | Meaning |
|---|---|
| `-a` | **Append**: keep the user's existing groups and add the new one |
| `-G` | **Groups**: the group(s) to add the user to |
| `newgrp docker` | Applies the group change to the current session immediately. Otherwise you would need to log out and back in. |

You can now run commands without `sudo`:

```bash
docker ps        # list running containers
docker images    # list images available on this machine
```

## Test the Installation

```bash
docker pull hello-world
```

Downloads the `hello-world` image from Docker Hub.

```bash
docker run hello-world
```

Creates and runs a container from the image. It prints a confirmation message and exits, which confirms that Docker is installed and working.

---

**Previous:** [01 — Create an EC2 Instance](01-create-ec2-instance.md) · **Next:** [03 — Project Overview](03-project-overview.md)
