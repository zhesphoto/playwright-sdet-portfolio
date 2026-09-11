# Playwright SDET portfolio

A TypeScript automation framework that demonstrates how I structure UI and API tests, isolate test state, validate service contracts, and run checks in CI.

The targets are [Playwright TodoMVC](https://demo.playwright.dev/todomvc/) and [DummyJSON products](https://dummyjson.com/docs/products). All authored data is synthetic. No account, API key, or private environment is required.

## Run it

Use Node.js 24 and Python 3 for the optional public-content check.

In a managed development environment, the framework honors `HTTPS_PROXY` when it is set. The demo targets remain fixed.

```bash
npm ci
npx playwright install chromium
npm run check
npm run test:smoke
```

On Linux, install browser system dependencies with `npx playwright install --with-deps chromium`.

| Command                                   | Purpose                                                          |
| ----------------------------------------- | ---------------------------------------------------------------- |
| `npm run test:api`                        | API suite; no browser installation required                      |
| `npm run test:ui`                         | UI suite in Chromium                                             |
| `npm run test:smoke`                      | A small set of core UI and API scenarios                         |
| `npm test`                                | API once, UI in Chromium, Firefox, and WebKit                    |
| `npm run test:debug`                      | Step through UI tests in the Playwright inspector                |
| `npm run report`                          | Open the latest local HTML report                                |
| `npm run check`                           | TypeScript, ESLint, and formatting checks                        |
| `python3 scripts/check-public-content.py` | Check tracked public files for common sensitive-content patterns |

Before running all browsers, use `npx playwright install chromium firefox webkit` (add `--with-deps` on Linux). Test reports are generated locally and are ignored by Git.

## Coverage

| Area         | Scenarios                                                                        |
| ------------ | -------------------------------------------------------------------------------- |
| UI lifecycle | Create, rename, complete, clear, reload persistence, separate browser sessions   |
| UI state     | Active/completed filters, selective deletion, bulk completion, edit cancellation |
| UI input     | Empty input, trimming, literal markup, punctuation and Unicode                   |
| API reads    | Runtime schemas, unique IDs, pagination, sorting, search, detail consistency     |
| API writes   | Synthetic create/update/delete responses and explicit non-persistence checks     |
| API errors   | Missing resources on GET, PUT, and DELETE                                        |

The UI and API suites exercise separate demo applications. They are not presented as a single integrated product journey. The browser lifecycle scenario is the UI end-to-end example.

## Structure

| Location                     | Responsibility                                 |
| ---------------------------- | ---------------------------------------------- |
| `tests/ui/` and `tests/api/` | Business scenarios and outcome assertions      |
| `src/fixtures/`              | Test-scoped setup and resource disposal        |
| `src/pages/`                 | UI locators and task-level interactions        |
| `src/api/`                   | Small HTTP client and runtime response schemas |
| `src/assertions/`            | HTTP status, JSON type, and schema validation  |
| `src/data/`                  | Synthetic product factory                      |
| `src/config/`                | Fixed public targets                           |
| `.github/workflows/`         | Quality checks, API job, and browser matrix    |

See [architecture decisions](docs/architecture.md) for the reasons behind these boundaries and [test strategy](docs/test-strategy.md) for scope and limitations.

The [initial validation record](docs/validation.md) distinguishes passing API checks from the browser matrix that still needs a CI run.

## CI and failure investigation

The workflow runs on pull requests, pushes to `main`, and manual dispatch. Static checks run first; API tests and the three browser jobs then run independently. Actions are pinned to commit SHAs, permissions are read-only, and no repository secrets are needed.

Each job uploads an HTML report and JUnit results for seven days. Failed UI tests retain a trace and screenshot. Download the relevant job's report artifact and open its HTML report or inspect the trace locally with `npx playwright show-trace path/to/trace.zip`.

CI allows one diagnostic retry and fails the job if a test passes only on retry. Check the first failure before rerunning a job. Public demo outages, rate limiting, and service changes can fail this suite; a green run is a demonstration of these checks, not a production release gate.

## Demo limitations

DummyJSON simulates create, update, and delete operations; it does not persist them. The suite checks that documented behavior explicitly. It does not claim database persistence, authentication, authorization, or a real CRUD lifecycle. There is no cleanup API call because the writes leave no stored records.

TodoMVC keeps state in browser storage. Each test gets a fresh context; no global reset or shared account is needed. Public service requests are limited to two local workers per job, with no scheduled background traffic.

## About

Created as an independent portfolio demonstration by [Eugene Shapiro](https://www.linkedin.com/in/sokol82/), Senior QA Automation Engineer / SDET. This repository contains no employer code, internal configuration, or employer test data.
