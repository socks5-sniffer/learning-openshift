import { useState } from 'react';
import styles from '../styles/Home.module.css';
import moduleStyles from '../styles/Module.module.css';
import ModuleShell from '../components/module/ModuleShell';
import Callout from '../components/module/Callout';
import TermBox from '../components/module/TermBox';

const roles = {
  developer: { name: 'Developer', permissions: ['get-pods', 'get-logs', 'create-pods', 'delete-pods'], forbidden: ['get-secrets', 'create-rolebindings', 'delete-namespace'], description: 'Can manage Pods and view logs, but not access Secrets or admin resources' },
  viewer: { name: 'Read-Only Viewer', permissions: ['get-pods', 'get-logs', 'get-services', 'get-deployments'], forbidden: ['create-pods', 'delete-pods', 'get-secrets', 'create-rolebindings'], description: 'Can view resources but cannot modify anything' },
  admin: { name: 'Namespace Admin', permissions: ['get-pods', 'get-logs', 'create-pods', 'delete-pods', 'get-secrets', 'create-rolebindings'], forbidden: ['delete-namespace', 'create-clusterroles'], description: 'Full control within a namespace, but cannot modify cluster-wide resources' },
  clusterAdmin: { name: 'Cluster Admin', permissions: ['get-pods', 'get-logs', 'create-pods', 'delete-pods', 'get-secrets', 'create-rolebindings', 'delete-namespace', 'create-clusterroles'], forbidden: [], description: 'God mode. Can do anything in any namespace' },
};

const actions = {
  'get-pods': { verb: 'get', resource: 'pods' },
  'get-logs': { verb: 'get', resource: 'pods/log' },
  'create-pods': { verb: 'create', resource: 'pods' },
  'delete-pods': { verb: 'delete', resource: 'pods' },
  'get-secrets': { verb: 'get', resource: 'secrets' },
  'create-rolebindings': { verb: 'create', resource: 'rolebindings' },
  'delete-namespace': { verb: 'delete', resource: 'namespaces' },
  'create-clusterroles': { verb: 'create', resource: 'clusterroles' },
};

const verbRows: [string, string][] = [
  ['get', 'Read a single resource (kubectl get pod my-pod)'],
  ['list', 'List all resources (kubectl get pods)'],
  ['watch', 'Stream updates (kubectl get pods -w)'],
  ['create', 'Create new resources (kubectl apply -f)'],
  ['update', 'Modify existing resources'],
  ['patch', 'Partially update (kubectl patch)'],
  ['delete', 'Delete resources (kubectl delete)'],
  ['deletecollection', 'Delete multiple (kubectl delete pods --all)'],
];

