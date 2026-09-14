# Raadhe Academy - Production Deployment Guide (GHCR & Coolify)

This document describes the production deployment pipeline for **Raadhe Academy**. Docker images are built externally by **GitHub Actions** and stored in the **GitHub Container Registry (GHCR)**. **Coolify** pulls and runs the pre-built image, eliminating CPU and RAM build overhead on the production VPS.

---

## 1. Architecture Overview

```mermaid
flowchart LR
    A["Push to main / Manual Dispatch"] --> B["GitHub Actions\n(Hosted Runner)"]
    B --> C["Docker Multi-Stage Build\n+ GHA Layer Cache"]
    C --> D["Publish to GHCR\n(ghcr.io/navino0/radhe-academy)"]
    D -->|Pull Pre-Built Image| E["Coolify (VPS)\nContainer Runtime"]
    E --> F["academy.radhevastraz.in\n(Port 3000)"]
```

* **Build Location**: GitHub hosted runners (`ubuntu-latest`).
* **Artifact Registry**: GitHub Container Registry (`ghcr.io`).
* **Deployment Target**: Coolify on Ubuntu VPS (Zero compilation on the VPS).

---

## 2. GHCR Image & Tagging Convention

* **Registry**: `ghcr.io`
* **Image Repository**: `ghcr.io/navino0/radhe-academy`

Every build automatically publishes two types of tags:

| Tag | Format Example | Purpose |
| :--- | :--- | :--- |
| **Commit SHA (Immutable)** | `ghcr.io/navino0/radhe-academy:sha-5adb3fa` | **Recommended for production**. Ensures reproducible deployments and enables instant 1-click rollbacks. |
| **Latest** | `ghcr.io/navino0/radhe-academy:latest` | Automatically updated on every push to `main`. |

---

## 3. GitHub Container Registry (GHCR) Access

### Option A: Make Package Public (Recommended, Quickest)
If your application container image does not contain proprietary data (all code secrets are passed at runtime via environment variables):
1. Navigate to **GitHub Profile > Packages** or repository **Packages** at:  
   `https://github.com/navinO0?tab=packages`
2. Select `radhe-academy`.
3. Go to **Package Settings > Danger Zone > Change package visibility**.
4. Set to **Public**.
5. *Result: Coolify can pull images instantly without needing registry credentials.*

### Option B: Private Package (Authenticate Coolify with GitHub PAT)
If you prefer to keep the image private:
1. On GitHub, go to **Settings > Developer Settings > Personal Access Tokens > Tokens (classic)**.
2. Generate a new token named `coolify-ghcr` with the scope:
   - `read:packages`
3. In Coolify:
   - Go to **Sources > Docker Registries > Add Registry**.
   - **Type**: `Custom / GitHub Container Registry`
   - **Server**: `ghcr.io`
   - **Username**: Your GitHub username (`navinO0`)
   - **Password / Token**: The Personal Access Token created in step 2.

---

## 4. Configuring Coolify

In your Coolify Application settings:

### A. General & Build Settings
* **Build Pack / Strategy**: Change from `Dockerfile` to **`Docker Image`**.
* **Docker Image**:
  - To follow latest: `ghcr.io/navino0/radhe-academy:latest`
  - To pin a specific build: `ghcr.io/navino0/radhe-academy:sha-<short-sha>`
* **Watch paths**: Leave **empty**.

### B. Networking & Ports
* **Exposed Ports**: `3000`
* **Ports Exposed**: `3000`
* **Port Mappings**: Leave **empty** *(Traefik proxies internal traffic; host port binding is unnecessary).*

### C. Health Check
* **Healthcheck Path**: `/api/health`
* **Port**: `3000`

---

## 5. Required Production Environment Variables

Add these under **Coolify > Environment Variables**:

| Variable | Example Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | Production PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | `openssl rand -hex 32` | 32+ character authentication secret |
| `BETTER_AUTH_URL` | `https://academy.radhevastraz.in` | External production domain |
| `NEXT_PUBLIC_APP_URL`| `https://academy.radhevastraz.in` | Client application domain |
| `PORT` | `3000` | Application HTTP port |
| `NODE_ENV` | `production` | Production mode |
| `AUTO_MIGRATE` | `true` | Runs `prisma migrate deploy` on startup if DB schema changed |

---

## 6. Managing Database Migrations

You have two clean options to run migrations:

### Method 1: Automatic on Boot (Easiest)
Set the environment variable in Coolify:
```env
AUTO_MIGRATE=true
```
When the container boots, `docker-entrypoint.sh` will check database availability and apply any pending migrations before launching the Next.js server.

### Method 2: Decoupled via Pre-Deployment Command
In Coolify:
* Navigate to **Deployment Lifecycle > Pre-deployment command**.
* Add:
  ```bash
  prisma migrate deploy
  ```
* Set `AUTO_MIGRATE=false` in your environment variables.
* *Result: Migrations execute before the new web container accepts traffic.*

---

## 7. How to Rollback to a Previous Version

Because every build generates an immutable SHA tag:

1. Locate the commit SHA of the version you want to restore (e.g. from GitHub commit history, such as `3c250d5`).
2. In Coolify, update the **Docker Image** field to:
   ```text
   ghcr.io/navino0/radhe-academy:sha-3c250d5
   ```
3. Click **Deploy**.
4. Coolify pulls that exact image and starts it in seconds without building.

---

## 8. Manually Triggering Workflow Rebuilds

1. Go to your GitHub repository: `https://github.com/navinO0/radhe-academy`.
2. Click the **Actions** tab.
3. Select **Build and Publish Docker Image to GHCR** from the sidebar.
4. Click **Run workflow**, choose branch `main`, and click the green **Run workflow** button.

