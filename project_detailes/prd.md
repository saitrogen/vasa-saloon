# VASA SALOON Financial Management System
## Product Requirements Document (PRD)

### Product Overview

**Product Name:** VASA SALOON Financial Management System  
**Version:** 1.0  
**Target Users:** Small salon business owners and managers  
**Platform:** Web Application (Responsive)  
**Currency:** AED (Dhs)

### Executive Summary

The VASA SALOON Financial Management System is a comprehensive web-based application designed to streamline financial tracking for salon businesses. The system automates daily revenue collection, expense management, payroll tracking, and generates real-time financial summaries, eliminating manual calculations and reducing errors.

### Problem Statement

Small salon owners currently manage finances using manual forms and spreadsheets, leading to:
- Time-consuming manual calculations
- Human errors in financial tracking
- Difficulty in generating monthly financial summaries
- Lack of real-time visibility into business performance
- Inefficient expense categorization and tracking

### Solution

A unified web application that digitizes and automates the entire financial workflow through interconnected modules that automatically calculate totals, link data across pages, and generate comprehensive financial reports.

---

## Core Features & Functional Requirements

### 1. Daily Revenue Collection Module

**Purpose:** Track daily earnings by staff member

**Features:**
- Month/Year selector (shared across all modules)
- 31-day calendar grid with staff columns:
  - KAMARU, SAKEER, ASIYAS, SHIBU, NAJMU, SAMAD
- Auto-calculating daily totals (sum of all staff for each day)
- Auto-calculating monthly total collection
- Input validation for numeric values
- Visual indicators for incomplete days

**User Flow:**
1. Select year and month
2. Enter daily collections for each staff member
3. View auto-calculated daily and monthly totals
4. Data automatically feeds into Summary Sheet

### 2. Payroll Management Module

**Purpose:** Track monthly salary payments

**Features:**
- Pre-populated staff roster with same names as collection module
- Full Amount and Half Amount salary tracking
- Auto-calculating salary totals
- Integration with final balance calculations

**User Flow:**
1. View Auto-calculated full and half salary amounts for each staff member
2. View calculated totals
3. Data flows to Summary Sheet for balance calculations

### 3. Expense Management System

**Purpose:** Categorized expense tracking across multiple categories

**Categories:**
- **Tissue Expenses:** Date, Description, Amount
- **Car Expenses:** Date,Description, Amount  
- **Salon Water:** Date, Description, Amount
- **Kitchen Items + Detergent:** Date, Description, Amount
- **Salon Maintenance:** Date, Description, Amount
- **Beauty Supplies:** Date, Description, Amount (Creams, Shaving Equipment, Tissues)
- **Employee Expenses:** Date, Description, Amount (Visa, Uniforms, etc.)

**Features:**
- Dynamic row addition for each expense category
- Category-specific input fields
- Auto-calculating subtotals per category
- Expense consolidation view
- Date picker integration
- Description auto-complete based on historical entries
- functionality to add new categories

### 4. Financial Summary & Reporting

**Purpose:** Generate comprehensive monthly financial reports

**Components:**

**A. Expense Summary:**
- Consolidated view of all expense categories
- Auto-populated from individual expense modules
- Grand total calculation
- Manual input for contract renewal expenses

**B. Final Balance Calculator:**
- Boss Balance (Half Amount salary total)
- Total expenses deduction
- Additional income sources (flat rental, product sales)
- Manual entries for unique costs (IJAS salary)
- Final profit/loss calculation with formula:
  - `Final Balance = (Half Salary Total - Total Expenses - IJAS Salary) + (Flat Rental + Product Sales)`

###5. Category Management Module

**Purpose:** Dynamic expense category creation and management

**Features:**

- Create custom expense categories
- Edit existing category names and descriptions
- Soft delete categories (mark as inactive)
- Category usage tracking
- Default categories (Tissue, Car, Water, etc.) with system protection

**User Flow:**

- Navigate to Settings → Categories
- Add new category with name, description, and required fields
- Assign categories to expense entries
- View category usage statistics

###6. Staff Management System

**Purpose:** Comprehensive staff user management

**Features:**

- Create new staff accounts with role assignment
- Staff profile management (name, contact, hire date)
- Soft delete functionality (Active/Inactive status)
- Role-based permissions (Admin, Manager, Staff)
- Staff performance tracking integration

**User Flow:**

- Admin creates staff account with login credentials
- Assign role and permissions
- Staff receives login credentials
- Admin can deactivate/reactivate staff accounts

###7. Staff Self-Service Portal

**Purpose:** Limited access portal for staff members

**Features:**

