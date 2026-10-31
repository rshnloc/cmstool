# Chronicle CMS & Digital Publication Platform

A modern, high-performance Content Management System (CMS) and public website architecture built with **Python (FastAPI)** and **TypeScript (React + Tailwind CSS)**.

> **Privacy & Security Notice**: All credentials, seed user emails, phone numbers, and street addresses included in this project are strictly fictitious, RFC-compliant synthetic demonstration data (e.g. `@example.org`, `+1-555-0199`). No real personal or confidential data is used.

---

## 🛠 System Architecture

- **Backend**:
  - **Framework**: Python 3.10+ FastAPI (high-performance asynchronous REST API)
  - **Database**: SQLite via SQLAlchemy 2.0 ORM (zero-config, stored in `backend/data/cms.db`)
  - **Data Validation**: Pydantic v2 schemas
  - **Authentication**: JWT bearer token authentication with PBKDF2-HMAC-SHA256 salted password hashing
  - **Media Management**: Local file storage under `backend/uploads/` served statically
  - **Interactive API Docs**: Auto-generated Swagger UI (`/docs`) and ReDoc (`/redoc`)

- **Frontend**:
  - **Framework**: TypeScript, React 18, Vite
  - **Styling**: Tailwind CSS
  - **Icons**: Lucide React
  - **Routing**: React Router v6
  - **Public Website**: Hero showcase, article catalog with topic filtering, reader view with formatted Markdown, dynamic pages (About, Contact, Privacy), full-text search
  - **CMS Admin Studio**: Overview dashboard with metrics, post manager & rich markdown editor, page builder, media library, taxonomy manager, and live site settings

---

## 🚀 How to Run the Project

### Option 1: One-Command Start (Recommended)

From the project root directory (`cmstool`), simply execute:

```bash
./run.sh
```

This script will:
1. Activate the Python virtual environment and ensure dependencies are installed.
2. Initialize and seed the SQLite database with realistic demonstration articles, pages, categories, and accounts.
3. Start the FastAPI backend on `http://127.0.0.1:8000`.
4. Launch the Vite TypeScript frontend on `http://localhost:3000`.

---

### Option 2: Step-by-Step Manual Run (Two Terminals)

If you prefer to run the backend and frontend in separate terminals:

#### Terminal 1 — Python Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   ```bash
   source .venv/bin/activate
   ```
3. (First time only) Seed the database with sample content and demo accounts:
   ```bash
   PYTHONPATH=. python3 seed_data.py
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   *The backend will be live at `http://127.0.0.1:8000` with Swagger docs at `http://127.0.0.1:8000/docs`.*

---

#### Terminal 2 — TypeScript Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The website will be live at `http://localhost:3000`.*

---

## 🔑 Demo Access Accounts

| Role | Username | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin123` | Full access: Posts, Pages, Media, Taxonomy, Site Settings |
| **Editor** | `editor` | `editor123` | Content access: Posts, Pages, Media, Taxonomy |

*(The login screen also provides quick one-click autofill buttons for both demo roles.)*

---

## 🌐 URLs & Key Navigation

- **Public Website**: [http://localhost:3000](http://localhost:3000)
- **All Articles Catalog**: [http://localhost:3000/articles](http://localhost:3000/articles)
- **About Page**: [http://localhost:3000/page/about](http://localhost:3000/page/about)
- **Contact Page**: [http://localhost:3000/page/contact](http://localhost:3000/page/contact)
- **CMS Admin Studio**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Interactive Swagger API Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc Documentation**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 📁 Project Structure

```
cmstool/
├── run.sh                          # One-click start script for both services
├── README.md                       # Complete guide & documentation
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py           # App settings & environment configuration
│   │   │   ├── database.py         # SQLAlchemy engine & session factory
│   │   │   ├── deps.py             # Auth & RBAC dependencies
│   │   │   └── security.py         # JWT tokens & PBKDF2 password hashing
│   │   ├── models/
│   │   │   └── entities.py         # User, Post, Page, Category, Tag, Media, Setting
│   │   ├── routers/
│   │   │   ├── auth.py             # /api/auth (login, profile)
│   │   │   ├── posts.py            # /api/posts (CRUD, status filtering)
│   │   │   ├── pages.py            # /api/pages (CRUD, slug lookup)
│   │   │   ├── categories.py       # /api/categories & /api/tags
│   │   │   ├── media.py            # /api/media (upload, delete)
│   │   │   ├── settings.py         # /api/settings (batch updates)
│   │   │   ├── public.py           # /api/public (content delivery API)
│   │   │   └── analytics.py        # /api/analytics (dashboard stats)
│   │   ├── schemas/
│   │   │   └── pydantic_models.py  # Pydantic v2 request/response validation schemas
│   │   └── main.py                 # FastAPI application root & middleware
│   ├── data/
│   │   └── cms.db                  # SQLite database
│   ├── uploads/                    # Uploaded media storage
│   ├── requirements.txt            # Python dependencies
│   └── seed_data.py                # Database population script (mock data only)
└── frontend/
    ├── src/
    │   ├── api/client.ts           # Typed API client with token injection
    │   ├── components/             # Navbar, Footer, Sidebar, Header, Markdown, MediaPicker
    │   ├── context/AuthContext.tsx # React Auth Context
    │   ├── pages/
    │   │   ├── website/            # Home, BlogIndex, BlogPostDetail, DynamicPage, Search
    │   │   └── admin/              # Dashboard, PostsManager, PostEditor, PagesManager, Media, Settings
    │   ├── types/index.ts          # TypeScript domain interfaces
    │   ├── App.tsx                 # Routing layout
    │   └── main.tsx                # React entrypoint
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts              # Vite proxy to backend port 8000
```

