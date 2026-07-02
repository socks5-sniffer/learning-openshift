import { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import ModuleCompletion from '../components/ModuleCompletion';

export default function Module71() {
  const [selectedRole, setSelectedRole] = useState('developer');
  const [selectedAction, setSelectedAction] = useState('get-pods');
  const [showBinding, setShowBinding] = useState(false);

  const roles = {
    developer: {
      name: 'Developer',
      permissions: ['get-pods', 'get-logs', 'create-pods', 'delete-pods'],
      forbidden: ['get-secrets', 'create-rolebindings', 'delete-namespace'],
      description: 'Can manage Pods and view logs, but not access Secrets or admin resources'
    },
    viewer: {
      name: 'Read-Only Viewer',
      permissions: ['get-pods', 'get-logs', 'get-services', 'get-deployments'],
      forbidden: ['create-pods', 'delete-pods', 'get-secrets', 'create-rolebindings'],
      description: 'Can view resources but cannot modify anything'
    },
    admin: {
      name: 'Namespace Admin',
      permissions: ['get-pods', 'get-logs', 'create-pods', 'delete-pods', 'get-secrets', 'create-rolebindings'],
      forbidden: ['delete-namespace', 'create-clusterroles'],
      description: 'Full control within a namespace, but cannot modify cluster-wide resources'
    },
    clusterAdmin: {
      name: 'Cluster Admin',
      permissions: ['get-pods', 'get-logs', 'create-pods', 'delete-pods', 'get-secrets', 'create-rolebindings', 'delete-namespace', 'create-clusterroles'],
      forbidden: [],
      description: 'God mode. Can do anything in any namespace'
    }
  };

  const actions = {
    'get-pods': { verb: 'get', resource: 'pods', dangerous: false },
    'get-logs': { verb: 'get', resource: 'pods/log', dangerous: false },
    'create-pods': { verb: 'create', resource: 'pods', dangerous: false },
    'delete-pods': { verb: 'delete', resource: 'pods', dangerous: true },
    'get-secrets': { verb: 'get', resource: 'secrets', dangerous: true },
    'create-rolebindings': { verb: 'create', resource: 'rolebindings', dangerous: true },
    'delete-namespace': { verb: 'delete', resource: 'namespaces', dangerous: true },
    'create-clusterroles': { verb: 'create', resource: 'clusterroles', dangerous: true }
  };

  const canPerformAction = (role: string, action: string) => {
    return roles[role as keyof typeof roles].permissions.includes(action);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title} style={{ color: '#1e293b' }}>
          7.1 RBAC (Role-Based Access Control)
        </h1>

        <div style={{ marginBottom: '2rem' }}>
          <Link href="/module-6-2" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>← Previous: Ingress</Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/learning-modules" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>All Modules</Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/module-7-2" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '1.1rem' }}>Next: Pod Security →</Link>
        </div>

        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#1e293b', maxWidth: '800px' }}>
          By default, Kubernetes gives you way too much power. RBAC (Role-Based Access Control) is how you
          limit who can do what. It's the difference between "anyone can delete production" and "only
          admins can, and they need MFA."
        </p>

        <div style={{
          background: 'linear-gradient(to right, #fef3c7, #fde68a)',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '2rem',
          borderLeft: '4px solid #f59e0b'
        }}>
          <p style={{ margin: 0, color: '#1e293b', lineHeight: '1.6' }}>
            <strong>The Golden Rule:</strong> Every Pod runs as a ServiceAccount. Every human uses a User account.
            Both need explicit permissions via Roles and RoleBindings. Without RBAC, your CI/CD pipeline
            could accidentally nuke your cluster.
          </p>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Users vs ServiceAccounts</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginTop: '1.5rem'
        }}>
          <div style={{
            background: '#dbeafe',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '2px solid #3b82f6'
          }}>
            <h3 style={{ marginTop: 0, color: '#1e293b' }}>👤 Users</h3>
            <ul style={{ color: '#1e293b', lineHeight: '1.8', marginBottom: 0 }}>
              <li>Humans (developers, operators)</li>
              <li>Not stored in Kubernetes</li>
              <li>Managed externally (certificates, OIDC, LDAP)</li>
              <li>Use kubectl with kubeconfig</li>
              <li>Example: alice@example.com</li>
            </ul>
          </div>

          <div style={{
            background: '#fae8ff',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '2px solid #a855f7'
          }}>
            <h3 style={{ marginTop: 0, color: '#1e293b' }}>🤖 ServiceAccounts</h3>
            <ul style={{ color: '#1e293b', lineHeight: '1.8', marginBottom: 0 }}>
              <li>Applications/Pods</li>
              <li>Stored as Kubernetes resources</li>
              <li>Automatically get a token (mounted as Secret)</li>
              <li>Used by Pods to talk to API server</li>
              <li>Example: system:serviceaccount:default:my-app</li>
            </ul>
          </div>
        </div>

        <div style={{
          background: '#f8fafc',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ marginTop: 0, color: '#1e293b' }}>Creating a ServiceAccount</h3>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            background: '#1e293b',
            color: '#10b981',
            padding: '1rem',
            borderRadius: '6px',
            marginTop: '0.5rem',
            overflowX: 'auto'
          }}>
            {"# Create ServiceAccount"}<br />
            {"apiVersion: v1"}<br />
            {"kind: ServiceAccount"}<br />
            {"metadata:"}<br />
            {"  name: my-app"}<br />
            {"  namespace: production"}<br />
            <br />
            {"# Use it in a Pod"}<br />
            {"spec:"}<br />
            {"  serviceAccountName: my-app"}<br />
            {"  containers:"}<br />
            {"  - name: app"}<br />
            {"    image: myapp:latest"}<br />
            <br />
            {"# Every namespace gets a 'default' ServiceAccount"}<br />
            {"# Pods use it if you don't specify one"}
          </div>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>RBAC Components</h2>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          RBAC has four main resources. Think of it like building a security policy:
        </p>

        <div style={{ marginTop: '1.5rem' }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>1. Role (namespaced)</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6' }}>
              A set of permissions within a single namespace. Defines what actions can be performed on which resources.
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: '#1e293b',
              color: '#10b981',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              {"apiVersion: rbac.authorization.k8s.io/v1"}<br />
              {"kind: Role"}<br />
              {"metadata:"}<br />
              {"  name: pod-reader"}<br />
              {"  namespace: production"}<br />
              {"rules:"}<br />
              {"- apiGroups: ['']  # '' = core API group"}<br />
              {"  resources: ['pods']"}<br />
              {"  verbs: ['get', 'list', 'watch']"}
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>2. ClusterRole (cluster-wide)</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6' }}>
              Like Role, but applies across all namespaces. Also used for cluster-scoped resources (Nodes, PersistentVolumes, Namespaces).
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: '#1e293b',
              color: '#10b981',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              {"apiVersion: rbac.authorization.k8s.io/v1"}<br />
              {"kind: ClusterRole"}<br />
              {"metadata:"}<br />
              {"  name: secret-reader"}<br />
              {"rules:"}<br />
              {"- apiGroups: ['']"}<br />
              {"  resources: ['secrets']"}<br />
              {"  verbs: ['get', 'list']  # Across ALL namespaces"}
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>3. RoleBinding (namespaced)</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6' }}>
              Grants permissions defined in a Role to a User or ServiceAccount within a namespace.
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: '#1e293b',
              color: '#10b981',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              {"apiVersion: rbac.authorization.k8s.io/v1"}<br />
              {"kind: RoleBinding"}<br />
              {"metadata:"}<br />
              {"  name: read-pods"}<br />
              {"  namespace: production"}<br />
              {"subjects:"}<br />
              {"- kind: User"}<br />
              {"  name: alice@example.com"}<br />
              {"  apiGroup: rbac.authorization.k8s.io"}<br />
              {"- kind: ServiceAccount"}<br />
              {"  name: my-app"}<br />
              {"  namespace: production"}<br />
              {"roleRef:"}<br />
              {"  kind: Role"}<br />
              {"  name: pod-reader"}<br />
              {"  apiGroup: rbac.authorization.k8s.io"}
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>4. ClusterRoleBinding (cluster-wide)</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6' }}>
              Grants permissions defined in a ClusterRole across the entire cluster. Be very careful with these.
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: '#1e293b',
              color: '#10b981',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              {"apiVersion: rbac.authorization.k8s.io/v1"}<br />
              {"kind: ClusterRoleBinding"}<br />
              {"metadata:"}<br />
              {"  name: cluster-admin-binding"}<br />
              {"subjects:"}<br />
              {"- kind: User"}<br />
              {"  name: admin@example.com"}<br />
              {"  apiGroup: rbac.authorization.k8s.io"}<br />
              {"roleRef:"}<br />
              {"  kind: ClusterRole"}<br />
              {"  name: cluster-admin  # Built-in role"}<br />
              {"  apiGroup: rbac.authorization.k8s.io"}
            </div>
          </div>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Interactive: Permission Simulator</h2>

        <div style={{
          background: '#f8fafc',
          padding: '2rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          border: '2px solid #e2e8f0'
        }}>
          <p style={{ color: '#1e293b', marginBottom: '1rem' }}>
            Select a role and see what actions are allowed:
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {Object.entries(roles).map(([key, role]) => (
              <button
                key={key}
                onClick={() => setSelectedRole(key)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: selectedRole === key ? '2px solid #9c0606ff' : '2px solid #cbd5e1',
                  borderRadius: '6px',
                  background: selectedRole === key ? '#fef2f2' : 'white',
                  cursor: 'pointer',
                  fontWeight: selectedRole === key ? 600 : 400,
                  color: '#1e293b'
                }}
              >
                {role.name}
              </button>
            ))}
          </div>

          <div style={{
            padding: '1.5rem',
            background: 'white',
            borderRadius: '8px',
            border: '2px solid #9c0606ff',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>
              {roles[selectedRole as keyof typeof roles].name}
            </h4>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              {roles[selectedRole as keyof typeof roles].description}
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 600, color: '#10b981', marginBottom: '0.5rem' }}>
                ✓ Allowed Actions:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {roles[selectedRole as keyof typeof roles].permissions.map((action) => (
                  <div
                    key={action}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#f0fdf4',
                      border: '1px solid #10b981',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      color: '#1e293b'
                    }}
                  >
                    {action}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 600, color: '#ef4444', marginBottom: '0.5rem' }}>
                ✗ Forbidden Actions:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {roles[selectedRole as keyof typeof roles].forbidden.map((action) => (
                  <div
                    key={action}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#fef2f2',
                      border: '1px solid #ef4444',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      color: '#1e293b'
                    }}
                  >
                    {action}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem' }}>
            <input
              type="checkbox"
              checked={showBinding}
              onChange={(e) => setShowBinding(e.target.checked)}
              style={{ width: '20px', height: '20px' }}
            />
            <span style={{ color: '#1e293b', fontWeight: 600 }}>Show Role + RoleBinding YAML</span>
          </label>

          {showBinding && (
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: '#1e293b',
              color: '#10b981',
              padding: '1rem',
              borderRadius: '6px',
              overflowX: 'auto'
            }}>
              {"# Role definition"}<br />
              {"apiVersion: rbac.authorization.k8s.io/v1"}<br />
              {"kind: Role"}<br />
              {"metadata:"}<br />
              {"  name: "}{selectedRole}-role<br />
              {"  namespace: production"}<br />
              {"rules:"}<br />
              {roles[selectedRole as keyof typeof roles].permissions.slice(0, 3).map((action) => {
                const act = actions[action as keyof typeof actions];
                return (
                  <>
                    {"- apiGroups: ['']"}<br />
                    {"  resources: ['"}{act.resource}{"']"}<br />
                    {"  verbs: ['"}{act.verb}{"']"}<br />
                  </>
                );
              })}
              <br />
              {"# RoleBinding"}<br />
              {"apiVersion: rbac.authorization.k8s.io/v1"}<br />
              {"kind: RoleBinding"}<br />
              {"metadata:"}<br />
              {"  name: "}{selectedRole}-binding<br />
              {"  namespace: production"}<br />
              {"subjects:"}<br />
              {"- kind: User"}<br />
              {"  name: user@example.com"}<br />
              {"  apiGroup: rbac.authorization.k8s.io"}<br />
              {"roleRef:"}<br />
              {"  kind: Role"}<br />
              {"  name: "}{selectedRole}-role<br />
              {"  apiGroup: rbac.authorization.k8s.io"}
            </div>
          )}
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Common RBAC Verbs</h2>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1rem',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem', fontSize: '0.95rem' }}>
            <div style={{ fontWeight: 600, color: '#1e293b', padding: '0.5rem', background: '#f8fafc' }}>Verb</div>
            <div style={{ fontWeight: 600, color: '#1e293b', padding: '0.5rem', background: '#f8fafc' }}>What It Allows</div>
            
            <div style={{ color: '#1e293b', padding: '0.5rem' }}>get</div>
            <div style={{ color: '#1e293b', padding: '0.5rem' }}>Read a single resource (kubectl get pod my-pod)</div>
            
            <div style={{ color: '#1e293b', padding: '0.5rem', background: '#f8fafc' }}>list</div>
            <div style={{ color: '#1e293b', padding: '0.5rem', background: '#f8fafc' }}>List all resources (kubectl get pods)</div>
            
            <div style={{ color: '#1e293b', padding: '0.5rem' }}>watch</div>
            <div style={{ color: '#1e293b', padding: '0.5rem' }}>Stream updates (kubectl get pods -w)</div>
            
            <div style={{ color: '#1e293b', padding: '0.5rem', background: '#f8fafc' }}>create</div>
            <div style={{ color: '#1e293b', padding: '0.5rem', background: '#f8fafc' }}>Create new resources (kubectl apply -f)</div>
            
            <div style={{ color: '#1e293b', padding: '0.5rem' }}>update</div>
            <div style={{ color: '#1e293b', padding: '0.5rem' }}>Modify existing resources</div>
            
            <div style={{ color: '#1e293b', padding: '0.5rem', background: '#f8fafc' }}>patch</div>
            <div style={{ color: '#1e293b', padding: '0.5rem', background: '#f8fafc' }}>Partially update (kubectl patch)</div>
            
            <div style={{ color: '#1e293b', padding: '0.5rem' }}>delete</div>
            <div style={{ color: '#1e293b', padding: '0.5rem' }}>Delete resources (kubectl delete)</div>
            
            <div style={{ color: '#1e293b', padding: '0.5rem', background: '#f8fafc' }}>deletecollection</div>
            <div style={{ color: '#1e293b', padding: '0.5rem', background: '#f8fafc' }}>Delete multiple (kubectl delete pods --all)</div>
          </div>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Least Privilege in Practice</h2>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          The principle: give the minimum permissions needed to do the job. Nothing more.
        </p>

        <div style={{ marginTop: '1.5rem' }}>
          <div style={{
            background: '#f0fdf4',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            borderLeft: '4px solid #10b981'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>✓ Good: Narrow Scope</h4>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: 'white',
              color: '#1e293b',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              {"# CI/CD pipeline only needs to deploy Deployments"}<br />
              {"rules:"}<br />
              {"- apiGroups: ['apps']"}<br />
              {"  resources: ['deployments']"}<br />
              {"  verbs: ['get', 'list', 'create', 'update']"}<br />
              {"  # No 'delete' - prevents accidents"}
            </div>
          </div>

          <div style={{
            background: '#fef2f2',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            borderLeft: '4px solid #ef4444'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>✗ Bad: Too Broad</h4>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: 'white',
              color: '#1e293b',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              {"# DON'T DO THIS"}<br />
              {"rules:"}<br />
              {"- apiGroups: ['*']  # Everything!"}<br />
              {"  resources: ['*']  # All resources!"}<br />
              {"  verbs: ['*']      # All actions!"}<br />
              {"  # This is basically cluster-admin"}
            </div>
          </div>
        </div>

        <h3 style={{ color: '#1e293b', marginTop: '2rem' }}>Real-World Examples</h3>

        <div style={{ marginTop: '1.5rem' }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Example 1: Developer Access</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6' }}>
              Developers need to debug Pods (logs, exec) but shouldn't access Secrets or modify RBAC.
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: '#1e293b',
              color: '#10b981',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              {"apiVersion: rbac.authorization.k8s.io/v1"}<br />
              {"kind: Role"}<br />
              {"metadata:"}<br />
              {"  name: developer"}<br />
              {"  namespace: staging"}<br />
              {"rules:"}<br />
              {"- apiGroups: ['']"}<br />
              {"  resources: ['pods', 'pods/log', 'pods/exec']"}<br />
              {"  verbs: ['get', 'list', 'watch', 'create']  # exec = create on pods/exec"}<br />
              {"- apiGroups: ['apps']"}<br />
              {"  resources: ['deployments', 'replicasets']"}<br />
              {"  verbs: ['get', 'list', 'watch']  # Read-only for Deployments"}<br />
              {"- apiGroups: ['']"}<br />
              {"  resources: ['services']"}<br />
              {"  verbs: ['get', 'list']"}
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Example 2: CI/CD ServiceAccount</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6' }}>
              CI/CD needs to deploy apps but shouldn't touch infrastructure resources.
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: '#1e293b',
              color: '#10b981',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              {"apiVersion: rbac.authorization.k8s.io/v1"}<br />
              {"kind: Role"}<br />
              {"metadata:"}<br />
              {"  name: deployer"}<br />
              {"  namespace: production"}<br />
              {"rules:"}<br />
              {"- apiGroups: ['apps']"}<br />
              {"  resources: ['deployments']"}<br />
              {"  verbs: ['get', 'list', 'create', 'update', 'patch']"}<br />
              {"- apiGroups: ['']"}<br />
              {"  resources: ['services', 'configmaps']"}<br />
              {"  verbs: ['get', 'list', 'create', 'update', 'patch']"}<br />
              {"# No delete, no secrets, no RBAC"}
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Example 3: Monitoring ServiceAccount</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6' }}>
              Prometheus needs read-only access to cluster metrics.
            </p>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: '#1e293b',
              color: '#10b981',
              padding: '1rem',
              borderRadius: '6px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              {"apiVersion: rbac.authorization.k8s.io/v1"}<br />
              {"kind: ClusterRole  # Cluster-wide read access"}<br />
              {"metadata:"}<br />
              {"  name: prometheus"}<br />
              {"rules:"}<br />
              {"- apiGroups: ['']"}<br />
              {"  resources: ['nodes', 'nodes/metrics', 'services', 'endpoints', 'pods']"}<br />
              {"  verbs: ['get', 'list', 'watch']"}<br />
              {"- nonResourceURLs: ['/metrics']"}<br />
              {"  verbs: ['get']  # For /metrics endpoint"}
            </div>
          </div>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Testing Permissions</h2>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          Use <code style={{ background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '3px' }}>kubectl auth can-i</code> to
          check what you (or a ServiceAccount) can do:
        </p>

        <div style={{
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          background: '#1e293b',
          color: '#10b981',
          padding: '1rem',
          borderRadius: '6px',
          marginTop: '1rem',
          overflowX: 'auto'
        }}>
          {"# Can I create Pods?"}<br />
          kubectl auth can-i create pods<br />
          <br />
          {"# Can I delete Secrets in namespace prod?"}<br />
          kubectl auth can-i delete secrets -n prod<br />
          <br />
          {"# What can the 'deployer' ServiceAccount do?"}<br />
          kubectl auth can-i --list --as=system:serviceaccount:prod:deployer<br />
          <br />
          {"# Impersonate a user to test"}<br />
          kubectl get pods --as=alice@example.com
        </div>

        <div style={{
          background: '#dbeafe',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1.5rem',
          borderLeft: '4px solid #3b82f6'
        }}>
          <p style={{ margin: 0, color: '#1e293b', lineHeight: '1.6' }}>
            <strong>Pro Tip:</strong> Use <code style={{ background: 'white', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>kubectl auth reconcile</code>
            to apply RBAC changes idempotently. It won't error if the role already exists.
          </p>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Built-in ClusterRoles</h2>

        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1e293b' }}>
          Kubernetes comes with several pre-defined ClusterRoles. You can bind these directly or aggregate them.
        </p>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '1rem',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <code style={{ background: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '3px', fontWeight: 600, color: '#9c0606ff' }}>
              cluster-admin
            </code>
            <p style={{ color: '#1e293b', marginTop: '0.5rem', marginBottom: 0 }}>
              God mode. Full access to everything. Only for break-glass scenarios.
            </p>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <code style={{ background: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '3px', fontWeight: 600, color: '#9c0606ff' }}>
              admin
            </code>
            <p style={{ color: '#1e293b', marginTop: '0.5rem', marginBottom: 0 }}>
              Full control within a namespace. Can create Roles and RoleBindings. Good for namespace owners.
            </p>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <code style={{ background: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '3px', fontWeight: 600, color: '#9c0606ff' }}>
              edit
            </code>
            <p style={{ color: '#1e293b', marginTop: '0.5rem', marginBottom: 0 }}>
              Read/write to most resources in a namespace. Cannot modify RBAC. Good for developers.
            </p>
          </div>

          <div>
            <code style={{ background: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '3px', fontWeight: 600, color: '#9c0606ff' }}>
              view
            </code>
            <p style={{ color: '#1e293b', marginTop: '0.5rem', marginBottom: 0 }}>
              Read-only access. Cannot see Secrets or Roles. Good for monitoring tools or auditors.
            </p>
          </div>
        </div>

        <h2 style={{ color: '#1e293b', marginTop: '3rem' }}>Common Mistakes</h2>

        <div style={{ marginTop: '1.5rem' }}>
          <div style={{
            background: '#fef2f2',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            borderLeft: '4px solid #ef4444'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Mistake 1: Binding cluster-admin Everywhere</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
              "It doesn't work, so I'll just give cluster-admin." This defeats the entire purpose of RBAC.
              Debug why the specific permission is missing instead.
            </p>
          </div>

          <div style={{
            background: '#fef2f2',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            borderLeft: '4px solid #ef4444'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Mistake 2: Forgetting apiGroups</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
              Core resources (Pods, Services) use <code style={{ background: 'white', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>apiGroups: ['']</code>.
              Everything else uses specific groups: apps, rbac.authorization.k8s.io, networking.k8s.io, etc.
            </p>
          </div>

          <div style={{
            background: '#fef2f2',
            padding: '1.5rem',
            borderRadius: '8px',
            borderLeft: '4px solid #ef4444'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e293b' }}>Mistake 3: Not Testing ServiceAccount Permissions</h4>
            <p style={{ color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
              Your app works locally but fails in Kubernetes? Check if the ServiceAccount has the right permissions.
              Use <code style={{ background: 'white', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>kubectl auth can-i --as</code> to verify.
            </p>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(to right, #fef3c7, #fde68a)',
          padding: '1.5rem',
          borderRadius: '8px',
          marginTop: '2rem',
          borderLeft: '4px solid #f59e0b'
        }}>
          <p style={{ margin: 0, color: '#1e293b', lineHeight: '1.6' }}>
            <strong>Remember:</strong> RBAC is deny-by-default. No permissions = no access. Start restrictive and
            add permissions as needed. It's easier to grant access later than to revoke overly-broad permissions
            after someone relies on them.
          </p>
        </div>

        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/module-6-2" style={{ color: '#9c0606ff', textDecoration: 'none', fontSize: '1.1rem' }}>← Previous: Ingress</Link>
          <Link href="/module-7-2" style={{
              background: '#9c0606ff',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: 600
            }}>Next: Pod Security →</Link>
        </div>
        <ModuleCompletion moduleId="7-1" />

      </main>
    </div>
  );
}
