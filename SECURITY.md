# Security Policy

**Last Updated:** October 9, 2026

---

## Supported Versions

This repository does not currently publish a supported-version matrix. Security fixes should be applied to the active development branch and released through the project's normal review process.

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
- Third-party dependency issues unrelated to how this application uses the affected package
- Social engineering attacks
- Physical security
- Denial of Service (DoS) attacks
- Issues requiring unlikely user interaction

---

## Security Best Practices

The repository configures the following security controls. Check the dated [module and verification review](MODULE-REVIEW.md), [OpenShift deployment verification](openshift/README.md#validation), and current CI results before deployment.

### HTTP Security Headers
- `Content-Security-Policy` is set by `middleware.ts`, which generates a per-request nonce and forwards it in the CSP and `x-nonce` request headers, including for prefetch requests. The script policy combines the nonce with `'strict-dynamic'`: Next.js bootstrap scripts receive the nonce, and scripts loaded by those trusted scripts inherit trust in supporting browsers. `_app.tsx` calls the default App `getInitialProps` to support request-specific nonces. This disables automatic static optimization, so pages render on demand rather than being served as static pages; that is the performance and caching tradeoff for per-request nonces. Targeted production Chromium checks at desktop and mobile sizes verified nonce matching on rendered scripts, fresh nonces for prefetch requests despite untrusted caller headers, consistent nonce use on 404 responses, and blocking of an untrusted parser-inserted inline script while hydration succeeds. `style-src` retains `'unsafe-inline'` for the app's inline styles. Development may allow `'unsafe-eval'` for Fast Refresh; production should omit it. Fonts are served from `'self'`.
- `X-Content-Type-Options: nosniff` — prevents MIME-type sniffing
- `X-Frame-Options: DENY` — prevents clickjacking
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` — enforces HTTPS for all subdomains (appropriate for OpenShift/production HTTPS deployment)
- `Referrer-Policy: strict-origin-when-cross-origin` — limits referrer leakage
- `Permissions-Policy` — restricts browser feature access (camera, microphone, geolocation)

### Application Security
- Self-hosted fonts via `@fontsource` packages (no third-party font CDN dependency at runtime)
- Avoid `dangerouslySetInnerHTML` and other unsafe HTML injection patterns; review any exception carefully
- No secrets or sensitive configuration stored in code or committed to the repository
- HTTP method validation on API endpoints
- Regular dependency updates and vulnerability scanning
- `poweredByHeader: false` — removes the `X-Powered-By: Next.js` response header

### Dependency Security
- Do not assume dependencies are vulnerability-free or current based on this document.
- Run `npm audit` before each deployment and review findings against the lockfile and affected code paths. Avoid `npm audit fix --force` without reviewing the proposed version changes, since it can introduce breaking downgrades.
- Keep the lockfile committed and review automated dependency update alerts.
- **Temporary lint-toolchain compatibility:** The project uses `eslint-config-next` 14.2.35 with ESLint 8.57.1 alongside Next.js 15.5.27. This keeps the config within its supported ESLint 8 peer range and avoids the newer config's plugin/`fast-glob` path reintroducing unpatched `braces`. Local lint and build pass. Monitor upstream for a patched compatible config/plugin release and revisit this pairing when available.

---

## CSP Browser Verification (October 8, 2026)

Targeted Playwright Chromium checks passed at desktop and mobile sizes for these cases:

- Rendered server script tags carry the nonce named by that response's CSP.
- Regular navigation and requests marked with `purpose=prefetch` or `next-router-prefetch` receive fresh server-generated nonces, replacing untrusted incoming CSP and `x-nonce` values.
- A 404 response uses a consistent CSP and script nonce.
- An untrusted parser-inserted inline script is blocked while the application hydrates successfully.

These checks cover the listed browser behaviors. They do not validate Kubernetes configuration against a live cluster. `_app.tsx` calls the default App `getInitialProps` so each request can receive its nonce. This disables automatic static optimization: pages render on demand instead of using static output, trading some static delivery and caching for nonce support.

---

## OpenShift Sandbox Verification (October 9, 2026)

The [deployment guide](openshift/README.md) records verification of the
`clusterfoundry` app and explains project selection, HTTPS Route lookup, everyday
stop/resume, and full cleanup. Public examples use `YOUR_PROJECT`; personal CLI
identities, project names, and Route hostnames are omitted. The app runs separately
from the Dev Spaces workspace. The template
configures a non-root runtime, dropped capabilities, no privilege escalation,
the default seccomp profile, no mounted service-account token, resource limits,
health probes, and an edge TLS Route that redirects HTTP to HTTPS.

The user verified template admission, completed the image build, and opened the
public app in a browser. Unauthenticated external checks returned HTTP 200,
verified HTTP-to-HTTPS redirection, fresh CSP nonces without `unsafe-eval`, the
expected security headers, and packaged JavaScript, stylesheets, and public assets.
CI separately exercises the container under an arbitrary non-root user ID and
checks the workspace image's tools. These are bounded deployment checks, not a
complete security audit or validation of the educational manifests against a cluster.

The public learning app has no application login and stores learner progress in
the browser. Sandbox expiry and manual shutdown can make the Route unavailable.
Use your sandbox user's CLI credentials to manage it; a workspace service account
may lack the needed permissions. Keep login tokens and kubeconfig files out of
the repository, build context, and logs.

---

## Remaining Risks & Recommendations

### `'unsafe-inline'` in `style-src`

The CSP retains `'unsafe-inline'` for `style-src` because the app uses inline `style={{ ... }}` props. Removing it would require converting those styles to CSS classes or nonce-bearing style tags and verifying framework-generated styles.

### `'unsafe-eval'` in development

Development may allow `'unsafe-eval'` in `script-src` for Next.js Fast Refresh. Verify that the production policy omits it.

### HSTS with `preload`

`Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` is appropriate if:
- All production subdomains are served over HTTPS
- The domain is or will be submitted to the [HSTS preload list](https://hstspreload.org/)

If subdomains exist that are not HTTPS-ready, remove `includeSubDomains` and `preload` until they are. Confirm the actual deployment domain and TLS behavior before relying on this header.

### Dependency Monitoring

Run `npm audit` before each deployment and review GitHub Dependabot alerts. Playwright checks exercise the built application at desktop and mobile viewport sizes; they do not validate Kubernetes manifests or behavior against a live cluster. The linked dated reviews record the source, browser, and deployment checks actually performed; check CI for the current commit. Docker base images and the Dev Spaces image are pinned by digest. Dependabot checks Dockerfile updates monthly; workspace image upgrades are deliberate and must pass the workspace tools check.

---

## Acknowledgments

We appreciate the security research community's efforts in helping keep Learning OpenShift secure. Contributors who report valid vulnerabilities will be acknowledged here (with permission).

---

## Contact

For security-related inquiries, please use the [GitHub Security Advisories](https://github.com/socks5-sniffer/learning-openshift/security/advisories/new) feature or open a GitHub Issue for general questions.

---

*This security policy is subject to change. Please check back regularly for updates.*
