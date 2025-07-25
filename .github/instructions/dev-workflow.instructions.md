## Development Workflow

you/model MUST follow this precise workflow for all development tasks:

1.  **Pick Task:** Select the next high-level task from `project_detailes/mainTODO.md`.
2.  **Break Down Task:** Break the task into smaller, manageable steps and list them in `TODO.md` in advance.
3.  **Work on Sub-task:** Implement the next sub-task from the `TODO.md` list.
4.  **Update Sub-task Status:** Mark the sub-task as complete in `TODO.md`.
5.  **Repeat:** Continue working through sub-tasks until all items in `TODO.md` for the current main task are complete.
6.  **Update Main Task:** Mark the main task as complete in `project_detailes/mainTODO.md`.
7.  **Report & Wait:** Report completion to the user and await user feedback or command to proceed "next".


## Error-Fixing Workflow
you/model  MUST follow this precise workflow for all error-fixing tasks
1. **Log Bugs:** Add the reported issues to `errorTODO.md` .
2. **Diagnose:** Analyze the errors and form a plan.
3. **Fix & Verify:** Address one issue at a time, explaining my fix.
4. **Update Tracker:** Mark the issue as fixed in `errorTODO.md` once you confirm the solution works.
5. **Clean Up:** Once all bugs in the file are resolved and verified, I will clear the file.

## UI Development Guidelines
- Use **shadcn-vue** components and blocks wherever possible to ensure UI consistency and speed up development.
- Install necessary `shadcn-vue` components and blocks on a per-need basis.


## Don't Do These Things
- DON'T use Options API - stick to Composition API
- DON'T mutate props directly
- DON'T forget to handle loading and error states
- DON'T create deeply nested component hierarchies
- DON'T use `any` type - always provide proper TypeScript types
- DON'T bypass Supabase RLS policies
- DON'T forget to unsubscribe from real-time subscriptions
- DON'T use `document.querySelector` - use template refs
- DON'T create memory leaks with uncleared watchers/intervals

## When You're Unsure
- Check the Shadcn-vue documentation for component APIs
- Refer to Vue 3 Composition API docs for reactive patterns
- Check Supabase docs for database and auth patterns
- Ask for clarification on business logic requirements
- Prioritize type safety and error handling
- Focus on user experience and accessibility

## 📖 Resources & References
- quary as needs
### Documentation Links
- @Vue 3 Composition API
- @Shadcn-vue Components
- @Supabase Documentation
- @Tailwind CSS
- @Pinia Store

Here are the documentation links for the technologies :

* **Vue 3 Composition API:**
    * Official Vue.js Guide: [https://vuejs.org/guide/extras/composition-api-faq](mdc:https:/vuejs.org/guide/extras/composition-api-faq)
    * Pinia Documentation (Pinia heavily uses Composition API): [https://pinia.vuejs.org/core-concepts/](mdc:https:/pinia.vuejs.org/core-concepts) (specifically the "Defining a Store" section covers setup stores which are Composition API based)

* **Shadcn-vue Components:**
    * Official Shadcn UI (React) Introduction (the principles apply to Vue): [https://ui.shadcn.com/docs](mdc:https:/ui.shadcn.com/docs)
    * Shadcn-vue GitHub Documentation (provides context on the Vue port): [https://github.com/unovue/shadcn-vue/blob/dev/apps/www/src/content/docs/contribution.md](mdc:https:/github.com/unovue/shadcn-vue/blob/dev/apps/www/src/content/docs/contribution.md)

* **Supabase Documentation:**
    * Main Documentation Portal: [https://supabase.com/docs](mdc:https:/supabase.com/docs)
    * Auth Documentation: [https://supabase.com/docs/guides/auth](mdc:https:/supabase.com/docs/guides/auth)
    * Database Documentation: [https://supabase.com/docs/guides/database](mdc:https:/supabase.com/docs/guides/database)

* **Tailwind CSS:**
    * Official Documentation: [https://tailwindcss.com/docs](mdc:https:/tailwindcss.com/docs)

* **Pinia Store:**
    * Official Documentation: [https://pinia.vuejs.org/](mdc:https:/pinia.vuejs.org)
    * Getting Started: [https://pinia.vuejs.org/getting-started.html](mdc:https:/pinia.vuejs.org/getting-started.html)
    * Core Concepts (Defining a Store): [https://pinia.vuejs.org/core-concepts/](mdc:https:/pinia.vuejs.org/core-concepts)
