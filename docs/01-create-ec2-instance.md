# 01 — Create an EC2 Instance

Launch an Ubuntu server on AWS to host the Dockerized app.

## Steps

1. Go to **AWS Console → EC2 → Launch Instance**.
2. **Name:** give the instance a name (e.g. `docker-server`).
3. **Application and OS Image (AMI):** select **Ubuntu** (latest LTS).
4. **Instance type:** select **t3.small**.
5. **Key pair:** create a new key pair (or select an existing one) and download the `.pem` file. You need it for SSH access.
6. **Network settings:** allow **SSH (port 22)** and **HTTP (port 80)**.
7. **Configure storage:** set to **20 GiB**.
8. Click **Launch instance**.

## Open Port 80

The app is served on port `80` (HTTP). If you did not allow HTTP during launch, add this inbound rule to the instance's **Security Group**:

| Type | Port | Source |
|---|---|---|
| HTTP | `80` | `0.0.0.0/0` (or your IP) |

---

**Next:** [02 — SSH and Install Docker](02-ssh-and-install-docker.md)
