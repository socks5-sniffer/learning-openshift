# Security Policy

**Last Updated:** April 4, 2026  
**Version:** 1.4.x

---

## Supported Versions

The following table outlines which versions of Learning OpenShift receive security updates:

| Version | Supported          | Notes                              |
| ------- | ------------------ | ---------------------------------- |
| 1.4.x   | :white_check_mark: | Current stable release             |
| < 1.4   | :x:                | No longer supported                |

> **Note:** This project follows semantic versioning. Security patches are applied to the latest minor version only. Users are strongly encouraged to upgrade to the latest supported version.

---

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue within Learning OpenShift, please report it responsibly.

### How to Report

1. **GitHub Security Advisories (Preferred)**  
   Report vulnerabilities privately via [GitHub Security Advisories](https://github.com/socks5-sniffer/learning-openshift/security/advisories/new). This allows for confidential discussion and coordinated disclosure.

2. **GitHub Issues (Non-Sensitive)**  
   For non-sensitive security concerns or general security questions, you may open a [GitHub Issue](https://github.com/socks5-sniffer/learning-openshift/issues).

### What to Include

Please provide as much detail as possible:
- Description of the vulnerability
- Steps to reproduce the issue
- Affected version(s)
- Potential impact assessment
- Any suggested remediation (optional)

### Response Timeline

| Action                          | Expected Timeframe       |
| ------------------------------- | ------------------------ |
| Initial acknowledgment          | Within 48 hours          |
| Preliminary assessment          | Within 7 days            |
| Status update (if ongoing)      | Every 14 days            |
| Resolution target               | Within 90 days           |

### Disclosure Policy

- We follow a **coordinated disclosure** process
- Reporters will be credited in security advisories (unless anonymity is requested)
- Public disclosure occurs after a fix is released or after 90 days, whichever comes first
- We request that you do not publicly disclose the vulnerability until we have had an opportunity to address it

### What to Expect

- **Accepted vulnerabilities:** You will receive confirmation, a timeline for remediation, and credit in the security advisory upon fix release
- **Declined reports:** You will receive an explanation of why the report was not accepted (e.g., out of scope, not reproducible, or accepted risk)

---

## Scope

### In Scope
- Learning OpenShift web application code
- API endpoints (`/api/*`)
- Client-side security (XSS, injection vulnerabilities)
- Authentication/authorization issues (if applicable)
- Dependency vulnerabilities affecting the application

### Out of Scope
- Issues in third-party dependencies that are not exploitable in this application's context
- Social engineering attacks
- Physical security
- Denial of Service (DoS) attacks
- Issues requiring unlikely user interaction

---

## Security Best Practices

This project implements the following security measures:

### HTTP Security Headers
- `Content-Security-Policy` - Mitigates XSS and injection attacks
- `X-Content-Type-Options: nosniff` - Prevents MIME-type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `Strict-Transport-Security` - Enforces HTTPS
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` - Restricts browser feature access

### Application Security
- Input validation and sanitization
- HTTP method validation on API endpoints
- Regular dependency updates and vulnerability scanning
- No exposure of sensitive configuration data

---

## Acknowledgments

We appreciate the security research community's efforts in helping keep Learning OpenShift secure. Contributors who report valid vulnerabilities will be acknowledged here (with permission).

---

## Contact

For security-related inquiries, please use the [GitHub Security Advisories](https://github.com/socks5-sniffer/learning-openshift/security/advisories/new) feature or open a GitHub Issue for general questions.

-

**Last Updated:** April 4, 2026  
**Version:** 1.4.x--

*This security policy is subject to change. Please check back regularly for updates.*
