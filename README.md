<div align="center">

# 💼 Nexus — Enterprise Invoicing & Cash Flow Management Platform

**A Production-Ready Full-Stack SaaS Solution for Digital Agencies, Freelancers & SMEs**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.10-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Resend](https://img.shields.io/badge/Resend-Email_API-black?style=for-the-badge&logo=resend)](https://resend.com/)

<p align="center">
  <b>Built by Dimas Adi Putra</b> — Full-Stack Software Engineer & Freelance Developer<br />
  <i>Available for contract work, custom SaaS development, and high-performance web applications.</i>
</p>

---

</div>

## 📌 Executive Overview

**Nexus** is an end-to-end financial operations and invoicing platform engineered to streamline client billing, automate overdue payment collection, and provide actionable cash flow visibility for modern digital agencies, creative studios, and freelance professionals.

Built with an enterprise-grade modern stack (**Next.js 16 App Router**, **React 19**, **TypeScript**, and **Prisma ORM with PostgreSQL Connection Pooling**), this project demonstrates commercial-ready software engineering: secure server actions, automated background crons, pixel-perfect server-side PDF generation, transactional email pipelines, and responsive data analytics.

> 💡 **Why this project in a Freelance Portfolio?**  
> Rather than a standard toy app, Nexus tackles real business problems: minimizing cash flow leakage, eliminating manual PDF creation, reducing late payments with multi-channel automation (Email & WhatsApp), and offering an intuitive client payment experience.

---

## ✨ Key Features & Capabilities

### 1. 📊 Executive Financial Dashboard & Analytics

- **Live KPI Metrics**: Real-time aggregation of cleared revenue (Paid), pending receivables, and overdue amounts with badge indicators.
- **Cash Flow Comparison Chart**: Interactive monthly cash flow visualization (Paid vs. Pending) powered by **Recharts**.
- **Recent Transaction Feed**: Instant snapshot of recent billing activities and statuses.

### 2. 🧾 Dynamic Invoicing Engine

- **Automated Sequential Numbering**: Safe monthly sequence generator adhering to business standards (`INV/YYYY/MM/XXX`).
- **Dynamic Multi-Item Calculations**: Real-time client-side calculation of line items, dynamic tax rates (PPN), and fixed or percentage discounts.
- **Comprehensive Status Lifecycle**: Strict state tracking across `DRAFT`, `SENT`, `PENDING`, `PAID`, and `OVERDUE`.
- **Relational Integrity**: Built on PostgreSQL with cascading foreign keys for line items.

### 3. 📄 Server-Side On-Demand PDF Invoicing

- **Headless PDF Streaming**: Generates pixel-perfect, branded PDF invoices on the fly using `@react-pdf/renderer` via custom Next.js Route Handlers (`/api/invoices/[id]/pdf`).
- **Zero Browser Dependencies**: Eliminates flaky client-side print dialogs and renders consistent, high-dpi documents.

### 4. ⏰ Automated Background Cron Jobs (Vercel Cron)

- **Daily Automated Overdue Audits**: Runs daily at midnight (`0 0 * * *`) via `/api/cron/reminders`.
- **Bearer Token Security**: Endpoint protected by `CRON_SECRET` authorization to block unauthorized calls.
- **Auto-State Transition**: Detects overdue unpaid invoices, promotes status to `OVERDUE`, and automatically dispatches email notifications.

### 5. 📩 Multi-Channel Notification Pipeline

- **Transactional Emails**: Styled responsive email notifications sent via **Resend API** and `@react-email/render`.
- **1-Click WhatsApp Billing**: Direct client messaging link generator pre-populated with client details, balance, due dates, and public invoice link.

### 6. 🌐 Public Client Invoicing Portal (`/invoices/[id]`)

- **Branded Invoice Display**: Responsive, client-accessible view for official invoices.
- **Integrated Payment Instructions**: Clear bank transfer details (e.g., BCA) and QRIS payment prompt.
- **Client Actions**: Instant PDF download, WhatsApp receipt sharing, and email triggering.

### 7. 👥 Client Relationship Management (CRM)

- **Centralized Client Directory**: Add, edit, search, and manage corporate clients.
- **Relational Billing History**: Track all active and historical invoices linked to each client.

### 8. 📈 Financial Reporting & Data Export

- **One-Click CSV Export**: Browser-based export engine converts invoice records into formatted CSV/Excel reports for bookkeeping.

---

## 🏗️ Architecture & Technical Design

Nexus is structured with clean separation of concerns, leveraging Next.js 16 full-stack features:

```mermaid
graph TD
    User([User / Browser])
    PublicUser([Client / WhatsApp / Email Link])

    subgraph Frontend["Frontend Layer (Next.js 16 App Router)"]
        AdminPages["Admin Dashboard & CRM (/clients, /invoices)"]
        PublicInvoicePage["Public Invoice Portal (/invoices/:id)"]
        Charts["Recharts Visualizations"]
    end

    subgraph Backend["Application & API Layer"]
        ServerActions["Server Actions (createInvoice, sendEmail, etc.)"]
        PDFRoute["PDF Route Handler (/api/invoices/:id/pdf)"]
        CronRoute["Vercel Cron Job (/api/cron/reminders)"]
    end

    subgraph Services["External Services & Integrations"]
        Resend["Resend Email API"]
        VercelCron["Vercel Cron Scheduler"]
        ReactPDF["@react-pdf/renderer"]
    end

    subgraph Database["Data Layer"]
        Prisma["Prisma ORM 7 (@prisma/adapter-pg)"]
        Postgres[(PostgreSQL Database)]
    end

    User --> AdminPages
    PublicUser --> PublicInvoicePage
    AdminPages --> ServerActions
    AdminPages --> Charts
    PublicInvoicePage --> PDFRoute

    ServerActions --> Prisma
    PDFRoute --> ReactPDF
    PDFRoute --> Prisma
    CronRoute --> Prisma
    CronRoute --> Resend
    ServerActions --> Resend
    VercelCron -->|Daily Trigger| CronRoute
    Prisma --> Postgres
```

---

## 🛠️ Tech Stack & Libraries

| Domain              | Technology / Library                                                         | Role & Rationale                                                  |
| ------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Framework**       | [Next.js 16](https://nextjs.org/) (App Router)                               | Modern hybrid rendering (RSC, Server Actions, Route Handlers)     |
| **Language**        | [TypeScript 5](https://www.typescriptlang.org/)                              | Strict typing across database models, forms, and API responses    |
| **Frontend UI**     | [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) | Cutting-edge UI performance and clean utility-first styling       |
| **Database ORM**    | [Prisma 7](https://www.prisma.io/) + `@prisma/adapter-pg`                    | Type-safe ORM with connection pooling for serverless environments |
| **Database**        | [PostgreSQL](https://www.postgresql.org/)                                    | ACID-compliant relational storage with cascading foreign keys     |
| **Data Viz**        | [Recharts](https://recharts.org/)                                            | Responsive SVG charts for monthly revenue and cash flow           |
| **Document Engine** | [@react-pdf/renderer](https://react-pdf.org/)                                | Server-side binary PDF generation                                 |
| **Email Service**   | [Resend](https://resend.com/) + `@react-email/render`                        | Developer-first transactional email API with React templates      |
| **Automation**      | Vercel Cron Jobs                                                             | Scheduled daily tasks for overdue invoice processing              |
| **Package Manager** | [pnpm](https://pnpm.io/)                                                     | Fast, deterministic dependency management                         |

---

## 📂 Project Directory Structure

```text
nexus/
├── prisma/
│   ├── migrations/          # Version-controlled database migrations
│   └── schema.prisma        # Prisma schema defining Client, Invoice, InvoiceItem
├── src/
│   ├── app/
│   │   ├── (admin)/         # Protected admin portal routes (Dashboard, Clients, Invoices)
│   │   │   ├── clients/     # Client CRM management interface
│   │   │   ├── invoices/    # Invoicing management & creation forms
│   │   │   ├── layout.tsx   # Admin dashboard shell with navigation sidebar
│   │   │   └── page.tsx     # Executive financial overview & KPI metrics
│   │   ├── actions/         # Next.js Server Actions (invoice, client, email, dashboard)
│   │   ├── api/
│   │   │   ├── cron/        # Cron endpoints (overdue detection & auto-reminders)
│   │   │   └── invoices/    # Dynamic PDF generation route (/api/invoices/[id]/pdf)
│   │   ├── invoices/[id]/   # Public-facing responsive invoice payment page
│   │   ├── globals.css      # Tailwind CSS configuration and theme tokens
│   │   └── layout.tsx       # Root HTML document and metadata setup
│   ├── components/
│   │   ├── clients/         # Client modal, search bar, and data tables
│   │   ├── dashboard/       # Recharts revenue & cash flow visualizer
│   │   ├── emails/          # React Email template markup
│   │   ├── invoices/        # Invoice forms, data tables, and PDF document template
│   │   ├── layout/          # Admin sidebar and brand components
│   │   └── ui/              # Reusable atomic UI components (Button, Input, Badge)
│   └── lib/
│       ├── email-renderer.ts# Asynchronous React Email HTML compilation
│       ├── export.ts        # Browser CSV export utility
│       ├── prisma.ts        # Singleton Prisma client with PostgreSQL adapter
│       └── resend.ts        # Resend SDK instance initialization
├── prisma7.config.ts        # Prisma 7 environment and datasource configuration
├── vercel.json              # Vercel Cron schedule declaration
└── package.json             # Scripts and production dependencies
```

---

## 🚀 Getting Started

Follow these steps to set up and run Nexus locally for evaluation or development:

### 1. Prerequisites

- **Node.js**: `v20.x` or later
- **pnpm**: `v9.x` or later (`npm install -g pnpm`)
- **PostgreSQL**: Local instance or hosted provider (Supabase, Neon, Railway, or AWS RDS)

### 2. Clone Repository

```bash
git clone https://github.com/dimasadiputra/nexus.git
cd nexus
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Configure Environment Variables

Copy `.env.example` to `.env` and provide your credentials:

```bash
cp .env.example .env
```

Fill in the required values in `.env`:

```env
# Shared transaction-mode pooler (IPv4 / connection pooling for runtime queries)
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"

# Direct connection to PostgreSQL (used by Prisma migrations and schema push)
DIRECT_URL="postgresql://user:password@host:5432/postgres"

# Application public base URL
BASE_URL="http://localhost:3000"

# Resend API Key for transactional billing emails
RESEND_API_KEY="re_xxxxxxxxxxxxxx"

# Secret token to secure Vercel Cron jobs (Optional for local testing)
CRON_SECRET="your-secure-cron-secret-key"
```

### 5. Setup Database & Prisma

Push the schema to your PostgreSQL database and generate the Prisma Client:

```bash
# Push schema directly or run migrations
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

### 6. Launch Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore the dashboard.

---

## ⚙️ Available Scripts

| Command      | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| `pnpm dev`   | Starts local Next.js development server with hot-reloading              |
| `pnpm build` | Compiles production build with TypeScript check and static optimization |
| `pnpm start` | Runs the compiled production build                                      |
| `pnpm lint`  | Runs ESLint analysis for code quality                                   |

---

## 👨‍💻 About the Developer

I'm **Dimas Adi Putra**, a Full-Stack Software Engineer specializing in building scalable web applications, business automation tools, and modern SaaS products with **Next.js**, **React**, **TypeScript**, and **Cloud Infrastructure**.

### 💼 Services Offered (Available for Hire)

- **Custom SaaS & MVP Development**: From zero to launch with modern, maintainable architectures.
- **Full-Stack Web Applications**: Scalable frontend and backend systems with high performance and accessibility.
- **Billing, Invoicing & Payment Integrations**: Stripe, Midtrans, Xendit, QRIS, and automated invoicing pipelines.
- **Workflow & Business Automation**: Background cron jobs, automated email/WhatsApp alerts, and CRM tools.
- **Database Architecture & Optimization**: PostgreSQL, Prisma ORM, connection pooling, and performance tuning.

### 📬 Let's Connect & Collaborate

- **Email**: [dimasadiputra528@gmail.com](mailto:dimasadiputra528@gmail.com)
- **GitHub**: [github.com/DimasAdiPutra](https://github.com/DimasAdiPutra)

---

<div align="center">
  <p>Crafted with precision, clean code, and business impact in mind.</p>
  <p>© 2026 Dimas Adi Putra. All rights reserved.</p>
</div>
