# VASA SALOON Financial Management System - Core Guidelines

This is a web application to streamline financial tracking for a salon.

## 1. Core Objective
Automate daily revenue collection, expense management, and payroll to generate real-time financial summaries. Eliminate manual calculations and reduce errors.

## 2. Target Users
Small salon business owners and managers.

## 3. Technology Stack

### Frontend
- **Framework:** Vue 3 + Vite with TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn-vue
- **State Management:** Pinia
- **Forms:** VeeValidate with Yup
- **Date Handling:** `date-fns` or `Day.js`

### Backend
- **Service:** Supabase
- **Database:** PostgreSQL
- **Auth:** Supabase Auth
- **API:** Supabase Auto-generated REST/GraphQL
- **Real-time:** Supabase Realtime subscriptions

## 4. Key Architectural Principles
- **Single Page Application (SPA):** Use a tabbed navigation layout.
- **Real-time Calculations:** Live updates across all interconnected fields.
- **Role-Based Access Control (RBAC):**
  - **Admin:** Full access.
  - **Manager:** View all financial data, manage expenses.
  - **Staff:** Enter their own daily collections only.
- **Data Models:** Adhere to the data models defined in `project_detailes/prd.md`.
- **Security:** Implement Supabase Row Level Security (RLS) as a priority.

Refer to `project_detailes/prd.md` for full details.

---
