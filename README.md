
# VESTIOR

### Premium Men's Fashion E-Commerce Platform

A modern, full-stack e-commerce platform built for premium men's fashion. VESTIOR combines an editorial shopping experience with a powerful commerce backend, AI-assisted product discovery, and a comprehensive administration system.

<p align="center">
  <a href="https://vestior.vercel.app">
    <img src="https://img.shields.io/badge/Live_Demo-Visit_VESTIOR-111111?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  <a href="./docs/">
    <img src="https://img.shields.io/badge/Documentation-Explore_Docs-2563EB?style=for-the-badge&logo=readthedocs&logoColor=white" alt="Documentation" />
  </a>
  <a href="./LICENSE.txt">
    <img src="https://img.shields.io/badge/License-MIT-16A34A?style=for-the-badge" alt="MIT License" />
  </a>
</p>

<p align="center">
  <a href="https://nextjs.org">
    <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js" />
  </a>
  <a href="https://react.dev">
    <img src="https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react" alt="React" />
  </a>
  <a href="https://www.typescriptlang.org">
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  </a>
  <a href="https://tailwindcss.com">
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
  </a>
  <a href="https://supabase.com">
    <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase" alt="Supabase" />
  </a>
  <a href="https://www.mongodb.com">
    <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb" alt="MongoDB" />
  </a>
  <a href="https://stripe.com">
    <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe" alt="Stripe" />
  </a>
  <a href="https://upstash.com">
    <img src="https://img.shields.io/badge/Upstash-Redis_&_QStash-DC382D?style=flat-square&logo=redis" alt="Upstash" />
  </a>
  <a href="https://vercel.com">
    <img src="https://img.shields.io/badge/Deployment-Vercel-black?style=flat-square&logo=vercel" alt="Vercel" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/zainshah3464/vestior-store/actions/workflows/ci.yml">
    <img src="https://github.com/zainshah3464/vestior-store/actions/workflows/ci.yml/badge.svg" alt="CI Status" />
  </a>
  <a href="https://github.com/zainshah3464/vestior-store/issues">
    <img src="https://img.shields.io/github/issues/zainshah3464/vestior-store?style=flat-square" alt="GitHub Issues" />
  </a>
  <a href="https://github.com/zainshah3464/vestior-store/stargazers">
    <img src="https://img.shields.io/github/stars/zainshah3464/vestior-store?style=flat-square" alt="GitHub Stars" />
  </a>
  <a href="https://github.com/zainshah3464/vestior-store/network/members">
    <img src="https://img.shields.io/github/forks/zainshah3464/vestior-store?style=flat-square" alt="GitHub Forks" />
  </a>
</p>

<p align="center">
  <a href="https://hub.xerj.org/contributors/zainshah3464">
    <img src="https://hub.xerj.org/contributors/zainshah3464/badge.svg" alt="XERJ Corpus Hub Contributor" />
  </a>
</p>

---

## Overview

VESTIOR is a full-stack, single-vendor e-commerce platform designed around premium men's fashion, including suits, coats, trousers, waistcoats, Gurkha styles, and coordinated two-piece and three-piece collections.

It combines a customer-facing storefront with a feature-rich administration dashboard and a backend built around secure operations, clear data ownership, reliable background processing, and maintainable service integrations.

Beyond a traditional product catalog and checkout experience, VESTIOR brings together the systems needed to operate an online fashion business — from product discovery and payments to customer management, analytics, automation, and AI-assisted shopping.

