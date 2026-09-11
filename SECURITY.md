# Public content and sensitive data

This project uses fixed public demo targets and synthetic inputs. It requires no credentials. Do not add private URLs, account data, browser authentication state, personal documents, or code from an employer.

Generated reports and traces are ignored by Git. The workflow uploads reports for seven days; review their contents before distributing them beyond the CI run. If the suite is adapted for a private application, redesign artifact handling before running it in a public repository.

`scripts/check-public-content.py` checks tracked files for common secret patterns, private-network URLs, local user paths, and unexpected file types. It is a review aid and cannot prove that content is free of secrets or proprietary material. Review the complete staged diff before publishing; use a dedicated secret scanner when adding external code or history.

To report a suspected secret, contact the maintainer privately through the profile's LinkedIn link. Do not paste its value into a public issue. If a real secret is committed, revoke it at its provider; deleting the current file does not remove it from Git history.
