"""Conservative publication checks; this is not a substitute for a secrets audit."""

import ipaddress
import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlsplit


PATTERNS = {
    "private key": re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    "GitHub token": re.compile(r"\bgh[pousr]_[A-Za-z0-9]{30,}\b|\bgithub_pat_[A-Za-z0-9_]{50,}"),
    "AWS access key": re.compile(r"\b(?:AKIA|ASIA)[A-Z0-9]{16}\b"),
    "JWT": re.compile(r"\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}"),
    "local user path": re.compile(r"/(?:Users|home)/[^/\s]+/|[A-Za-z]:\\Users\\"),
    "literal credential": re.compile(
        r'''(?i)(?:api[_-]?key|secret|password|access[_-]?token)\s*[:=]\s*["'][A-Za-z0-9_+/=-]{12,}["']'''
    ),
}
FORBIDDEN_SUFFIXES = {".pem", ".p12", ".pfx", ".key", ".pdf", ".har", ".zip"}
URL = re.compile(r'''https?://[^\s<>"'`]+''')


def inspect_file(path: Path) -> list[str]:
    issues = []
    if path.is_symlink():
        return ["symbolic link: inspect its target before publishing"]
    if path.suffix.lower() in FORBIDDEN_SUFFIXES or (
        path.name.startswith(".env") and path.name != ".env.example"
    ):
        issues.append("file type requires manual publication review")
    try:
        content = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return issues + ["binary file requires manual publication review"]
    for label, pattern in PATTERNS.items():
        if pattern.search(content):
            issues.append(label)
    for candidate in URL.findall(content):
        try:
            parsed = urlsplit(candidate)
            host = parsed.hostname or ""
            if parsed.username or parsed.password:
                issues.append("URL contains credentials")
            if host == "localhost" or host.endswith((".local", ".internal", ".corp")):
                issues.append("internal hostname")
            try:
                address = ipaddress.ip_address(host)
            except ValueError:
                continue
            if not address.is_global:
                issues.append("non-public IP address")
        except ValueError:
            issues.append("malformed URL requires review")
    return sorted(set(issues))


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    result = subprocess.run(
        ["git", "ls-files", "--cached", "--others", "--exclude-standard", "-z"],
        cwd=root,
        capture_output=True,
        check=False,
    )
    if result.returncode:
        print("Run this check from a Git checkout of the portfolio.")
        return 2
    paths = sorted(set(p for p in result.stdout.decode().split("\0") if p))
    failures = 0
    for relative in paths:
        path = root / relative
        if not path.exists() and not path.is_symlink():
            continue
        for issue in inspect_file(path):
            # Never print the matching value.
            print(f"{relative}: {issue}")
            failures += 1
    print(f"Reviewed {len(paths)} files; {failures} finding(s). Manual review is still required.")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
