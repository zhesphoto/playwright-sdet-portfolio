# Test strategy

## Scope and priorities

The smoke suite checks a complete task lifecycle, browser persistence, catalog/detail contracts, and a synthetic API create response. The wider suite covers state transitions, input handling, pagination, sorting, and missing-resource responses.

UI checks run in Chromium, Firefox, and WebKit. API checks run once rather than being duplicated per browser. Scenarios are independent and may execute in any order. The suite does not rely on a previous test to create state.

## Choosing assertions

- Assert visible lists and counts after UI actions; avoid relying only on an action completing.
- Assert both status and the response fields that establish the expected behavior.
- Check non-empty collections before asserting ordering or uniqueness, so empty data cannot pass vacuously.
- Compare detail responses with the current catalog entry rather than assuming demo prices or names stay fixed.
- Use explicit error responses for negative tests; infrastructure failures must not count as expected product errors.

## Execution and diagnosis

1. Run `npm run check` before the tests.
2. Start with `npm run test:smoke` for a quick functional check.
3. Run the affected project during development and the full matrix in CI.
4. For a failure, inspect the expected/actual values and the first attempt's trace. Decide whether it is a test defect, application behavior change, or service availability problem.

Do not remove assertions or introduce unconditional retries to make an unavailable demo pass. Keep service limitations visible in test names and documentation.

## What the suite does not establish

There are no claims of load testing, security certification, complete accessibility coverage, visual regression coverage, authentication coverage, or persistent backend integration. The literal-markup UI check is an input-rendering check, not a security audit.

Public demo uptime and dataset stability are outside the repository's control. Performance thresholds and production-like concurrency would be inappropriate against these shared services.
