# Security Policy

Thank you for helping to keep NGXSMK UI Kit and its users secure. We take all
security vulnerabilities seriously and appreciate responsible disclosure.

## Supported Versions

We actively support and provide security updates for the current major line:

| Version | Supported            |
| :------ | :------------------- |
| 3.2.x   | Yes                  |
| 3.1.x   | Yes (security fixes) |
| 3.0.x   | Yes (security fixes) |
| < 3.0   | No                   |

Older 1.x / 2.x releases are end-of-life. Please upgrade to the latest 3.x
release when possible.

## Reporting a Vulnerability

If you discover a security vulnerability, please report it privately:

1. **Do not disclose publicly** until a fix is released.
2. **Preferred method:** Email [ngxsmk@gmail.com](mailto:ngxsmk@gmail.com) with
   a detailed description of the issue.
3. You may also use GitHub Security Advisories for this repository when
   available.

### Please include

- A detailed description of the vulnerability.
- Steps to reproduce (sample code or configuration where applicable).
- The affected versions of the library.
- Any potential impact or known mitigations.

## Trust boundaries for consumers

- Markdown (`ngxsmk-markdown`) scheme-allowlists URLs and disables images by
  default. Prefer trusted content; final HTML still passes Angular's
  `[innerHTML]` sanitizer.
- Rich text editor output is unsanitized HTML. Sanitize before persisting or
  re-rendering if the content can come from untrusted users.
- Icon / HTML string inputs (for example dock icons) are consumer-trusted and
  sanitized by Angular when bound with `[innerHTML]`.

## Our response process

- **Acknowledgment:** within 48 hours.
- **Triage & investigation:** we may contact you for more detail.
- **Fix & release:** we aim to ship a patched 3.x release as quickly as
  practical.
- **Disclosure:** after a patch is available we will publish an advisory and
  credit you unless you prefer to remain anonymous.

Thank you for helping protect the community.
