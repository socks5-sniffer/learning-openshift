# OpenShift sandbox deployment

This setup gives you a public HTTPS URL for testing from another device or
location. The application runs separately from your Dev Spaces terminal using a
production Next.js build. Sandbox expiry, quotas, and idle policies still apply;
this does not make the sandbox permanent or keep it awake.

## Latest verified deployment: October 9, 2026

| Item | Recorded value |
| --- | --- |
| Application and Deployment | `clusterfoundry` |
| OpenShift project | Your sandbox project; substitute `YOUR_PROJECT` in the commands below |
| Public HTTPS Route | Retrieve your own hostname with `oc get route clusterfoundry -n YOUR_PROJECT -o jsonpath='{.spec.host}'` |
| Initial build | Build #1 from the PR #49 development branch; pushed successfully |
| Runtime | App pod Running; homepage opened in the browser |

Personal CLI usernames, project names, and Route hostnames are omitted from this
public deployment record. Replace `YOUR_PROJECT` with your project name locally;
`oc project -q` shows the selected project. Authenticate as your own sandbox user.

External checks accessed the site without a login, verified HTTP-to-HTTPS
redirection, and passed the health, rendered page, CSP nonce, JavaScript, CSS,
and public-asset checks. See [Validation](#validation) for the scope of this check.
This is a dated deployment record, not a guarantee of current uptime. The Route
may be unavailable while the app is paused or after sandbox expiry, and its
hostname may change if the resources are removed and recreated.

The app has its own Deployment, Service, and Route. Closing a terminal or stopping
the Dev Spaces workspace does not stop the app; use the
[everyday stop/resume commands](#stop-for-the-day-and-resume).

## Deploy from the Topology console

After the Dockerfile is available on your Git branch:

1. Select your existing project in the OpenShift console's Developer perspective.
2. Choose **+Add → Import from Git** and enter this repository's URL. In advanced
   Git options, select the branch containing these files (normally `main` after
   the changes are merged).
3. Choose the **Dockerfile** build strategy, `Dockerfile` at the repository root,
   and application name `clusterfoundry`.
4. Set the target port to **3000**, create a Route, and enable **Secure Route →
   Edge** with HTTP traffic redirected to HTTPS. The container uses the platform's
   assigned user ID; it does not need an `anyuid` or privileged SCC.
5. Wait for the build and deployment to finish. In **Topology**, click **Open URL**
   on the application and share that HTTPS URL with your tester.

The console creates its own resources. For the resource limits, probes, and
security settings defined in this repository, use the template workflow below
instead of creating a second application with the same name.

## Deploy the checked-in template

Run these commands in a terminal with the OpenShift `oc` CLI after using the
console's **Copy login command** to log in. Select your existing sandbox project
with `oc project YOUR_PROJECT`. The template creates only namespaced app resources.

In Dev Spaces, `oc whoami` can initially report a workspace service account such
as `system:serviceaccount:PROJECT:WORKSPACE-sa`. That account may lack permission
to deploy applications. Log in with your sandbox user instead of adding roles to
the workspace account. If the workspace manages its existing kubeconfig, use a
separate temporary configuration in the Bash terminal:

```bash
export KUBECONFIG="$(mktemp /tmp/clusterfoundry-kubeconfig.XXXXXX)" && set +o history
```

In the OpenShift console, choose your username → **Copy login command** →
**Display Token**, then paste the complete `oc login ...` command into that
terminal. Keep the token out of chat and repository files. After login succeeds:

```bash
set -o history && oc project YOUR_PROJECT && oc whoami
```

The last command should show your sandbox username. This configuration is scoped
to the current terminal and stored in `/tmp`; after a restart or in a new terminal,
check your identity and repeat the login steps if needed.

The template requires OpenShift's integrated image registry and permission to
create Docker builds in your project. A private Git repository additionally needs
a build source secret; a login to Dev Spaces does not automatically authenticate
the build service.

The following works in Bash or PowerShell:

```sh
oc process --local -f openshift/template.yaml -p NAMESPACE=$(oc project -q) -p GIT_REF=main | oc apply -f -
oc start-build clusterfoundry --follow
oc rollout status deployment/clusterfoundry --timeout=300s
oc get route clusterfoundry -o jsonpath='{.spec.host}'
```

Run each line separately. `--local` processes the template in the CLI; the server
still enforces permissions and admission rules when `oc apply` creates or updates
the resources. To check without creating or changing resources, add
`--dry-run=server` to `oc apply`.

While testing an unmerged branch, replace `GIT_REF=main` with
`GIT_REF=YOUR_BRANCH`, using the branch containing your changes. The application can briefly show an image-pull
error before the first build finishes; the image-stream trigger updates the
deployment when the built image becomes available. Share `https://` followed by
the printed Route hostname. The generated hostname may change if the project is
reset, and learners' browser progress is tied to that hostname.

## Rebuild after an update

The BuildConfig keeps its selected Git ref until you change it. Merging a PR does
not automatically switch an existing BuildConfig to `main` or rebuild the app.
For a deployment built from a development branch, point future builds at `main`
after that branch's changes have been merged:

```sh
oc patch buildconfig/clusterfoundry -n YOUR_PROJECT --type=merge -p '{"spec":{"source":{"git":{"ref":"main"}}}}'
```

Check the configured ref:

```sh
oc get buildconfig clusterfoundry -n YOUR_PROJECT -o jsonpath='{.spec.source.git.ref}'
```

After pushing or merging an update to that ref, start a build, then wait for the
rollout. Run each command separately:

```sh
oc start-build clusterfoundry -n YOUR_PROJECT --follow
```

```sh
oc rollout status deployment/clusterfoundry -n YOUR_PROJECT --timeout=300s
```

Builds are manual; there is no webhook secret or keep-alive workflow. A new build
does not resume an app that you scaled to zero. Use the resume command below when
you want to serve it again. Reapplying the full template sets the Deployment back
to the template's one replica.

## Stop for the day and resume

Use these commands in a terminal logged in as your sandbox user. Replace
`YOUR_PROJECT` with your own OpenShift project name in every command.
For an everyday shutdown, stop the app pods while keeping its image and resources:

```sh
oc scale deployment/clusterfoundry --replicas=0 -n YOUR_PROJECT
```

The Deployment controller terminates the pods. The Service, Route, BuildConfig,
and ImageStream remain, and the public URL shows unavailable while there are no
ready app pods. Closing the terminal or deleting a single pod is not an app
shutdown: the Deployment would recreate a deleted pod while its desired replica
count remains one. Scaling the app does not cancel a build already in progress;
wait for that build to finish if you also want it to stop using build resources.

On the next day, resume from the retained image and resources:

```sh
oc scale deployment/clusterfoundry --replicas=1 -n YOUR_PROJECT
```

Then check readiness:

```sh
oc rollout status deployment/clusterfoundry -n YOUR_PROJECT --timeout=300s
```

This does not need another build if the image and resources still exist. Sandbox
expiry or a project reset can remove them; in that case, deploy and build again.
Stop your development workspace separately from the **Dev Spaces dashboard** when
you are finished coding. Resume it there when you need another terminal; check
`oc whoami` and log in again as needed.

## Full cleanup and later redeployment

Use this when you want to remove the app's deployment resources, rather than just
stop for the day:

```sh
oc delete route,service,deployment,buildconfig,imagestream clusterfoundry -n YOUR_PROJECT
```

This removes the five named app resources. They are not refreshed or recreated
automatically by this setup. To run the app again, repeat the template apply,
build, rollout, and Route lookup steps above. The new hostname may differ, and
browser progress stored for the old hostname does not move automatically. The
cleanup command does not delete the OpenShift project or the Dev Spaces workspace.

## Develop in Dev Spaces

Import this repository (and the branch containing `devfile.yaml`) into Dev Spaces.
The workspace uses the Universal Developer Image with Node.js, Git, and the
OpenShift `oc` CLI. The production Docker image is separate and only needs Node.js.
An existing workspace can be restarted from its local devfile. In the workspace's
task menu run **install**, then **dev**, and open the `nextjs` endpoint. The endpoint
may require Dev Spaces authentication; use the application Route above for public
testing. The **build** and **check** tasks are also available.

Workspace configuration and application deployment are separate. Your local
Windows Git signing configuration does not automatically transfer to a workspace.

If a terminal reports `oc: command not found`, changing folders will not fix it.
Check which container the terminal uses and open a terminal in the devfile's
`node` component. If the workspace still uses an older Node-only devfile image,
pull the updated branch and restart the workspace from its local devfile. The
`bash-5.1$` prompt is normal; use `pwd` to check your directory and `ls` to confirm
that `package.json` and `openshift/` are present before running deployment commands.

## Validation

CI checks that the devfile image provides Node.js 22 or 24, npm, Git, and `oc`
when running with an arbitrary non-root user ID and group 0. It also builds the
Docker image and starts it with an arbitrary non-root user ID and
group 0. It checks the health endpoint, rendered pages, CSP nonces, and packaged
JavaScript, CSS, and public assets. This verifies the image without requiring a
cluster. Template admission, builds, and the external Route still need to be
verified for each new OpenShift project.

For the recorded October 9 deployment, the user verified server dry-run admission
for all five resources, applied the template, and reported `Push successful`.
Topology showed Build #1 complete and the app pod Running. The browser opened the
public homepage. Separate unauthenticated external requests passed the smoke
script against the HTTPS Route and returned HTTP 200. Plain HTTP returned 302 to
the HTTPS URL. The responses included fresh CSP nonces without `unsafe-eval`,
`nosniff`, frame denial, referrer and permissions policies, and HSTS.

These checks verify this application's deployment path and the listed responses.
They do not validate every teaching manifest, prove that every lesson control
works on the live cluster, or establish sandbox availability after this date.

The Dockerfile pins Red Hat UBI Node 22 base-image digests. Dependabot checks for
Docker updates monthly. The devfile separately pins the Universal Developer Image
digest; update it deliberately and run the workspace tools check when upgrading.

References: [Next.js standalone output](https://nextjs.org/docs/pages/api-reference/config/next-config-js/output),
[OpenShift image guidelines](https://docs.redhat.com/en/documentation/openshift_container_platform/4.20/html/images/creating-images),
[image-stream deployment triggers](https://docs.redhat.com/en/documentation/openshift_container_platform/4.20/html/images/triggering-updates-on-imagestream-changes).