- Staff-only login with restricted dashboard
- Daily collection entry for own data only
- View personal performance history
- Update personal profile information
- Mobile-optimized interface for daily use

**Access Restrictions:**

- Can only view/edit own daily collection data
- Cannot access other staff members' data
- Cannot view expense management
- Cannot access financial summaries
- Read-only access to salary information

###8. Bulk Data Import System

**Purpose:** Migrate historical data from paper records

**Features:**

- CSV/Excel import templates for each data type
- Bulk daily collection import (date range selection)
- Mass expense entry with category mapping
- Historical salary data import
- Data validation and error reporting
- Preview and confirm before final import

**Import Templates:**

- Daily Collections: Date, Staff Name, Amount
- Expenses: Date, Category, Description, Amount
- Salaries: Month, Staff Name, Full Amount, Half Amount
---

## Technical Requirements

### Frontend Technology Stack
- **Framework:** vue3 vite with TypeScript
- **Styling:** Tailwind CSS for responsive design
- **State Management:** Pinia (Vue 3 store)
- **Form Management:** VeeValidate with Yup validation
- **Date Handling:** Date-fns or Day.js
- **Charts:**  Vue-chartjs or ApexCharts Vue for visual summaries

### Backend Technology Stack
- **Backend Service:**   Supabase (PostgreSQL + Auth + API)
- **Database:** supabase  PostgreSQL
- **Authentication:** supababse auth
- **API:** Supabase Auto-generated REST/GraphQL APIs
- **Real-time:** Supabase Realtime subscriptions
- **File Storage:** Supabase Storage

### Core Technical Features

**1. Real-time Calculations:**
- Live updates across all interconnected fields
- Automatic recalculation when source data changes
- Formula validation and error handling

**2. Data Persistence:**
- Auto-save functionality (save every 30 seconds)
- Local storage backup for offline access
- Database synchronization when online

**3. Data Validation:**
- Required field validation
- Numeric input constraints
- Date range validation
- Cross-module data consistency checks

**4. Export Capabilities:**
- PDF report generation
- Excel export for accounting software integration
- Monthly summary email reports

---

## User Experience Requirements

### Navigation & Layout
- **Single Page Application** with tabbed navigation
- **Progressive Disclosure:** Show relevant sections based on completion
- **Mobile-First Design** with responsive breakpoints
- **Dark/Light Theme** support

###Navigation Structure

**Admin/Manager Dashboard:**

- Dashboard Overview
- Daily Collections
- Expense Management
- Payroll Management
- Staff Management (Admin only)
- Category Management (Admin only)
- Bulk Import
- Reports & Summary

**Staff Dashboard:**

- My Daily Collections
- My Performance
- Profile Settings

### UI Components

**1. Staff Management Interface:**

- Staff grid with status indicators
- Quick action buttons (Activate/Deactivate)
- Role assignment dropdown
- Bulk operations for multiple staff

**2. Category Management:**

- Drag-and-drop category reordering
- Category usage analytics
- Bulk category operations
- Category template suggestions

**3. Bulk Import Wizard:**

- Step-by-step import process
- File validation and preview
- Error handling and correction
- Progress tracking with real-time updates

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode

### User Interface Elements

**1. Dashboard Overview:**
- Current month financial snapshot
- Quick action buttons for common tasks
- Progress indicators for form completion
- Recent activity feed

**2. Form Components:**
- Intelligent input fields with auto-formatting
- Inline validation with helpful error messages
- Batch operations for repetitive data entry
- Undo/Redo functionality

**3. Data Visualization:**
- Monthly revenue trends
- Expense category breakdown (pie charts)
- Staff performance comparison
- Year-over-year comparisons

---

## Data Models

### Core Entities

```typescript
interface MonthlyRecord {
  id: string;
  year: number;
  month: number;
  status: 'draft' | 'completed' | 'locked';
  createdAt: Date;
  updatedAt: Date;
}

interface DailyCollection {
  id: string;
  monthlyRecordId: string;
  date: Date;
  staffId: string; // Reference to Staff
  amount: number;
  enteredBy: string; // Who entered the data
  enteredAt: Date;
}

interface Salary {
  id: string;
  monthlyRecordId: string;
  staffName: string;
  fullAmount: number;
  halfAmount: number;
  signature: string;
}

interface Expense {
  id: string;
  monthlyRecordId: string;
  categoryId: string; // Reference to ExpenseCategory
  date: Date;
  description?: string;
  quantity?: number;
  volume?: string;
  amount: number;
  createdBy: string; // Staff who entered the expense
}

interface Summary {
  id: string;
  monthlyRecordId: string;
  totalCollection: number;
  totalSalaries: number;
  totalExpenses: number;
  ijiasSalary: number;
  flatRental: number;
  productSales: number;
  finalBalance: number;
}

interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean; // system categories cannot be deleted
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Staff {
  id: string;
  userId: string; // Supabase auth user ID
  name: string;
  email: string;
  phone?: string;
  hireDate: Date;
  role: 'admin' | 'manager' | 'staff';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface BulkImport {
  id: string;
  importType: 'collections' | 'expenses' | 'salaries';
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  recordsProcessed: number;
  recordsFailed: number;
  errorLog?: string;
  createdBy: string;
  createdAt: Date;
}
```

