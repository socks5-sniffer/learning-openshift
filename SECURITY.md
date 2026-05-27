# Security Policy

**Last Updated:** May 2026  
**Version:** 1.5.x

---

## Supported Versions

The following table outlines which versions of Learning OpenShift receive security updates:

| Version | Supported          | Notes                              |
| ------- | ------------------ | ---------------------------------- |
| 1.5.x   | :white_check_mark: | Current stable release             |
| 1.4.x   | :x:                | No longer supported                |
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
- `Content-Security-Policy` — restricts resource origins; `'unsafe-eval'` removed from `script-src`; fonts and styles are served from `'self'`
- `X-Content-Type-Options: nosniff` — prevents MIME-type sniffing
- `X-Frame-Options: DENY` — prevents clickjacking
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` — enforces HTTPS for all subdomains (appropriate for OpenShift/production HTTPS deployment)
- `Referrer-Policy: strict-origin-when-cross-origin` — limits referrer leakage
- `Permissions-Policy` — restricts browser feature access (camera, microphone, geolocation)

### Application Security
- Self-hosted fonts via `next/font/google` (no third-party font CDN dependency at runtime)
- No use of `dangerouslySetInnerHTML` or other XSS sinks anywhere in the codebase
- No secrets or sensitive configuration stored in code or committed to the repository
- HTTP method validation on API endpoints
- Regular dependency updates and vulnerability scanning
- `poweredByHeader: false` — removes the `X-Powered-By: Next.js` response header

### Dependency Security
- Dependency audit: `next`, `react`, `react-dom` are at current stable versions
- Self-hosted fonts via `@fontsource/inter` and `@fontsource/jetbrains-mono` (no runtime third-party CDN requests)
- Run `npm audit` regularly to check for new vulnerabilities
- **Known/accepted advisory:** `postcss <8.5.10` (GHSA-qx2v-qp2m-jg93) — affects `postcss` bundled by Next.js as a build-time CSS processor. The "fix" offered by `npm audit fix --force` would downgrade Next.js to v9.3.3 (a breaking change). This advisory is not exploitable in the normal app runtime context; it only concerns CSS build processing. Monitor for a Next.js patch that updates its bundled postcss.

---

## Recent Security Improvements (v1.5.x)

The following hardening improvements were made in the v1.5.x release:

| Change | Detail |
| ------ | ------- |
| Removed `'unsafe-eval'` from CSP `script-src` | Prevents eval-based code execution in browsers; not required by Next.js production builds |
| Removed legacy `X-XSS-Protection` header | This header is deprecated in modern browsers and superseded by CSP; removing avoids false sense of security |
| Self-hosted fonts via `@fontsource` packages | Fonts (Inter, JetBrains Mono) are bundled via npm at install time and served from `'self'`; eliminates runtime third-party dependency on `fonts.googleapis.com` and `fonts.gstatic.com`, improving privacy and CSP alignment |
| Removed Google Fonts `@import` from CSS | Removes the browser-level request to the Google Fonts CDN |

---

## Remaining Risks & Recommendations

### `'unsafe-inline'` in `script-src`

The CSP still includes `'unsafe-inline'` for `script-src`. This is currently required because Next.js Pages Router injects inline data-bootstrapping scripts at SSR time. Options to address this in the future:

- **Nonce-based CSP:** Use Next.js middleware to generate a per-request nonce and inject it into both the CSP header and the Next.js inline scripts. This is the most robust approach.
- **App Router migration:** Next.js App Router has better built-in CSP nonce support via middleware.

Until nonce-based CSP is implemented, `'unsafe-inline'` must remain in `script-src` for the app to function correctly.

### HSTS with `preload`

`Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` is appropriate if:
- All production subdomains are served over HTTPS
- The domain is or will be submitted to the [HSTS preload list](https://hstspreload.org/)

If subdomains exist that are not HTTPS-ready, remove `includeSubDomains` and `preload` until they are. The current configuration is suitable for an OpenShift-hosted production deployment where TLS is handled at the ingress/router level.

### Dependency Monitoring

Run `npm audit` before each deployment and review GitHub Dependabot alerts. The current dependency set is minimal (Next.js, React, React-DOM) which limits the attack surface.

---

## Acknowledgments

We appreciate the security research community's efforts in helping keep Learning OpenShift secure. Contributors who report valid vulnerabilities will be acknowledged here (with permission).

---

## Contact

For security-related inquiries, please use the [GitHub Security Advisories](https://github.com/socks5-sniffer/learning-openshift/security/advisories/new) feature or open a GitHub Issue for general questions.

---

*This security policy is subject to change. Please check back regularly for updates.*
