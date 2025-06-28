# Error Tracking Board

This file tracks active bugs reported by the user.

## 🔴 High Priority

- **[In Progress] Login & Auth State:**
  - **Symptom:** User is logged out upon refreshing the page.
  - **Analysis:** The router's navigation guard checks for login status before the auth store has been re-initialized from the session, causing a false negative and a redirect to the login page.
  
- **[Pending] Data Persistence:**
  - **Symptom 1 (`ExpensesView`):** Adding an expense fails with a `409 Conflict` error. The console shows a foreign key violation (`expenses_monthly_record_id_fkey`).
  - **Symptom 2 (`CollectionsView`):** Saving daily collections fails silently.
  - **Analysis:** Both issues stem from the same root cause. The application is trying to save records with a hardcoded, non-existent `monthly_record_id`. The database correctly rejects this because no corresponding record exists in the `monthly_records` table. A system to get or create a valid monthly record is needed.

## ✅ Recently Fixed
- **[Fixed]** Logout button in `AppLayout.vue` now redirects correctly.
- **[Fixed]** Login functionality was broken after recent refactoring.

---

## 🟡 Medium Priority
*(No issues)*

---

## 🟢 Low Priority
*(No issues)* 