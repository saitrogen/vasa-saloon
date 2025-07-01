# VASA SALOON Financial Management System

![VASA SALOON Logo](public/vite.svg) 

## 📋 Overview

The VASA SALOON Financial Management System is a comprehensive web application designed to streamline financial tracking for salon businesses. It automates daily revenue collection, expense management, and payroll tracking to generate real-time financial summaries, eliminating manual calculations and reducing errors.

This project is built as a Single Page Application (SPA) with a focus on real-time calculations, role-based access control, and a clean, modern user interface.

**Current Status:** `Phase 1 (Core MVP)` - Completed. Ready for initial deployment and user feedback.

---

## ✨ Features

- **User Authentication**: Secure login/logout functionality with role-based access.
- **Daily Collections**: A dynamic, calendar-based grid to track daily revenue for each staff member, with automatic total calculations.
- **Expense Tracking**: Full CRUD capability for expenses, complete with categorization, filtering, and monthly summaries.
- **Financial Summary**: An interactive dashboard that provides a clear overview of the salon's financial health, including total collection, salaries, expenses, and the final balance.
- **Dark/Light Mode**: A theme toggle for user comfort.
- **Real-time Updates**: Data is reactive and updates across the application as it changes.

For a detailed list of features and version history, please see the [CHANGELOG.md](CHANGELOG.md).

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Vue 3](https://vuejs.org/) (with Composition API)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [shadcn-vue](https://www.shadcn-vue.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)

### Backend
- **Service**: [Supabase](https://supabase.com/)
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A Supabase account and a new project created.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://your-repository-url.git
    cd vasa-saloon
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    - Create a file named `.env` in the root of the project.
    - Add your Supabase project URL and Anon Key to the `.env` file. You can find these in your Supabase project's API settings.
      ```env
      VITE_SUPABASE_URL=YOUR_SUPABASE_URL
      VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
      ```

4.  **Set up the Supabase database:**
    - Navigate to the Supabase SQL Editor in your project dashboard.
    - Run the SQL scripts located in the `supabase/migrations/` directory of this project in the following order:
      1.  `0000_tables.sql`
      2.  `0001_rls.sql`
      3.  `0002_functions.sql`
      4.  `0003_unique_collection_constraint.sql`
      5.  `0004_salary_unique_constraint.sql`
    - This will set up the necessary tables, policies, and functions.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running on `http://localhost:5173`.

---

## 📈 Project Roadmap

- **Phase 1 (MVP)**: Core features for collection, expenses, and summary. `(Completed)`
- **Phase 2 (Full Feature Set)**: Advanced staff management, dynamic categories, a full payroll module, and advanced reporting.
- **Phase 3 (Enhancement & Polish)**: Bulk data import, mobile optimization, and advanced analytics.

See the [mainTODO.md](project_detailes/mainTODO.md) for a detailed breakdown of all project phases and tasks.
