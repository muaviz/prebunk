---
name: playwright-e2e-testing
description: Runbooks and instructions for writing and executing end-to-end tests using Playwright for the Prebunk platform.
---

# Playwright E2E Testing

Use these guidelines when generating, running, or debugging end-to-end tests for the Prebunk dashboard using Playwright.

## Best Practices
- **Locators:** Use user-facing locators (e.g., `getByRole`, `getByText`, `getByLabel`) rather than CSS or XPath selectors to ensure tests resemble how actual users interact with the app.
- **Assertions:** Use Playwright's web-first assertions (e.g., `expect(locator).toBeVisible()`) which automatically wait for the condition to be met.
- **Test Structure:** Group related tests using `test.describe()`. Use `test.beforeEach()` for common setup like logging into the dashboard.

## Key Test Areas
- **Dashboard Alerts:** Verify that narratives crossing the 60+ (orange) or 80+ (red) Virality Risk Score correctly display notifications.
- **Brief Generation:** Test the on-demand brief generator flow, from submitting a text URL to viewing the generated brief.
- **Taxonomy Browser:** Verify search and filtering functionality on the public narrative taxonomy browser.

## Using the Playwright MCP
- When instructed to test a feature, you can utilize the `playwright` MCP server tools to interact with the local development server autonomously.
