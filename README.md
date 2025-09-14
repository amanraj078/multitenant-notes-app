# 📝 Multi-Tenant Notes App

A minimal **multi-tenant notes application** built with **Next.js (App Router)** and **Supabase (Postgres + Drizzle ORM)**.  
This project demonstrates authentication, tenant-based authorization, role-based access control (Admin/Member), and subscription-based feature limits.

---

## 🚀 Features

-   **Authentication**

    -   Login with email & password.
    -   Passwords hashed with bcrypt.
    -   JWT tokens issued & stored in localStorage.

-   **Multi-Tenancy**

    -   Each user belongs to a tenant (organization).
    -   Tenant slug/name carried inside JWT.
    -   All data is scoped by tenant.

-   **Roles**

    -   **Admin**: Can upgrade tenant's subscription plan.
    -   **Member**: Can create notes (limited on free plan).

-   **Notes CRUD**

    -   Create, Read, Update, Delete notes.
    -   Notes are tenant-scoped (users see only their organization's notes).

-   **Plans**

    -   Free plan: Max 3 notes per tenant.
    -   Pro plan: Unlimited notes (Admin can upgrade).

-   **Frontend (Next.js 13 App Router)**
    -   Login page with JWT storage.
    -   Protected routes (redirects to login if token missing).
    -   Notes list page with edit/delete.
    -   Navbar showing tenant name + logout button.

---

## 🛠 Tech Stack

-   **Frontend:** Next.js (App Router), Tailwind CSS, React Context API
-   **Backend:** Next.js API Routes
-   **Database:** Supabase (Postgres) + Drizzle ORM
-   **Auth:** JWT (custom implementation with role & tenant info)
-   **Other:** bcryptjs for hashing, CORS middleware

---

## 📂 Project Structure

```
saas-notes-app/
├── prisma/
│   ├── schema.prisma        # DB schema (tenants, users, notes)
│   └── seed.ts              # Seed tenants + users (acme/globex)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Redirect → /login or /notes
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx     # Login page (form → call /api/auth/login)
│   │   │
│   │   ├── notes/
│   │   │   ├── page.tsx     # Notes list + Create + Delete
│   │   │   └── NoteCard.tsx # UI component for note
│   │   │
│   │   ├── upgrade/
│   │   │   └── page.tsx     # Upgrade CTA page → call /api/tenants/[slug]/upgrade
│   │   │
│   │   └── api/             # Backend APIs (App Router routes)
│   │       ├── health/route.ts      # GET /api/health
│   │       ├── auth/
│   │       │   └── login/route.ts   # POST /api/auth/login
│   │       ├── notes/
│   │       │   ├── route.ts         # GET, POST /api/notes
│   │       │   └── [id]/route.ts    # GET, PUT, DELETE /api/notes/:id
│   │       └── tenants/
│   │           └── [slug]/
│   │               └── upgrade/route.ts   # POST /api/tenants/:slug/upgrade
│   │
│   ├── lib/
│   │   ├── prisma.ts         # Prisma client instance
│   │   ├── auth.ts           # JWT utils (sign, verify, middleware)
│   │   ├── middleware.ts     # Tenant + role enforcement
│   │   └── constants.ts      # roles, plans, etc.
│   │
│   ├── components/
│   │   ├── AuthProvider.tsx  # Context for storing JWT in client
│   │   ├── Navbar.tsx        # Simple top nav
│   │   └── UpgradeBanner.tsx # Show when free plan note limit hit
│   │
│   └── styles/
│       └── globals.css
│
├── .env                     # DATABASE_URL, JWT_SECRET, etc.
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/amanraj078/quiet-hour-schedular.git
cd quiet-hour-schedular
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create `.env.local`:

```env
DATABASE_URL=<your-supabase-db-url>
JWT_SECRET=<random-secret>
```

### 4. Database Setup

Database schema defined with Drizzle ORM in `db/schema.ts`.

Run migrations:

```bash
npx drizzle-kit push
```

### 5. Run Dev Server

```bash
npm run dev
```

---

## 🔑 Test Flow

### Login

-   POST `/api/auth/login` with `{ email, password }`.
-   Receive JWT.

### Use Notes APIs

-   GET `/api/notes` → all notes for tenant.
-   POST `/api/notes` → create a new note (limited to 3 on free plan).
-   PUT `/api/notes/:id` → update note.
-   DELETE `/api/notes/:id` → delete note.

### Upgrade Plan (Admin only)

-   POST `/api/tenants/:slug/upgrade`
-   Upgrades tenant to Pro → unlimited notes.

---

## ⚠️ Known Issues / Limitations

-   Only Login flow implemented (no signup, user seeding must be manual via Supabase dashboard).
-   Admin cannot yet view/manage users of tenant (out of minimal scope).
-   No calendar UI / advanced dashboard (not required for assignment).
-   Styling is minimal (Tailwind-based).

---

## 🌐 Deployment

Deployed on Vercel

---

## 📌 Notes

This project was built as an assignment to demonstrate:

-   Secure multi-tenant backend design.
-   JWT-based authentication.
-   Role & subscription enforcement.
-   Next.js App Router frontend integration.
