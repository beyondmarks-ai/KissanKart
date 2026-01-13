# FIXED: Discounts on Farm Shop Pages

## The Problem
You noticed that price cuts (discounts) were visible on the main **Shop** page but NOT when visiting individual **Farm Shop** pages.

## The Cause
The app uses two different data sources for these pages:
1.  **Shop Page:** Uses `mockProducts.ts` (which I fixed earlier).
2.  **Farm Details Page:** Uses `mockFarms.ts` (specifically `farmProducts` list).

The `farmProducts` in `mockFarms.ts` **did not have the `original_price` field**, so the discount logic wasn't triggered even though the `ProductCard` component supports it.

## The Fix
I updated `src/data/mockFarms.ts` to include `original_price` for vegetables and select fruits across all 10 mock farms.

### Examples of Changes:
*   **Krishna's Organic Farm**:
    *   Potato: **₹48** (was ₹60) → **20% OFF**
    *   Tomato: **₹38** (was ₹48) → **21% OFF**
*   **Lakshmi's Garden**:
    *   Lady Finger: **₹42** (was ₹50) → **16% OFF**
    *   Brinjal: **₹35** (was ₹45) → **22% OFF**
*   **Green Valley Farms**:
    *   Green Grapes: **₹95** (was ₹110) → **14% OFF**

## How to Verify
1.  **Refresh Your Browser** (`Ctrl + Shift + R`).
2.  Go to the **Home Page**.
3.  Scroll down to "Explore Farm Shops" and click on a farm (e.g., **Krishna's Organic Farm**).
4.  You will now see the colorful **SALE badge**, **Strikethrough price**, and **Discount %** on the products listed there.

## Files Modified
*   `src/data/mockFarms.ts` - Added `original_price` data to products.

Everything is now consistent across the entire app! 🛒✨
