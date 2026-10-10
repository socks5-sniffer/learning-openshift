# OpenShift sandbox deployment

This setup gives you a public HTTPS URL for testing from another device or
location. The application runs separately from your Dev Spaces terminal using a
production Next.js build. Sandbox expiry, quotas, and idle policies still apply;
this does not make the sandbox permanent or keep it awake.

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

The template requires OpenShift's integrated image registry and permission to
create Docker builds in your project. A private Git repository additionally needs
a build source secret; a login to Dev Spaces does not automatically authenticate
the build service.

The following works in Bash or PowerShell:

```sh
oc process -f openshift/template.yaml -p NAMESPACE=$(oc project -q) -p GIT_REF=main | oc apply -f -
oc start-build clusterfoundry --follow
oc rollout status deployment/clusterfoundry --timeout=300s
oc get route clusterfoundry -o jsonpath='{.spec.host}'
```

While testing an unmerged branch, replace `GIT_REF=main` with
`GIT_REF=codex/openshift-sandbox`. The application can briefly show an image-pull
error before the first build finishes; the image-stream trigger updates the
deployment when the built image becomes available. Share `https://` followed by
the printed Route hostname. The generated hostname may change if the project is
reset, and learners' browser progress is tied to that hostname.

After pushing an update to the selected branch, run `oc start-build clusterfoundry
--follow` again and wait for the rollout. Builds are manual; there is no webhook
secret or keep-alive workflow.

To pause the application, use `oc scale deployment/clusterfoundry --replicas=0`.
To resume, set `--replicas=1`. To remove just these resources:

```sh
oc delete route,service,deployment,buildconfig,imagestream clusterfoundry
```

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
verified on your actual OpenShift project.

The Dockerfile pins Red Hat UBI Node 22 base-image digests. Dependabot checks for
Docker updates monthly. The devfile separately pins the Universal Developer Image
digest; update it deliberately and run the workspace tools check when upgrading.

References: [Next.js standalone output](https://nextjs.org/docs/pages/api-reference/config/next-config-js/output),
[OpenShift image guidelines](https://docs.redhat.com/en/documentation/openshift_container_platform/4.20/html/images/creating-images),
[image-stream deployment triggers](https://docs.redhat.com/en/documentation/openshift_container_platform/4.20/html/images/triggering-updates-on-imagestream-changes).
