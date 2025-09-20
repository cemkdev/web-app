# Project Overview
This project is a modern **e-commerce web application** built with a robust **.NET 6 (Onion Architecture)** API and an **Angular 19** frontend.  

**Purpose:** to provide a structure where users can view products, build a cart, and place orders, while advanced role-based visibility and access management ensures full control on the admin side.

## Highlights
- **Architecture:** Onion Architecture + CQRS (Command/Query separation)  
- **Authentication:** JWT (HttpOnly cookie)  
- **Authorization:** Role & permission management (dynamic endpoint scanning / role-based visibility & access)  
- **Application Flows:** Cart & order; admin panel (customers, products, orders, users/roles)  
- **UI Design:** Bootstrap (user) + Angular Material (admin)  
- **Integrations:** Social login (Google, Facebook), QR code for product/stock ops  
- **File Management:** Azure Blob Storage or Local Storage (optional)  
- **Infrastructure:** PostgreSQL database (containerized)

## Extra Features
- Unique filename generation for uploads  
- Custom authentication design + Silent Refresh mechanism  
- Sample SignalR connection (product-added notifications)  
- Password reset via e-mail link  
- Mail service  
- Angular route guards (role-based)  
- HTTP error handler interceptor (centralized error handling)  
- Dynamic component loading  
- Custom design system: centralized SCSS + HTML class-driven styling (minimal component CSS)

## Next Improvements
- Logging: Serilog + structured JSON, correlation ID  
- Exception handling: global middleware + ProblemDetails; layered exceptions; consistent HTTP status  
- Validation: FluentValidation (partial)  
- Inventory: post-order stock update (Message Queue)  
- Order states: shipping/delivered flow (Message Queue)  
- Guest cart: Redis-based cache  
- UI: Home, product detail, cart quantity indicators, user profile, customers  
- Rating: user rating flow  
- 2FA (optional)

---

# Demo
- A **demo version** of this project will be available at: **https://demo-example.com**  
- **Limitations (Demo):**
  - External login (Facebook/Google) is **disabled**.  
  - **Reset password** and **update order status** e-mail features are **disabled**.  

---

# Running Locally
1. You need to fill in the empty values in `appsettings` yourself:
   - **Required**
     - Use the repository’s [`docker-compose.yml`](./docker-compose.yml) to start the **PostgreSQL** container.
     - Add the **connection string** into `appsettings` (placeholders are already prepared).
     - **Match API port in client & server configs:**  
       Update the following to use **your API’s actual port** (the one Visual Studio assigns if `launchSettings.json` is local-only):  
       - `WebAppClient/src/environments/environment.ts` *(used by `ng serve` / local dev)*
       - `WebAppClient/src/environments/environment.prod.ts` *(used by production build)*
         - `allowedDomains: ["localhost:<API_PORT>"]`
         - `baseUrl: "https://localhost:<API_PORT>/api"`
         - `baseSignalRUrl: "https://localhost:<API_PORT>/"`
         - `WebAppAPI/.../appsettings*.json`  
       - `"BaseStorageUrl": "https://localhost:<API_PORT>"`

   - **Optional**
     - To test **external login**, enter your **own Google/Facebook client id and secret** values in `appsettings`.
     - To test the **mail system**, provide your **own e-mail account and settings** in `appsettings`.
     - **Storage** can also be used locally; Azure is not mandatory. You may leave it empty.

2. Angular **HTTPS** run guide: see [`docs/angular-https.md`](docs/angular-https.md).

---
