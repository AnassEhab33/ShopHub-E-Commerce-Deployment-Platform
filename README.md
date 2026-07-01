# 🛒 ShopHub — E-Commerce Microservices Platform

A production-ready, Dockerized e-commerce application built with microservices architecture.
Built as the application layer of the **Automated E-Commerce Deployment Platform** DevOps project.

## Architecture

```
                        ┌─────────────────┐
                        │   Browser/User  │
                        └────────┬────────┘
                                 │
                        ┌────────▼─────────┐
                        │  Nginx (Port 80) │  ← API Gateway
                        └────────┬─────────┘
                                 │
        ┌──────────┬─────────────┼───────────┬──────────────┐
        │          │             │           │              │
   ┌────▼────┐ ┌───▼──────┐ ┌───▼────┐ ┌─────▼───┐ ┌────────▼──────┐
   │  user-  │ │ product- │ │ cart-  │ │ order-  │ │  payment-     │
   │ service │ │ service  │ │service │ │ service │ │  service      │
   │ :3001   │ │  :3002   │ │ :3003  │ │  :3004  │ │  :3005        │
   │Node.js  │ │  FastAPI │ │Node.js │ │ Node.js │ │  FastAPI      │
   └────┬────┘ └───┬──────┘ └───┬────┘ └─────┬───┘ └───────────────┘
        │          │            │            │
   ┌────▼────┐ ┌───▼──────┐ ┌───▼────┐ ┌─────▼───┐
   │Postgres │ │Postgres  │ │ Redis  │ │Postgres │
   │users_db │ │products  │ │ Cache  │ │orders_db│
   └─────────┘ └──────────┘ └────────┘ └─────────┘
                        ┌────────────────────────────┐
                        │   Frontend (Next.js 14)    │ :3000
                        └────────────────────────────┘
```

## Services

| Service | Language | Port | Database | Description |
|---|---|---|---|---|
| user-service | Node.js + Express | 3001 | PostgreSQL (users_db) | Auth, JWT, profiles |
| product-service | Python FastAPI | 3002 | PostgreSQL (products_db) | Products catalog |
| cart-service | Node.js + Express | 3003 | Redis | Shopping cart |
| order-service | Node.js + Express | 3004 | PostgreSQL (orders_db) | Order management |
| payment-service | Python FastAPI | 3005 | In-memory (mock) | Payment processing |
| frontend | Next.js 14 | 3000 | — | Web UI |
| nginx | Nginx | 80 | — | API Gateway |

## Quick Start (Local Dev)

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd DEPI-DevOps-project

# 2. Copy environment variables
cp .env.example .env

# 3. Start everything
docker-compose up --build

# 4. Access the app
open http://localhost
```

## API Endpoints

### User Service (`/api/auth`, `/api/users`)
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/users/me | Get profile (🔒 JWT) |
| PUT | /api/users/me | Update profile (🔒 JWT) |

### Product Service (`/api/products`, `/api/categories`)
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/products/ | List all (pagination + search) |
| GET | /api/products/:id | Product detail |
| POST | /api/products/ | Create product |

### Cart Service (`/api/cart`)
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/cart/:userId | Get cart |
| POST | /api/cart/:userId/add | Add item |
| PUT | /api/cart/:userId/item/:productId | Update quantity |
| DELETE | /api/cart/:userId/item/:productId | Remove item |
| DELETE | /api/cart/:userId | Clear cart |

### Order Service (`/api/orders`)
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/orders/ | Create order |
| GET | /api/orders/user/:userId | Order history |
| GET | /api/orders/:id | Order detail |
| PUT | /api/orders/:id/status | Update status |

### Payment Service (`/api/payments`)
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/payments/process | Process payment (mock) |
| GET | /api/payments/:id | Payment status |

## Health Checks

All services expose a `/health` endpoint:
```bash
curl http://localhost/health/users
curl http://localhost/health/products
curl http://localhost/health/cart
curl http://localhost/health/orders
curl http://localhost/health/payments
```

## Mock Payment Testing

The payment service simulates real payment processing:
- ✅ **Success**: Any valid card number (e.g., `4111 1111 1111 1111`)
- ❌ **Declined**: Any card number ending in `0000`

## DevOps Integration Points

This application is designed for DevOps tooling:

- **Docker**: Every service has a multi-stage `Dockerfile`
- **Docker Compose**: Full local orchestration with `docker-compose.yml`
- **Health Checks**: All services have `/health` endpoints for K8s liveness/readiness probes
- **Environment Variables**: All config via `.env` (no hardcoded secrets)
- **Prometheus**: Add `prom-client` (Node) or `prometheus-fastapi-instrumentator` (Python) for metrics
- **Nginx**: API Gateway config in `nginx/nginx.conf`
- **Ports**: All services expose distinct ports for K8s NodePort/service mapping

## Environment Variables

See `.env.example` for all required variables.

## Project Structure

```
DEPI-DevOps-project/
├── services/
│   ├── user-service/          # Node.js + PostgreSQL + JWT
│   ├── product-service/       # Python FastAPI + PostgreSQL
│   ├── cart-service/          # Node.js + Redis
│   ├── order-service/         # Node.js + PostgreSQL
│   └── payment-service/       # Python FastAPI (mock)
├── frontend/                  # Next.js 14
├── nginx/                     # API Gateway config
├── db/                        # DB init scripts
├── docker-compose.yml
├── .env.example
└── README.md
```
----------------------------------------------------------------------------------------------------

## Team Members & Conributions:
Anass Ehab Einshouka (Docker, Docker Compose, Kubernetes)
Tawfiq Hashim (CI/CD pipeline)
Ahmed Ammar (Cloud)
Ibrahim Abdallah (Ansible)

Instructor:
Eng.Ahmed Gamil
