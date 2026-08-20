---
name: nextjs-dashboard-dev
description: Guidelines and best practices for developing the Next.js frontend (Organizational Dashboard and Public Taxonomy Browser) for the Prebunk project.
---

# Next.js Dashboard Development

When generating or modifying frontend code for the Prebunk dashboard, adhere to the following guidelines:

## Framework and Routing
- Use Next.js with the **App Router** (`app/` directory).
- Separate server components and client components. Use `"use client"` only when interactive React hooks (e.g., `useState`, `useEffect`) or browser APIs are required.

## Styling
- Use **Tailwind CSS** for all styling.
- Keep components modular. If a Tailwind class list becomes too long, extract it into a reusable component rather than using `@apply` in CSS, unless absolutely necessary.
- Follow the color system defined for alert thresholds (e.g., green, amber, orange, red for Virality Risk Scores).

## Components and UI
- Build reusable UI components (e.g., alert cards, stat widgets, narrative lists).
- Ensure the design is accessible and responsive.
- When working on the Public Taxonomy Browser, ensure pages are Statically Generated (SSG) for maximum performance and cacheability.

## Data Fetching
- For real-time dashboard components, fetch data from the Next.js API routes or directly from Supabase depending on the architecture setup.
