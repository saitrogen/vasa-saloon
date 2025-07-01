# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] - MVP Release - 2025-07-02

### Added

- **Core Application Framework**:
  - Initialized project with Vue 3, Vite, and TypeScript.
  - Integrated Tailwind CSS for styling and `shadcn-vue` for UI components.
  - Set up Pinia for centralized state management.
- **Supabase Integration**:
  - Connected the application to a Supabase backend for database and authentication.
  - Implemented basic database schema and Row Level Security policies.
- **User Authentication**:
  - Full login/logout functionality using Supabase Auth.
  - Persistent user sessions and protected routes.
- **Staff Management**:
  - Foundational CRUD operations for managing staff members.
- **Daily Collection Module**:
  - A comprehensive calendar-based grid for entering daily collections per staff member.
  - Real-time, automatic calculation of daily and monthly totals.
  - Functionality to save all collection data to the database.
- **Expense Tracking Module**:
  - Full CRUD functionality for tracking expenses.
  - Ability to create and assign expense categories.
  - Month/year selectors and category filters to view historical expense data.
- **Financial Summary Module**:
  - A dashboard view summarizing the financial health for a selected month.
  - Displays total collections, total salaries, total expenses, and the final balance.
  - Includes a detailed breakdown of expenses by category and an input for additional income.
- **UI & Theming**:
  - Implemented a dark/light mode theme toggle.

