# SkillBridge — Service Marketplace Platform

A full-stack service marketplace built with **React + Spring Boot + MySQL + JWT**.

## Project Structure
```
2HOURS/
├── backend/         Spring Boot REST API
├── frontend/        React + Vite frontend
└── schema.sql       MySQL database schema
```

---

## ⚡ Quick Setup (CMD Commands)

### Step 1 — Create Database

```cmd
mysql -u root -pnikunjjain2005@SQL < schema.sql
```

---

### Step 2 — Run Backend

```cmd
cd backend
mvnw.cmd spring-boot:run
```

> First run downloads dependencies (~2 min). Backend starts on **http://localhost:8080**
> 
> On startup it automatically creates:
> - ✅ Admin user: `admin@skillbridge.com` / `Admin@123`
> - ✅ 8 default categories

If `mvnw.cmd` not found, run:
```cmd
mvn spring-boot:run
```

---

### Step 3 — Run Frontend

Open a **new CMD window**:

```cmd
cd frontend
npm install
npm run dev
```

Frontend starts on **http://localhost:5173**

---

## 🔑 Default Accounts

| Role  | Email                     | Password   |
|-------|---------------------------|------------|
| Admin | admin@skillbridge.com     | Admin@123  |
| User  | Register via /register    | Your choice|

---

## 📡 API Endpoints

### Auth (Public)
| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| POST   | /api/auth/register    | Register new user  |
| POST   | /api/auth/login       | Login, get JWT     |
| GET    | /api/auth/me          | Get current user   |

### Services
| Method | Endpoint                     | Auth      |
|--------|------------------------------|-----------|
| GET    | /api/services                | Public    |
| GET    | /api/services/{id}           | Public    |
| GET    | /api/services/my             | USER      |
| POST   | /api/services                | USER      |
| PUT    | /api/services/{id}           | USER      |
| DELETE | /api/services/{id}           | USER      |

Query params for GET /api/services:
- `search`, `categoryId`, `minPrice`, `maxPrice`, `page`, `size`, `sortBy`

### Bookings
| Method | Endpoint                     | Auth      |
|--------|------------------------------|-----------|
| POST   | /api/bookings                | USER      |
| GET    | /api/bookings/my             | USER      |
| GET    | /api/bookings/received       | USER      |
| PATCH  | /api/bookings/{id}/status    | USER      |

### Reviews
| Method | Endpoint                     | Auth      |
|--------|------------------------------|-----------|
| POST   | /api/reviews                 | USER      |
| GET    | /api/reviews/service/{id}    | Public    |

### Admin
| Method | Endpoint                        | Auth      |
|--------|---------------------------------|-----------|
| GET    | /api/admin/stats                | ADMIN     |
| GET    | /api/admin/users                | ADMIN     |
| DELETE | /api/admin/users/{id}           | ADMIN     |
| GET    | /api/admin/services             | ADMIN     |
| PATCH  | /api/admin/services/{id}/toggle | ADMIN     |

---

## 🔐 JWT Auth Flow

1. `POST /api/auth/login` → returns `{ token, userId, name, email, role }`
2. Store token in `localStorage`
3. Send `Authorization: Bearer <token>` on every protected request
4. Spring Boot validates token on every request via `JwtAuthFilter`
5. Token expires in **24 hours**

---

## 🗄️ Database Schema

```
users → categories
services (provider→users, category→categories)
bookings (service→services, client→users)
reviews (booking→bookings, reviewer→users)
```

---

## 🛠️ Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | React 18, React Router 6, Vite |
| HTTP       | Fetch API (no Axios)          |
| Backend    | Spring Boot 3.2, Java 17      |
| Security   | Spring Security + JWT (jjwt)  |
| Database   | MySQL 8                       |
| ORM        | Spring Data JPA / Hibernate   |

---

## 🚨 Troubleshooting

**Backend won't start:**
- Check MySQL is running: `mysql -u root -p`
- Verify credentials in `backend/src/main/resources/application.properties`

**CORS errors:**
- Make sure frontend runs on port `5173` (Vite default)
- Backend must be on port `8080`

**mvnw not found:**
- Install Maven and use `mvn spring-boot:run` instead