---


## Security Requirements

### Authentication & Authorization
- Multi-factor authentication for admin users
- Role-based access control (Owner, Manager, Staff)
- Session management with automatic timeout
- Password strength requirements

###Role-Based Access Control
**Admin Role:**

- Full system access
- Daily collection update
- Staff management
- Category management
- All financial data access
- Bulk import capabilities
- System settings

**Manager Role:**

- View all financial data
- Expense management
- Cannot modify staff accounts
- Cannot access system settings

**Staff Role:**

- Personal daily collection entry only
- View own performance data
- Update personal profile
- Cannot access other staff data
- Cannot view expenses or summaries

###Supabase Row Level Security (RLS)
```sql
-- Staff can only access their own daily collections
CREATE POLICY "Staff can view own collections" ON daily_collections
FOR SELECT USING (staff_id = auth.uid());

CREATE POLICY "Staff can insert own collections" ON daily_collections
FOR INSERT WITH CHECK (staff_id = auth.uid());

-- Admin/Manager can access all data
CREATE POLICY "Admin access all" ON daily_collections
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM staff 
    WHERE staff.user_id = auth.uid() 
    AND staff.role IN ('admin', 'manager')
  )
);
```

### Data Protection
- Data encryption at rest and in transit
- Regular automated backups
- GDPR compliance for data handling
- Audit trail for all financial modifications

### Business Logic Security
- Input sanitization and validation
- SQL injection prevention
- XSS protection
- Rate limiting for API endpoints

---

## Performance Requirements

### Response Time
- Page load time: < 2 seconds
- Form submissions: < 1 second
- Report generation: < 5 seconds
- Real-time calculations: < 100ms


###Supabase Optimization

- Database indexing for staff_id and category_id lookups
- Real-time subscriptions for live data updates
- Edge functions for complex calculations
- Connection pooling for concurrent users

###Bulk Import Performance

- Process large files in chunks (1000 records/batch)
- Background job processing
- Progress indicators for long-running imports
- Automatic retry for failed records

### Offline Capability
- Local data caching for recent records
- Offline form completion
- Sync when connection restored
- Conflict resolution for concurrent edits

---

## Integration Requirements

### Accounting Software
- Excel import/export
- Standard accounting format export


---

## Success Metrics

### Business Metrics
- 90% reduction in manual calculation time
- 95% accuracy in financial reporting
- 50% faster monthly closing process
- 100% user adoption within 1 months

### Technical Metrics
- 99.9% uptime
- < 2 second average response time
- Zero data loss incidents
- 95% user satisfaction score
###Staff Adoption Metrics

- 100% staff login rate within 2 weeks
- 90% daily collection self-entry compliance
- 50% reduction in data entry errors from staff input

###System Efficiency Metrics

- Bulk import of 12 months historical data in < 30 minutes
- Real-time data sync across all user sessions
- 99.9% uptime with Supabase infrastructure

---

## Development Timeline

### Phase 1 : Core MVP
- Daily collection module
- Basic expense tracking
- Simple summary calculations
- User authentication
- Vue 3 + Shadcn-vue setup
- Supabase integration
- Basic staff authentication
- Daily collection module with staff restrictions

### Phase 2 : Full Feature Set
- Complete expense management
- Payroll module
- Advanced reporting
- Export capabilities
- taff management system
- Category management
- Role-based access control
- Complete expense management

### Phase 3 (Months 5-6): Enhancement & Polish
- Bulk import system
- Mobile optimization
- Advanced analytics
- Integration capabilities
- Performance optimization

---

## Risk Assessment & Mitigation

### Technical Risks
- **Data Loss:** Automated backups + version control
- **Performance Issues:** Load testing + optimization
- **Security Breaches:** Security audits + compliance

### Business Risks  
- **User Adoption:** Training programs + intuitive design
- **Data Migration:** Import tools + validation
- **Regulatory Changes:** Flexible architecture + updates

---

This PRD provides a comprehensive blueprint for developing a powerful yet simple financial management system that transforms manual salon bookkeeping into an automated, error-free digital experience.