**Live application:** [vestior.vercel.app](https://vestior.vercel.app)

**Repository:** [github.com/zainshah3464/vestior-store](https://github.com/zainshah3464/vestior-store)

## Key Features

### Customer Experience

- **Editorial storefront** — Responsive homepage, category browsing, collections, and modern interactions.
- **Product discovery** — Search, filtering, sorting, product details, and product recommendations.
- **Shopping cart** — Persistent cart experience with quantity management and stock validation.
- **Secure checkout** — Server-validated checkout with Stripe and Cash on Delivery support.
- **Customer accounts** — Registration, login, Google OAuth, email verification, and password recovery.
- **Orders and invoices** — Order history, status tracking, and print-optimized invoices.
- **Wishlist** — Customer wishlist with backend synchronization.
- **Product reviews** — Customer ratings, verified-purchase indicators, and moderation.
- **AI shopping assistant** — Groq-powered conversational assistance with tool-based product discovery and order-related capabilities.
- **Progressive Web App** — Installable experience, service worker, caching, and offline fallback.

### Administration

- **Dashboard** — Centralized overview of store operations and business activity.
- **Product management** — Product creation, editing, inventory, and image management.
- **Order management** — Order details, status updates, payment handling, and email resending.
- **Customer management** — User information, roles, and activity history.
- **Payment management** — Transaction records and Stripe refund operations.
- **Marketing tools** — Coupons, abandoned-cart recovery, and product reviews.
- **Analytics** — Visitor activity, sessions, product performance, and sales reporting.
- **Email operations** — Transactional email logs, delivery status, and administrative controls.
- **Audit logging** — Recorded administrative actions and operational history.
- **Data exports** — CSV exports and print-optimized PDF workflows.
- **Real-time notifications** — Administrative notifications for important store activity.

### Backend & Reliability

- Server-side validation and authorization.
- PostgreSQL atomic operations for critical commerce workflows.
- Webhook verification and idempotency safeguards.
- Redis-backed caching and rate limiting.
- QStash-powered background jobs and scheduled processing.
- Transactional email delivery with reusable templates.
- Structured database ownership across Supabase and MongoDB.
- Graceful handling of optional infrastructure failures.

For the complete feature inventory and implementation details, see [Feature Documentation](./docs/features.md).

---

## Screenshots

Explore VESTIOR's customer storefront, administration dashboard, and transactional email designs. A selection of screenshots is displayed below, with the complete galleries available in expandable sections.

### Lighthouse Performance

Google PageSpeed Insights results from the production application.

| Metric | Desktop | Mobile |
|---|:---:|:---:|
| **Performance** | **96** | **92** |
| **Accessibility** | **100** | **100** |
| **Best Practices** | **100** | **100** |
| **SEO** | **100** | **100** |

**Desktop — Performance Score: 96**

![VESTIOR Desktop PageSpeed Insights Report](./public/images/lighthouse-desktop.png)

**Mobile — Performance Score: 92**

![VESTIOR Mobile PageSpeed Insights Report](./public/images/lighthouse-mobile.png)

<sub>Audit date: October 27, 2026. Scores represent the attached Lighthouse reports and may vary depending on device emulation, network conditions, browser versions, and audit configuration. Real-user field data was unavailable in these reports.</sub>

---

### Customer-Facing Experience

A look at the storefront, product discovery, shopping, and customer account experience.

**Homepage**

![VESTIOR Homepage](./public/images/customer_facing-images/home-page.jpg)

**Product Page**

![VESTIOR Product Page](./public/images/customer_facing-images/product-page.jpg)

**Category Browsing**

![VESTIOR Category Page](./public/images/customer_facing-images/home-category-page.jpg)

<details>
<summary><strong>View all customer-facing screenshots (9)</strong></summary>

**Homepage**

![Homepage](./public/images/customer_facing-images/home-page.jpg)

**Category Page**

![Category Page](./public/images/customer_facing-images/home-category-page.jpg)

**Product Page**

![Product Page](./public/images/customer_facing-images/product-page.jpg)

**Product Quick View**

![Product Quick View](./public/images/customer_facing-images/product-id-page-quickview.jpg)

**Shopping Cart**

![Shopping Cart](./public/images/customer_facing-images/cart-page.jpg)

**Checkout**

![Checkout](./public/images/customer_facing-images/checkout-page.jpg)

**Customer Orders**

![Customer Orders](./public/images/customer_facing-images/customer-order-page.jpg)

**Order Details**

![Order Details](./public/images/customer_facing-images/customer-order-id-page.jpg)

**Order Invoice**

![Order Invoice](./public/images/customer_facing-images/customer-order-id-invoice.jpg)

</details>

---

### Administration Dashboard

A preview of the administrative interface and store management tools.

**Admin Dashboard**

![VESTIOR Admin Dashboard](./public/images/admin_pages-images/admin-dashboard.jpg)

**Analytics**

![VESTIOR Admin Analytics](./public/images/admin_pages-images/admin-analytics-page.jpg)

<details>
<summary><strong>View all admin dashboard screenshots (10)</strong></summary>

**Admin Dashboard**

![Admin Dashboard](./public/images/admin_pages-images/admin-dashboard.jpg)

**Analytics**

![Analytics](./public/images/admin_pages-images/admin-analytics-page.jpg)

**Product Management**

![Product Management](./public/images/admin_pages-images/admin-product-management-page.jpg)

**Order Management**

![Order Management](./public/images/admin_pages-images/admin-order-management-page.jpg)

**Payment Management**

![Payment Management](./public/images/admin_pages-images/admin-payment-managemet-page.jpg)

**Coupon Management**

![Coupon Management](./public/images/admin_pages-images/admin-coupons-management-page.jpg)

**Review Approval**

![Review Approval](./public/images/admin_pages-images/admin-review-approvel-page.jpg)

**Abandoned Cart Management**

![Abandoned Cart Management](./public/images/admin_pages-images/admin-abandoned-cart-management-page.jpg)

**Reports**

![Reports](./public/images/admin_pages-images/admin-report-page.jpg)

**Export Center**

![Export Center](./public/images/admin_pages-images/admin-export-center-page.jpg)

</details>

---

### Transactional Email Templates

Email designs used for customer notifications and account-related workflows.

**Order Confirmation**

![Order Confirmation Email](./public/images/email_template_images/order-confirmed-email.jpg)

**Payment Success**

![Payment Success Email](./public/images/email_template_images/payment-succes.jpg)

<details>
<summary><strong>View all email template screenshots (7)</strong></summary>

**Order Confirmation**

![Order Confirmation](./public/images/email_template_images/order-confirmed-email.jpg)

**Payment Success**

![Payment Success](./public/images/email_template_images/payment-succes.jpg)

**Order Shipped**

![Order Shipped](./public/images/email_template_images/shipped-email.jpg)

**Order Delivered**

![Order Delivered](./public/images/email_template_images/delivered.jpg)

**Order Cancelled**

![Order Cancelled](./public/images/email_template_images/cancelled-email.jpg)

**Abandoned Cart**

![Abandoned Cart Email](./public/images/email_template_images/abandoned-card-email.jpg)

**Password Reset**

![Password Reset Email](./public/images/email_template_images/reset-email-template.jpg)

</details>

---

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling & UI | Tailwind CSS 4, Framer Motion, Lucide |
| Primary database | Supabase, PostgreSQL |
| Secondary database | MongoDB Atlas |
| Authentication | Supabase Auth |
| Payments | Stripe, Cash on Delivery |
| Cache & rate limiting | Upstash Redis |
| Background jobs | Upstash QStash |
| AI | Groq, AI SDK |
| Email | Nodemailer, Gmail SMTP, Resend |
| Charts & analytics UI | Recharts |
| Validation | Zod |
| Testing | Vitest, Testing Library, Playwright |
| Deployment | Vercel |

### Data Ownership

VESTIOR separates responsibilities across its data systems:

- **Supabase / PostgreSQL** — Transactional application data, authentication-related data, customers, products, orders, reviews, wishlists, and coupons.
- **MongoDB Atlas** — Event tracking, sessions, email logs, payment records, audit data, and cart-related supporting data.
- **Upstash Redis** — Ephemeral state, caching, rate limiting, idempotency, and temporary operational data.
- **Upstash QStash** — Background task delivery, retries, and scheduled processing.

This separation keeps transactional operations distinct from analytics, logs, and temporary infrastructure concerns.

For the complete system design, see [Architecture Documentation](./docs/architecture.md).

---

## Architecture

VESTIOR follows a modular architecture built around clear service boundaries and reliable application workflows.

```text
                         CUSTOMER
                            |
                            v
                  Next.js Application
                   (App Router / RSC)
                            |
              +-------------+-------------+
              |             |             |
              v             v             v
          Storefront     Server        Admin
          Components     Actions     Dashboard
              |             |
              +-------------+
                            |
                    Business Logic
                            |
          +-----------------+-----------------+
          |                 |                 |
          v                 v                 v
      Supabase           MongoDB           Upstash
      PostgreSQL         Atlas              Redis
          |                 |                 |
          |                 |                 |
          +-----------------+-----------------+
                            |
                     External Services
                            |
             +--------------+--------------+
             |              |              |
             v              v              v
           Stripe         QStash          Groq
             |
             v
       Payment Webhooks

          Email Providers
        Gmail SMTP / Resend
```

### Core Architectural Principles

- **Clear data ownership** — Each database and service has a defined responsibility.
- **Atomic commerce operations** — Critical order and coupon workflows use database-level safeguards.
- **Idempotent processing** — Important webhook and notification operations guard against duplicate execution.
- **Secure by default** — Validation, authorization, RLS policies, and webhook verification protect sensitive operations.
- **Provider abstraction** — Payment and email integrations are separated from core business logic.
- **Graceful degradation** — Optional infrastructure failures should not unnecessarily interrupt core storefront functionality.
- **Maintainability** — Shared services, reusable components, and modular business logic keep the codebase organized.

Detailed workflows, data ownership, and implementation decisions are documented in [Architecture](./docs/architecture.md) and [Security](./docs/security.md).

---

## Project Structure

A simplified overview of the repository:

```text
vestior-store/
├── docs/                   # Technical documentation
├── public/
│   ├── images/             # Screenshots and visual assets
│   ├── manifest.json       # PWA manifest
│   ├── offline.html        # Offline fallback
│   └── sw.js               # Service worker
├── src/
│   ├── app/                # App Router pages and route handlers
│   ├── components/         # Reusable UI components
│   ├── actions/             # Server actions
│   └── lib/                 # Shared services and utilities
├── supabase/               # Database migrations and SQL
├── tests/                  # Test-related files
├── package.json
├── next.config.ts
└── README.md
```

The structure above is intentionally simplified. Explore the repository for the complete implementation.

---

## Getting Started

### Prerequisites

- Node.js compatible with the project's Next.js version
- npm
- A Supabase project
- A MongoDB database
- Upstash Redis and QStash credentials
- Stripe credentials for card payments
- Email provider credentials
- Groq API key for AI functionality

Some integrations are optional during local development, depending on the features being tested.

### 1. Clone the repository

```bash
git clone https://github.com/zainshah3464/vestior-store.git

cd vestior-store
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create your local environment file:

```bash
cp .env.example .env.local
```

Add the credentials for the services you intend to use.

Refer to the [Deployment Guide](./docs/deployment.md) for the complete environment-variable reference, service configuration, and database preparation.

**Never commit `.env.local` or expose private credentials.**

### 4. Configure external services

Prepare the services required by the features you want to run:

- Supabase and PostgreSQL
- MongoDB Atlas
- Upstash Redis and QStash
- Stripe
- Email provider
- Groq

Follow the service-specific setup instructions in the documentation.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run test:e2e:ui` | Open the Playwright UI |

---

## Documentation

The repository includes dedicated technical documentation for developers, contributors, and anyone evaluating the system.

| Document | Description |
|---|---|
| [Architecture](./docs/architecture.md) | System design, data ownership, workflows, and architectural decisions |
| [Features](./docs/features.md) | Customer and admin features with implementation details |
| [API Reference](./docs/api-reference.md) | Server Actions, RPCs, API routes, and interfaces |
| [Database](./docs/database.md) | Database design, tables, relationships, migrations, and indexes |
| [Security](./docs/security.md) | Threat model, authorization, RLS, validation, and security controls |
| [Deployment](./docs/deployment.md) | Environment setup, production deployment, monitoring, and rollback |
| [Testing](./docs/testing.md) | Unit tests, E2E tests, CI, and testing practices |
| [Developer FAQ](./docs/faq-developer.md) | Technical questions, debugging, and extension guidance |
| [Roadmap](./docs/roadmap.md) | Planned work and future direction |
| [Changelog](./docs/changelog.md) | Project changes and release history |
| [Contributing](./docs/contributing.md) | Contribution workflow and development standards |

---

## Testing

The project includes automated testing tools for different levels of application behavior:

- **Vitest** — Unit and component-level tests.
- **Testing Library** — UI behavior and interaction testing.
- **Playwright** — Browser-based end-to-end tests.
- **ESLint** — Code quality checks.
- **TypeScript** — Static type checking.
- **GitHub Actions** — Continuous integration workflow.

Run the relevant checks locally:

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
```

See the [Testing Guide](./docs/testing.md) for test setup, coverage, CI integration, and testing practices.

---

## Deployment

VESTIOR is configured for deployment with Vercel and its supporting external services.

The deployment process includes:

1. Configuring production environment variables.
2. Preparing Supabase and database policies.
3. Connecting MongoDB and Upstash services.
4. Configuring payment and email providers.
5. Setting up scheduled tasks and background processing.
6. Deploying the Next.js application.
7. Verifying critical customer and admin workflows.

**Deployment guide:** [docs/deployment.md](./docs/deployment.md)

---

## XERJ Corpus Hub

<p align="center">
  <a href="https://hub.xerj.org/contributors/zainshah3464">
    <img src="https://hub.xerj.org/contributors/zainshah3464/badge.svg" alt="XERJ Corpus Hub Contributor" />
  </a>
</p>

VESTIOR has been selected for inclusion in the **XERJ Corpus Hub**, an open reference index that helps AI coding agents retrieve real code implementations and documentation instead of relying only on generated assumptions.

A contribution from this repository was selected and indexed as a worked reference.

### Selected Contribution

- **Repository:** [zainshah3464/vestior-store](https://github.com/zainshah3464/vestior-store)
- **Selected commit:** [2d173d8e18](https://github.com/zainshah3464/vestior-store/commit/2d173d8e18fc8de19d164d4a4af7cd9ed3fd9dd8)
- **Contribution:** Email system bug fixes covering duplicate emails, payment method handling, and stuck queued logs.
- **Indexed contribution:** 9 files and 722 lines across SQL and TypeScript.
- **Contributor profile:** [Zain Shah on XERJ](https://hub.xerj.org/contributors/zainshah3464)
- **Repository corpus:** [Explore VESTIOR on XERJ](https://hub.xerj.org/corpus/zainshah3464--vestior-store)

The selected commit is a contribution reference. The corpus indexes the repository at its pinned commit, not just the selected files.

Inclusion is under the repository's MIT license with author attribution.

---

## Contributing

Contributions, suggestions, bug reports, and improvements are welcome.

Before contributing:

1. Read the [Contributing Guide](./docs/contributing.md).
2. Review the existing architecture and coding conventions.
3. Create a focused branch for your change.
4. Run the relevant lint, type, and test checks.
5. Submit a pull request with a clear description.

For bugs and feature suggestions, use [GitHub Issues](https://github.com/zainshah3464/vestior-store/issues).

---

## License

VESTIOR is distributed under the **MIT License**.

See the [LICENSE.txt](./LICENSE.txt) file for the complete license text and copyright notice.

---

## Acknowledgements

VESTIOR is built with the support of the open-source ecosystem and the tools listed in the technology stack.

Special thanks to the maintainers and contributors behind Next.js, React, Supabase, MongoDB, Stripe, Upstash, and the many other projects that make this work possible.

Thanks to **XERJ Corpus Hub** for selecting a contribution from this repository and making it available as a reference for AI coding agents.

---

<p align="center">
  <strong>VESTIOR</strong>
  <br />
  Premium Men's Fashion E-Commerce
  <br /><br />
  <a href="https://vestior.vercel.app">Live Demo</a>
  ·
  <a href="https://github.com/zainshah3464/vestior-store">GitHub Repository</a>
  ·
  <a href="./docs/">Documentation</a>
  ·
  <a href="https://github.com/zainshah3464/vestior-store/issues">Support & Issues</a>
</p>
