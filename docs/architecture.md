# Architecture decisions

## Keep the test runner in charge

Playwright owns scheduling, browser contexts, assertions, timeouts, retries, and reports. Page objects describe task interactions; they do not wrap every Playwright operation or inherit from a generic base page. Tests keep their expected outcomes visible.

## Isolate state at the smallest useful scope

The UI fixture creates a page object inside Playwright's test-scoped browser context. Optional initial tasks are entered through the UI, so setup does not depend on the application's private storage format. Disposing the context removes all test state.

API tests use a separate request context per test and dispose it in `finally`. The existing-product fixture discovers a product from the catalog rather than depending on a shared mutable record ID. Only tests that need it pay for that request.

## Validate at the HTTP boundary

TypeScript types do not validate a server response. Zod schemas validate the subset of fields the suite consumes; added upstream fields do not fail an otherwise compatible contract. Status and content type are checked before parsing. Schema failures report field paths and issue codes without dumping the full payload.

The HTTP client returns Playwright responses instead of assuming every request succeeds. Negative tests can therefore inspect the same status and body boundary as positive tests. Retry count and redirect behavior are explicit per request.

## Keep synthetic data simple

The product builder contains a small valid default and permits typed overrides. A UUID in the title helps identify the synthetic request. No large fixture files, production exports, accounts, or credentials are needed.

UI titles are deterministic because browser state is already isolated. Locators use roles, labels, placeholders, and the demo's test IDs. Exact text matching distinguishes task titles without constructing selectors from user input.

## Failures should be explainable

There are no fixed sleeps, forced clicks, or catch-and-ignore retries. UI assertions retry until their configured deadline. Browser traces are retained on failure; API traces are disabled because the explicit HTTP assertions are sufficient for this suite and avoid retaining full response bodies unnecessarily.

The one CI retry distinguishes a repeatable failure from a flaky result. `failOnFlakyTests` makes both outcomes fail the job. Reports remain per job, so browser and API failures are easy to locate without a custom reporting service.

## Deliberate boundaries

This portfolio does not add authentication scaffolding for applications that do not need it, pretend that simulated writes persist, or claim coverage of private systems. A real service would require owned test resources, teardown for persistent writes, authentication lifecycle handling, and environment-specific contracts.

The npm package is marked `private` to prevent accidental npm publication. That setting does not control GitHub repository visibility.

## References

- [Playwright fixtures](https://playwright.dev/docs/test-fixtures)
- [Playwright isolation](https://playwright.dev/docs/browser-contexts)
- [Playwright API testing](https://playwright.dev/docs/api-testing)
- [Playwright CI](https://playwright.dev/docs/ci-intro)
- [DummyJSON product API](https://dummyjson.com/docs/products)
