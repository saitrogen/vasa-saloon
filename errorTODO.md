# Error Tracking Board

This file tracks active bugs reported by the user.

## 🔴 High Priority

- **[In Progress] Data Persistence (`CollectionsView`):**
  - **Symptom:** Saving daily collections fails with a `400 Bad Request`.
  - **Analysis:** The `upsert` operation fails because the `daily_collections` table is missing a `UNIQUE` constraint on the columns used for conflict resolution (`date`, `staff_id`, `monthly_record_id`). Additionally, the save function is still using a placeholder `monthly_record_id`.

## ✅ Recently Fixed
- **[Fixed] Data Persistence (`ExpensesView`):** The expense creation workflow is now fully functional.
- **[Fixed] Login & Auth State:** User is no longer logged out upon refreshing the page.
- **[Fixed]** Logout button in `AppLayout.vue` now redirects correctly.
- **[Fixed]** Login functionality was broken after recent refactoring.

---

## 🟡 Medium Priority
*(No issues)*

---

## 🟢 Low Priority
*(No issues)* 