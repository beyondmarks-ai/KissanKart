# Branding & Dashboard Upgrade

## ✅ Features Implemented

1.  **Footer Logo Updated**:
    *   Replaced the footer text/icon with a **modern KissanKart logo**.
    *   Logo generated and saved as `public/logo_new.png`.

2.  **Farmer KYC View**:
    *   Added a new **KYC Verification** tab in the Farmer Dashboard.
    *   Farmers can view their verification status and upload Identity/Land documents.

3.  **Farmer Profile**:
    *   Added a **Profile** tab in the Farmer Dashboard.
    *   Farmers can manage their personal details, bio, and farm information.

4.  **Complaint & Support System (Both Sides)**:
    *   **For Farmers**: Added a **Support** tab in the dashboard to raise tickets.
    *   **For Customers**: Created a new **Support Page** (`/support`) accessible via URL (and effectively linked if added to footer/nav later).

## How to Verify

1.  **Footer Logo**: Scroll to the bottom of any page to see the new logo.
2.  **Farmer Features**:
    *   Login as a farmer (use the "Farmers: Start Selling" link in the footer to emulate/switch logic if needed, or go to `/dashboard` if already logged in).
    *   In the sidebar, you will see new tabs: **KYC Verification**, **Profile**, **Support**.
3.  **Customer Support**:
    *   Visit `http://localhost:8080/support` to see the new customer support page.

## Files Modified/Created
*   `src/components/Footer.tsx` (Logo update)
*   `src/components/dashboard/DashboardSidebar.tsx` (Menu items)
*   `src/pages/Dashboard.tsx` (Routing logic)
*   `src/components/dashboard/KYCContent.tsx` (New)
*   `src/components/dashboard/ProfileContent.tsx` (New)
*   `src/components/dashboard/SupportContent.tsx` (New - Farmer side)
*   `src/pages/Support.tsx` (New - Customer side)
*   `src/App.tsx` (Route for Support)