export default function Module71() {
  const [selectedRole, setSelectedRole] = useState<keyof typeof roles>('developer');
  const [showBinding, setShowBinding] = useState(false);
  const role = roles[selectedRole];

  const chip = (variant: 'ok' | 'no'): React.CSSProperties => ({
    padding: '0.5rem 1rem',
    background: variant === 'ok' ? 'rgba(34,197,94,0.12)' : 'rgba(220,38,38,0.12)',
    border: `1px solid ${variant === 'ok' ? 'rgba(34,197,94,0.4)' : 'rgba(220,38,38,0.4)'}`,
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.9rem',
    color: 'var(--color-text-primary)',
  });

  return (
    <ModuleShell id="7-1">
      <section className={styles.spotlight}>
        <p>
          By default, Kubernetes gives you way too much power. RBAC (Role-Based Access Control) is how you
          limit who can do what. It's the difference between "anyone can delete production" and "only
          admins can, and they need MFA."
        </p>

        <Callout variant="warning" title="The Golden Rule">
          <p>
            Every Pod runs as a ServiceAccount. Every human uses a User account.
            Both need explicit permissions via Roles and RoleBindings. Without RBAC, your CI/CD pipeline
            could accidentally nuke your cluster.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Users vs ServiceAccounts</h2>
        <div className={moduleStyles.grid}>
          <Callout variant="info" title="👤 Users">
            <ul>
              <li>Humans (developers, operators)</li>
              <li>Not stored in Kubernetes</li>
              <li>Managed externally (certificates, OIDC, LDAP)</li>
              <li>Use kubectl with kubeconfig</li>
              <li>Example: alice@example.com</li>
            </ul>
          </Callout>
          <Callout variant="neutral" title="🤖 ServiceAccounts">
            <ul>
              <li>Applications/Pods</li>
              <li>Stored as Kubernetes resources</li>
              <li>Automatically get a token (mounted as Secret)</li>
              <li>Used by Pods to talk to API server</li>
              <li>Example: system:serviceaccount:default:my-app</li>
            </ul>
          </Callout>
        </div>

        <h3>Creating a ServiceAccount</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}># Create ServiceAccount</div>
          <div style={{ color: '#10b981' }}>apiVersion: v1</div>
          <div style={{ color: '#10b981' }}>kind: ServiceAccount</div>
          <div style={{ color: '#10b981' }}>metadata:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: my-app</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;namespace: production</div>
          <br />
          <div style={{ color: '#64748b' }}># Use it in a Pod</div>
          <div style={{ color: '#10b981' }}>spec:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;serviceAccountName: my-app</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;containers:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;- name: app</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;&nbsp;&nbsp;image: myapp:latest</div>
          <br />
          <div style={{ color: '#64748b' }}># Every namespace gets a 'default' ServiceAccount</div>
          <div style={{ color: '#64748b' }}># Pods use it if you don't specify one</div>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>RBAC Components</h2>
        <p>RBAC has four main resources. Think of it like building a security policy:</p>

        <h3>1. Role (namespaced)</h3>
        <p>A set of permissions within a single namespace. Defines what actions can be performed on which resources.</p>
        <TermBox>
          <div style={{ color: '#10b981' }}>apiVersion: rbac.authorization.k8s.io/v1</div>
          <div style={{ color: '#10b981' }}>kind: Role</div>
          <div style={{ color: '#10b981' }}>metadata:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: pod-reader</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;namespace: production</div>
          <div style={{ color: '#10b981' }}>rules:</div>
          <div style={{ color: '#10b981' }}>- apiGroups: ['']  # '' = core API group</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;resources: ['pods']</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;verbs: ['get', 'list', 'watch']</div>
        </TermBox>

        <h3>2. ClusterRole (cluster-wide)</h3>
        <p>Like Role, but applies across all namespaces. Also used for cluster-scoped resources (Nodes, PersistentVolumes, Namespaces).</p>
        <TermBox>
          <div style={{ color: '#10b981' }}>apiVersion: rbac.authorization.k8s.io/v1</div>
          <div style={{ color: '#10b981' }}>kind: ClusterRole</div>
          <div style={{ color: '#10b981' }}>metadata:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: secret-reader</div>
          <div style={{ color: '#10b981' }}>rules:</div>
          <div style={{ color: '#10b981' }}>- apiGroups: ['']</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;resources: ['secrets']</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;verbs: ['get', 'list']  # Across ALL namespaces</div>
        </TermBox>

        <h3>3. RoleBinding (namespaced)</h3>
        <p>Grants permissions defined in a Role to a User or ServiceAccount within a namespace.</p>
        <TermBox>
          <div style={{ color: '#10b981' }}>apiVersion: rbac.authorization.k8s.io/v1</div>
          <div style={{ color: '#10b981' }}>kind: RoleBinding</div>
          <div style={{ color: '#10b981' }}>metadata:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: read-pods</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;namespace: production</div>
          <div style={{ color: '#10b981' }}>subjects:</div>
          <div style={{ color: '#10b981' }}>- kind: User</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: alice@example.com</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;apiGroup: rbac.authorization.k8s.io</div>
          <div style={{ color: '#10b981' }}>- kind: ServiceAccount</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: my-app</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;namespace: production</div>
          <div style={{ color: '#10b981' }}>roleRef:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;kind: Role</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: pod-reader</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;apiGroup: rbac.authorization.k8s.io</div>
        </TermBox>

        <h3>4. ClusterRoleBinding (cluster-wide)</h3>
        <p>Grants permissions defined in a ClusterRole across the entire cluster. Be very careful with these.</p>
        <TermBox>
          <div style={{ color: '#10b981' }}>apiVersion: rbac.authorization.k8s.io/v1</div>
          <div style={{ color: '#10b981' }}>kind: ClusterRoleBinding</div>
          <div style={{ color: '#10b981' }}>metadata:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: cluster-admin-binding</div>
          <div style={{ color: '#10b981' }}>subjects:</div>
          <div style={{ color: '#10b981' }}>- kind: User</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: admin@example.com</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;apiGroup: rbac.authorization.k8s.io</div>
          <div style={{ color: '#10b981' }}>roleRef:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;kind: ClusterRole</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: cluster-admin  # Built-in role</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;apiGroup: rbac.authorization.k8s.io</div>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>Interactive: Permission Simulator</h2>
        <p>Select a role and see what actions are allowed:</p>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {Object.entries(roles).map(([key, r]) => (
            <button
              key={key}
              onClick={() => setSelectedRole(key as keyof typeof roles)}
              style={{
                padding: '0.75rem 1.5rem',
                border: `2px solid ${selectedRole === key ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-sm)',
                background: selectedRole === key ? 'var(--color-bg-secondary)' : 'var(--color-bg-elevated)',
                cursor: 'pointer',
                fontWeight: selectedRole === key ? 600 : 400,
                color: 'var(--color-text-primary)',
              }}
            >
              {r.name}
            </button>
          ))}
        </div>

        <div style={{ padding: '1.5rem', background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
          <h4 style={{ marginTop: 0 }}>{role.name}</h4>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>{role.description}</p>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: 600, color: '#22c55e', marginBottom: '0.5rem' }}>✓ Allowed Actions:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {role.permissions.map((action) => <div key={action} style={chip('ok')}>{action}</div>)}
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 600, color: '#ef4444', marginBottom: '0.5rem' }}>✗ Forbidden Actions:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {role.forbidden.map((action) => <div key={action} style={chip('no')}>{action}</div>)}
            </div>
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem' }}>
          <input type="checkbox" checked={showBinding} onChange={(e) => setShowBinding(e.target.checked)} style={{ width: '20px', height: '20px' }} />
          <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Show Role + RoleBinding YAML</span>
        </label>

        {showBinding && (
          <TermBox>
            <div style={{ color: '#64748b' }}># Role definition</div>
            <div style={{ color: '#10b981' }}>apiVersion: rbac.authorization.k8s.io/v1</div>
            <div style={{ color: '#10b981' }}>kind: Role</div>
            <div style={{ color: '#10b981' }}>metadata:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: {selectedRole}-role</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;namespace: production</div>
            <div style={{ color: '#10b981' }}>rules:</div>
            {role.permissions.slice(0, 3).map((action) => {
              const act = actions[action as keyof typeof actions];
              return (
                <div key={action}>
                  <div style={{ color: '#10b981' }}>- apiGroups: ['']</div>
                  <div style={{ color: '#10b981' }}>&nbsp;&nbsp;resources: ['{act.resource}']</div>
                  <div style={{ color: '#10b981' }}>&nbsp;&nbsp;verbs: ['{act.verb}']</div>
                </div>
              );
            })}
            <br />
            <div style={{ color: '#64748b' }}># RoleBinding</div>
            <div style={{ color: '#10b981' }}>apiVersion: rbac.authorization.k8s.io/v1</div>
            <div style={{ color: '#10b981' }}>kind: RoleBinding</div>
            <div style={{ color: '#10b981' }}>metadata:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: {selectedRole}-binding</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;namespace: production</div>
            <div style={{ color: '#10b981' }}>subjects:</div>
            <div style={{ color: '#10b981' }}>- kind: User</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: user@example.com</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;apiGroup: rbac.authorization.k8s.io</div>
            <div style={{ color: '#10b981' }}>roleRef:</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;kind: Role</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: {selectedRole}-role</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;apiGroup: rbac.authorization.k8s.io</div>
          </TermBox>
        )}
      </section>

      <section className={styles.spotlight}>
        <h2>Common RBAC Verbs</h2>
        <Callout variant="neutral">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem', fontSize: '0.95rem' }}>
            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Verb</div>
            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>What It Allows</div>
            {verbRows.map(([verb, desc]) => (
              <div key={verb} style={{ display: 'contents' }}>
                <div style={{ color: 'var(--color-text-secondary)' }}><code>{verb}</code></div>
                <div style={{ color: 'var(--color-text-secondary)' }}>{desc}</div>
              </div>
            ))}
          </div>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Least Privilege in Practice</h2>
        <p>The principle: give the minimum permissions needed to do the job. Nothing more.</p>

        <Callout variant="success" title="✓ Good: Narrow Scope">
          <TermBox>
            <div style={{ color: '#64748b' }}># CI/CD pipeline only needs to deploy Deployments</div>
            <div style={{ color: '#10b981' }}>rules:</div>
            <div style={{ color: '#10b981' }}>- apiGroups: ['apps']</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;resources: ['deployments']</div>
            <div style={{ color: '#10b981' }}>&nbsp;&nbsp;verbs: ['get', 'list', 'create', 'update']</div>
            <div style={{ color: '#64748b' }}>&nbsp;&nbsp;# No 'delete' - prevents accidents</div>
          </TermBox>
        </Callout>

        <Callout variant="danger" title="✗ Bad: Too Broad">
          <TermBox>
            <div style={{ color: '#64748b' }}># DON'T DO THIS</div>
            <div style={{ color: '#ef4444' }}>rules:</div>
            <div style={{ color: '#ef4444' }}>- apiGroups: ['*']  # Everything!</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;resources: ['*']  # All resources!</div>
            <div style={{ color: '#ef4444' }}>&nbsp;&nbsp;verbs: ['*']      # All actions!</div>
            <div style={{ color: '#64748b' }}>&nbsp;&nbsp;# This is basically cluster-admin</div>
          </TermBox>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Real-World Examples</h2>

        <h3>Example 1: Developer Access</h3>
        <p>Developers need to debug Pods (logs, exec) but shouldn't access Secrets or modify RBAC.</p>
        <TermBox>
          <div style={{ color: '#10b981' }}>apiVersion: rbac.authorization.k8s.io/v1</div>
          <div style={{ color: '#10b981' }}>kind: Role</div>
          <div style={{ color: '#10b981' }}>metadata:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: developer</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;namespace: staging</div>
          <div style={{ color: '#10b981' }}>rules:</div>
          <div style={{ color: '#10b981' }}>- apiGroups: ['']</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;resources: ['pods', 'pods/log', 'pods/exec']</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;verbs: ['get', 'list', 'watch', 'create']  # exec = create on pods/exec</div>
          <div style={{ color: '#10b981' }}>- apiGroups: ['apps']</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;resources: ['deployments', 'replicasets']</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;verbs: ['get', 'list', 'watch']  # Read-only for Deployments</div>
          <div style={{ color: '#10b981' }}>- apiGroups: ['']</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;resources: ['services']</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;verbs: ['get', 'list']</div>
        </TermBox>

        <h3>Example 2: CI/CD ServiceAccount</h3>
        <p>CI/CD needs to deploy apps but shouldn't touch infrastructure resources.</p>
        <TermBox>
          <div style={{ color: '#10b981' }}>apiVersion: rbac.authorization.k8s.io/v1</div>
          <div style={{ color: '#10b981' }}>kind: Role</div>
          <div style={{ color: '#10b981' }}>metadata:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: deployer</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;namespace: production</div>
          <div style={{ color: '#10b981' }}>rules:</div>
          <div style={{ color: '#10b981' }}>- apiGroups: ['apps']</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;resources: ['deployments']</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;verbs: ['get', 'list', 'create', 'update', 'patch']</div>
          <div style={{ color: '#10b981' }}>- apiGroups: ['']</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;resources: ['services', 'configmaps']</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;verbs: ['get', 'list', 'create', 'update', 'patch']</div>
          <div style={{ color: '#64748b' }}># No delete, no secrets, no RBAC</div>
        </TermBox>

        <h3>Example 3: Monitoring ServiceAccount</h3>
        <p>Prometheus needs read-only access to cluster metrics.</p>
        <TermBox>
          <div style={{ color: '#10b981' }}>apiVersion: rbac.authorization.k8s.io/v1</div>
          <div style={{ color: '#10b981' }}>kind: ClusterRole  # Cluster-wide read access</div>
          <div style={{ color: '#10b981' }}>metadata:</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;name: prometheus</div>
          <div style={{ color: '#10b981' }}>rules:</div>
          <div style={{ color: '#10b981' }}>- apiGroups: ['']</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;resources: ['nodes', 'nodes/metrics', 'services', 'endpoints', 'pods']</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;verbs: ['get', 'list', 'watch']</div>
          <div style={{ color: '#10b981' }}>- nonResourceURLs: ['/metrics']</div>
          <div style={{ color: '#10b981' }}>&nbsp;&nbsp;verbs: ['get']  # For /metrics endpoint</div>
        </TermBox>
      </section>

      <section className={styles.spotlight}>
        <h2>Testing Permissions</h2>
        <p>
          Use <code>kubectl auth can-i</code> to check what you (or a ServiceAccount) can do:
        </p>

        <TermBox>
          <div style={{ color: '#64748b' }}># Can I create Pods?</div>
          <div style={{ color: '#10b981' }}>kubectl auth can-i create pods</div>
          <br />
          <div style={{ color: '#64748b' }}># Can I delete Secrets in namespace prod?</div>
          <div style={{ color: '#10b981' }}>kubectl auth can-i delete secrets -n prod</div>
          <br />
          <div style={{ color: '#64748b' }}># What can the 'deployer' ServiceAccount do?</div>
          <div style={{ color: '#10b981' }}>kubectl auth can-i --list --as=system:serviceaccount:prod:deployer</div>
          <br />
          <div style={{ color: '#64748b' }}># Impersonate a user to test</div>
          <div style={{ color: '#10b981' }}>kubectl get pods --as=alice@example.com</div>
        </TermBox>

        <Callout variant="info" title="Pro Tip">
          <p>
            Use <code>kubectl auth reconcile</code> to apply RBAC changes idempotently. It won't error if
            the role already exists.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Built-in ClusterRoles</h2>
        <p>Kubernetes comes with several pre-defined ClusterRoles. You can bind these directly or aggregate them.</p>

        <Callout variant="neutral">
          <p><code>cluster-admin</code><br />God mode. Full access to everything. Only for break-glass scenarios.</p>
          <p><code>admin</code><br />Full control within a namespace. Can create Roles and RoleBindings. Good for namespace owners.</p>
          <p><code>edit</code><br />Read/write to most resources in a namespace. Cannot modify RBAC. Good for developers.</p>
          <p><code>view</code><br />Read-only access. Cannot see Secrets or Roles. Good for monitoring tools or auditors.</p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Common Mistakes</h2>

        <Callout variant="danger" title="Mistake 1: Binding cluster-admin Everywhere">
          <p>
            "It doesn't work, so I'll just give cluster-admin." This defeats the entire purpose of RBAC.
            Debug why the specific permission is missing instead.
          </p>
        </Callout>
        <Callout variant="danger" title="Mistake 2: Forgetting apiGroups">
          <p>
            Core resources (Pods, Services) use <code>apiGroups: ['']</code>.
            Everything else uses specific groups: apps, rbac.authorization.k8s.io, networking.k8s.io, etc.
          </p>
        </Callout>
        <Callout variant="danger" title="Mistake 3: Not Testing ServiceAccount Permissions">
          <p>
            Your app works locally but fails in Kubernetes? Check if the ServiceAccount has the right permissions.
            Use <code>kubectl auth can-i --as</code> to verify.
          </p>
        </Callout>

        <Callout variant="warning" title="Remember">
          <p>
            RBAC is deny-by-default. No permissions = no access. Start restrictive and
            add permissions as needed. It's easier to grant access later than to revoke overly-broad permissions
            after someone relies on them.
          </p>
        </Callout>
      </section>
    </ModuleShell>
  );
}
