---
name: supabase-schema-management
description: Guidelines for safely interacting with the PostgreSQL database via Supabase and the Supabase MCP server.
---

# Supabase Schema Management

When managing the Prebunk database, safety and data integrity are the highest priorities.

## Working with the Database
- **Migrations:** All schema changes must be done via SQL migration files, typically managed by the Supabase CLI (`supabase migration new ...`). Do not execute direct DDL commands on the production schema without approval.
- **Testing:** When using the Supabase MCP, operate on a local database instance or a staging environment whenever possible.
- **Destructive Actions:** Ask for explicit user approval before dropping any tables, columns, or executing bulk DELETE operations.

## Core Schema Context
- **Brief Archive:** Table storing generated briefs, metadata (VRS, timestamp), and validation outcomes.
- **Telemetry:** Tables storing narrative match counts and velocity scores. Remember: *no raw hate content* should ever be persisted in these tables.
- **Subscribers:** Tables managing organizational registrations, preferences, and delivery schedules. Secure personal and organizational contact information using Row Level Security (RLS).
