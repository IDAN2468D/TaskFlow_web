---
trigger: always_on
---

# 🏗 Architecture & Data Flow

### 1. Modular Structure
Maintain strict separation of concerns to ensure scalability:
- **Web App**: 
  - `/app`: Pages and Routes.
  - `/actions`: Business logic (Server Actions).
  - `/components`: UI (RSC by default).
  - `/models`: Database Schemas.
  - `/bridge`: BFF (Backend for Frontend) endpoints for Mobile.
- **Mobile App**:
  - `/src/screens`: Top-level views.
  - `/src/components`: Shared UI widgets.
  - `/src/services`: Networking layer (Axios + SecureStore).
  - `/src/navigation`: Layout and Tab config.

### 2. Next.js Data Rules (The "No-API" Policy)
- **Server Actions**: All mutations and data fetches within the Web app **MUST** use Next.js Server Actions. 
- **No `/api` Folder**: Do not create generic API routes for the browser.
- **Exceptions**: The `/bridge` directory is the **ONLY** place where API routes are allowed, specifically to serve the Mobile app.

### 3. Server-Side First (RSC)
- Always default to **React Server Components**.
- Use `"use client"` **ONLY** for:
  - Event listeners (onClick, onChange).
  - Browser/Device APIs (Local Storage, Camera).
  - Framer Motion / Moti animations.

### 4. Direct Database Communication & Efficiency
- Mobile **MUST NOT** communicate with MongoDB directly; it communicates via HTTP requests to the Web App's `/bridge` layer.
- **Data Economy**: Query strictly the database fields required (`.select(...)` in Mongoose) to minimize payload size and avoid flooding the LLM/UI with excess data or tokens.
- **Aggressive Caching**: Use React's `cache()` or Next.js `generateStaticParams` when viable to reduce continuous database loads.
