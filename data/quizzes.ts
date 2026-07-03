import type { QuizQuestion } from '../components/Quiz';

// Knowledge-check questions for every module, keyed by module id.
// ModuleCompletion renders a Quiz automatically for any module listed here.
export const quizzes: Record<string, QuizQuestion[]> = {
  '0-1': [
    {
      question: 'What is the core problem Kubernetes was built to solve?',
      options: [
        'Making individual containers start faster',
        'Automatically running, healing, and scaling containerized applications across many machines',
        'Replacing the need for containers entirely',
        'Compiling application code for the cloud',
      ],
      correctIndex: 1,
      explanation:
        'Kubernetes is an orchestrator: it schedules containers across machines, restarts them when they crash, scales them up and down, and rolls out updates — the operational work humans used to do by hand.',
    },
    {
      question: 'In the "pets vs cattle" analogy, treating servers as cattle means:',
      options: [
        'Giving each server a memorable hostname and nursing it back to health when it breaks',
        'Running servers only in large herds of 100 or more',
        'Servers are interchangeable and disposable — if one misbehaves, replace it',
        'Never patching or updating servers',
      ],
      correctIndex: 2,
      explanation:
        'Cattle-style infrastructure means no server is special. Instead of lovingly repairing a broken machine (a pet), you terminate it and spin up an identical replacement.',
    },
    {
      question: 'Which situation suggests Kubernetes is probably overkill?',
      options: [
        'A small app with a handful of users that runs comfortably on one server',
        'Dozens of microservices that need independent scaling',
        'A team that needs zero-downtime rolling deployments across many machines',
        'Workloads with unpredictable spikes that need automatic scaling',
      ],
      correctIndex: 0,
      explanation:
        'Kubernetes adds significant operational complexity. If your app fits on a single server and traffic is modest, simpler options (a VM, a PaaS, or plain containers) will serve you better.',
    },
    {
      question: 'Compared to a monolith, a microservices architecture primarily trades:',
      options: [
        'Performance for security',
        'Simplicity for independent deployment and scaling of each service',
        'Cost for programming language flexibility',
        'Reliability for developer happiness',
      ],
      correctIndex: 1,
      explanation:
        'Microservices let teams deploy and scale services independently, but you pay for it with distributed-system complexity — which is exactly the complexity Kubernetes exists to help manage.',
    },
  ],
  '0-2': [
    {
      question: 'What is a container, fundamentally?',
      options: [
        'A lightweight virtual machine with its own kernel',
        'An isolated process (or group of processes) sharing the host kernel, packaged with its dependencies',
        'A zip file of application source code',
        'A physical server dedicated to one application',
      ],
      correctIndex: 1,
      explanation:
        'Containers are just processes with isolation (namespaces) and resource limits (cgroups). Unlike VMs, they share the host kernel — which is why they start in milliseconds.',
    },
    {
      question: 'What is the relationship between an image and a container?',
      options: [
        'They are two names for the same thing',
        'An image is a running container that has been paused',
        'An image is a read-only template; a container is a running instance of that image',
        'A container is a compressed image',
      ],
      correctIndex: 2,
      explanation:
        'Think class vs object: the image is the immutable blueprint (filesystem + metadata), and you can run many containers from the same image.',
    },
    {
      question: 'Why do containers solve the "it works on my machine" problem?',
      options: [
        'They force everyone to use the same laptop',
        'The image bundles the app with its exact dependencies and runtime, so it runs the same everywhere',
        'They automatically fix bugs in the application',
        'They only run on production servers',
      ],
      correctIndex: 1,
      explanation:
        'Because the image ships the whole userland environment (libraries, runtime, config defaults), the app behaves identically on a laptop, CI, or production node.',
    },
    {
      question: 'What is the main difference between containers and virtual machines?',
      options: [
        'VMs virtualize hardware and run their own OS kernel; containers share the host kernel',
        'Containers are always more secure than VMs',
        'VMs start faster than containers',
        'Containers can only run Linux applications, VMs cannot run Linux',
      ],
      correctIndex: 0,
      explanation:
        'A VM boots a full operating system on virtualized hardware. A container is just an isolated process on the host kernel — far lighter, faster to start, but with weaker isolation.',
    },
  ],
  '1-1': [
    {
      question: 'What are the two types of nodes in a Kubernetes cluster?',
      options: [
        'Primary nodes and backup nodes',
        'Control plane nodes and worker nodes',
        'Master nodes and slave containers',
        'Frontend nodes and backend nodes',
      ],
      correctIndex: 1,
      explanation:
        'A cluster is made of control plane nodes (the brains — deciding what runs where) and worker nodes (the muscle — actually running your application Pods).',
    },
    {
      question: 'What is the control plane responsible for?',
      options: [
        'Running your application containers directly',
        'Making cluster-wide decisions: scheduling workloads and maintaining desired state',
        'Serving web traffic to end users',
        'Storing your application data on disk',
      ],
      correctIndex: 1,
      explanation:
        'The control plane makes the global decisions — where Pods run, watching cluster state, reacting to failures. Your application workloads run on worker nodes, not (typically) on the control plane.',
    },
    {
      question: 'What does "a cluster is a promise, not a machine" mean?',
      options: [
        'Kubernetes guarantees your app will never crash',
        'The cluster is only rented, not owned',
        'You declare a desired state, and the cluster continuously works to make reality match it',
        'Nodes promise never to go offline',
      ],
      correctIndex: 2,
      explanation:
        'You tell Kubernetes what you want ("run 3 replicas of this app") and it continuously reconciles reality toward that desired state — restarting, rescheduling, and replacing as needed.',
    },
    {
      question: 'In Kubernetes terminology, a node is:',
      options: [
        'A single container running in the cluster',
        'A machine (virtual or physical) that is part of the cluster',
        'A network connection between two Pods',
        'A copy of the etcd database',
      ],
      correctIndex: 1,
      explanation:
        'Nodes are the building blocks of a cluster: each one is a VM or physical machine contributing CPU and memory that Kubernetes can schedule workloads onto.',
    },
  ],
  '1-2': [
    {
      question: 'Which component is the single entry point for all communication with the cluster?',
      options: ['etcd', 'The Scheduler', 'The API Server', 'kubelet'],
      correctIndex: 2,
      explanation:
        'Everything — kubectl, controllers, kubelets, other components — talks through the API Server. Nothing writes to etcd or commands nodes directly.',
    },
    {
      question: 'What does etcd do?',
      options: [
        'Runs containers on worker nodes',
        'Stores the entire cluster state as a consistent key-value database',
        'Balances network traffic between Pods',
        'Compiles YAML manifests into containers',
      ],
      correctIndex: 1,
      explanation:
        "etcd is the cluster's source of truth. Every object you create — Deployments, Services, Secrets — lives there. Lose etcd without backup and you lose the cluster's memory.",
    },
    {
      question: "What is the Scheduler's job?",
      options: [
        'Running Pods on a fixed timer, like cron',
        'Deciding which node each new Pod should run on',
        'Restarting crashed containers',
        'Scheduling cluster maintenance windows',
      ],
      correctIndex: 1,
      explanation:
        'The Scheduler watches for Pods without an assigned node and picks the best fit based on resources, affinity rules, and taints — it decides placement, then kubelet does the running.',
    },
    {
      question: 'What does the Controller Manager do?',
      options: [
        'Manages human administrators and their permissions',
        'Runs control loops that continuously drive current state toward desired state',
        'Provides the web dashboard UI',
        'Manages the physical network switches',
      ],
      correctIndex: 1,
      explanation:
        'It runs the controllers (ReplicaSet controller, Node controller, etc.) — each one a loop that watches state via the API Server and takes corrective action when reality drifts from the spec.',
    },
  ],
  '1-3': [
    {
      question: 'What is the kubelet?',
      options: [
        'A small kubectl for beginners',
        'The agent on each node that ensures the containers described in PodSpecs are running and healthy',
        'The component that stores cluster state',
        'A network proxy for Services',
      ],
      correctIndex: 1,
      explanation:
        'The kubelet is the node agent: it watches the API Server for Pods assigned to its node, tells the container runtime to run them, and reports status back.',
    },
    {
      question: 'What does the container runtime do?',
      options: [
        'Schedules Pods onto nodes',
        'Actually pulls images and runs containers (e.g., containerd, CRI-O)',
        'Routes Service traffic',
        'Stores container logs permanently',
      ],
      correctIndex: 1,
      explanation:
        'The runtime (containerd, CRI-O) is the low-level engine that pulls images and starts/stops containers. The kubelet instructs it through the Container Runtime Interface (CRI).',
    },
    {
      question: 'What is kube-proxy responsible for?',
      options: [
        'Proxying kubectl commands to the API Server',
        'Maintaining network rules on each node so Service traffic reaches the right Pods',
        'Encrypting all Pod-to-Pod traffic',
        'Serving as a web proxy for outbound internet access',
      ],
      correctIndex: 1,
      explanation:
        'kube-proxy programs iptables/IPVS rules on every node so that traffic to a Service IP gets load-balanced to healthy backend Pods.',
    },
    {
      question: 'How do worker node components receive their instructions?',
      options: [
        'The Scheduler SSHes into each node',
        'etcd pushes updates directly to the kubelet',
        'Everything communicates through the API Server — the kubelet watches it for work assigned to its node',
        'Nodes poll each other in a peer-to-peer mesh',
      ],
      correctIndex: 2,
      explanation:
        'A key Kubernetes design rule: components never talk to each other directly — everything flows through the API Server. The kubelet watches it and acts on Pods scheduled to its node.',
    },
  ],
  '2-1': [
    {
      question: 'What is a Pod?',
      options: [
        'Another name for a container',
        'A wrapper around one or more containers that share networking, storage, and lifecycle',
        'A virtual machine that runs Kubernetes',
        'A group of worker nodes',
      ],
      correctIndex: 1,
      explanation:
        'A Pod is the smallest deployable unit in Kubernetes — not a container, but a "logical host" grouping containers that share the same network namespace, volumes, and lifecycle.',
    },
    {
      question: 'How do containers inside the same Pod communicate with each other?',
      options: [
        'Through the Kubernetes API server',
        'Via localhost, since they share the same network namespace and IP address',
        'They cannot communicate directly',
        'Through an Ingress controller',
      ],
      correctIndex: 1,
      explanation:
        'All containers in a Pod share one IP address and port space, so they talk to each other over localhost — one of the main reasons Pods exist at all.',
    },
    {
      question: 'Why do you almost never create Pods directly?',
      options: [
        'Creating Pods requires cluster-admin permissions',
        'Pods are deprecated in modern Kubernetes',
        'A bare Pod is not rescheduled or replaced when it dies — controllers like Deployments handle that',
        'Pods are too expensive to run individually',
      ],
      correctIndex: 2,
      explanation:
        'A Pod created by hand has no self-healing: if its node dies, the Pod is gone. Deployments (via ReplicaSets) recreate Pods automatically, which is why they manage almost all Pods in practice.',
    },
    {
      question: 'How many containers do most Pods contain in practice?',
      options: [
        'Exactly one',
        'At least two — one app container and one sidecar',
        'Ten or more',
        'Zero — Pods are just configuration',
      ],
      correctIndex: 0,
      explanation:
        'While Pods can hold multiple containers (e.g., sidecars), the common case is a single container per Pod. Multi-container Pods are for tightly coupled helpers, not general grouping.',
    },
  ],
  '2-2': [
    {
      question: 'What does a ReplicaSet do?',
      options: [
        'Backs up your Pods to external storage',
        'Ensures a specified number of identical Pod replicas are running at all times',
        'Copies data between containers',
        'Replicates the etcd database',
      ],
      correctIndex: 1,
      explanation:
        'A ReplicaSet is a control loop: "keep N replicas of this Pod running." A Pod dies, it creates a replacement; too many exist, it deletes extras.',
    },
    {
      question: 'Why use a Deployment instead of a ReplicaSet directly?',
      options: [
        'ReplicaSets are deprecated',
        'Deployments add rolling updates and rollbacks on top of ReplicaSets',
        'Deployments are faster at starting Pods',
        'ReplicaSets cannot run more than 3 replicas',
      ],
      correctIndex: 1,
      explanation:
        'A Deployment manages ReplicaSets for you: on update it creates a new ReplicaSet and gradually shifts Pods over, and keeps history so you can roll back a bad release.',
    },
    {
      question: 'During a rolling update, what does Kubernetes do?',
      options: [
        'Deletes all old Pods, then creates all new ones (brief downtime)',
        'Gradually replaces old Pods with new ones so the app stays available',
        'Pauses all traffic until the update finishes',
        'Requires you to manually delete each old Pod',
      ],
      correctIndex: 1,
      explanation:
        'Rolling updates bring up new Pods and take down old ones incrementally (controlled by maxSurge/maxUnavailable), so users never see an outage during a deploy.',
    },
    {
      question: 'If a deploy goes bad, how do you undo it?',
      options: [
        'Delete the cluster and rebuild',
        'kubectl rollout undo — the Deployment switches back to the previous ReplicaSet',
        'Manually edit every Pod back to the old image',
        'Rollbacks are impossible in Kubernetes',
      ],
      correctIndex: 1,
      explanation:
        'Deployments keep old ReplicaSets (revision history). `kubectl rollout undo deployment/<name>` scales the previous revision back up — the same rolling mechanism, in reverse.',
    },
  ],
  '2-3': [
    {
      question: 'What problem do Services solve?',
      options: [
        'Pods are too slow at serving traffic',
        'Pod IPs are ephemeral — Services give a stable address and DNS name in front of changing Pods',
        'Containers cannot open network ports on their own',
        'Kubernetes has no other way to encrypt traffic',
      ],
      correctIndex: 1,
      explanation:
        'Pods come and go, and each new Pod gets a new IP. A Service provides a stable virtual IP and DNS name that load-balances across whatever healthy Pods match its selector.',
    },
    {
      question: 'Which Service type is only reachable from inside the cluster?',
      options: ['NodePort', 'LoadBalancer', 'ClusterIP', 'ExternalName'],
      correctIndex: 2,
      explanation:
        'ClusterIP (the default) gives the Service an internal-only virtual IP. NodePort and LoadBalancer build on it to expose the Service outside the cluster.',
    },
    {
      question: 'How does a Service know which Pods to send traffic to?',
      options: [
        'You list each Pod IP manually in the Service spec',
        'It uses a label selector — any healthy Pod with matching labels becomes a backend',
        'It sends traffic to every Pod in the namespace',
        'The Scheduler assigns Pods to Services',
      ],
      correctIndex: 1,
      explanation:
        'Services select Pods by labels (e.g., app=web). The endpoints list updates automatically as matching Pods are created, deleted, or fail health checks.',
    },
    {
      question: 'How do Pods typically discover and reach a Service?',
      options: [
        'By hardcoding the Service IP into the container image',
        'By its DNS name (e.g., my-service.my-namespace.svc.cluster.local)',
        'By scanning the network for open ports',
        'By reading the etcd database directly',
      ],
      correctIndex: 1,
      explanation:
        'Cluster DNS gives every Service a predictable name. Apps just connect to "my-service" and DNS resolves it to the stable ClusterIP — no IPs to manage.',
    },
  ],
  '3-1': [
    {
      question: 'What is the main purpose of a ConfigMap?',
      options: [
        'Storing passwords and API keys securely',
        'Separating non-sensitive configuration from container images',
        'Mapping which node each Pod runs on',
        'Configuring the Kubernetes control plane',
      ],
      correctIndex: 1,
      explanation:
        'ConfigMaps hold non-secret config (URLs, feature flags, settings) outside the image, so the same image can run in dev, staging, and production with different config.',
    },
    {
      question: 'What are the two main ways to consume a ConfigMap in a Pod?',
      options: [
        'As environment variables or as files mounted into the container',
        'Via kubectl exec or SSH',
        'Through the API Server or through etcd directly',
        'As command-line flags or as container labels',
      ],
      correctIndex: 0,
      explanation:
        'You can inject ConfigMap keys as environment variables, or mount the ConfigMap as a volume so each key becomes a file — mounted files can even update without a Pod restart.',
    },
    {
      question: 'If you update a ConfigMap consumed as environment variables, what happens to running Pods?',
      options: [
        'They immediately see the new values',
        'Nothing — env vars are set at container start, so Pods must be restarted to pick up changes',
        'They crash instantly',
        'Kubernetes forbids updating ConfigMaps in use',
      ],
      correctIndex: 1,
      explanation:
        'Environment variables are frozen at container startup. Mounted-file ConfigMaps eventually refresh in place, but env-var consumers need a restart (or a rollout) to see updates.',
    },
    {
      question: 'What should NOT go in a ConfigMap?',
      options: [
        'Feature flags',
        'A database hostname',
        'Passwords, tokens, and other sensitive data',
        'Log-level settings',
      ],
      correctIndex: 2,
      explanation:
        'ConfigMaps are stored and transmitted in plain text with no access distinction from other config. Sensitive values belong in Secrets (or an external secret manager).',
    },
  ],
  '3-2': [
    {
      question: 'How are values in a Kubernetes Secret encoded by default?',
      options: [
        'AES-256 encrypted',
        'Base64 encoded — which is NOT encryption',
        'Hashed with SHA-256',
        'Stored as plain text with no encoding',
      ],
      correctIndex: 1,
      explanation:
        'Base64 is a reversible encoding, not encryption — anyone who can read the Secret object can decode it instantly. This is the most misunderstood fact about Secrets.',
    },
    {
      question: 'Why use a Secret instead of a ConfigMap for sensitive data, if neither is encrypted by default?',
      options: [
        'Secrets are actually encrypted with a hardware key',
        'Secrets get separate RBAC treatment, can be encrypted at rest, and are handled more carefully by the system',
        'There is no difference at all',
        'Secrets are stored outside the cluster',
      ],
      correctIndex: 1,
      explanation:
        'The Secret type lets you grant RBAC access to config without exposing credentials, enable encryption-at-rest in etcd, and integrate with external secret managers — the separation is the point.',
    },
    {
      question: 'What is a recommended step to make Secrets genuinely more secure?',
      options: [
        'Commit them to Git so they are versioned',
        'Enable etcd encryption at rest and restrict RBAC access to Secrets',
        'Base64-encode them twice',
        'Email them to the team instead of storing them',
      ],
      correctIndex: 1,
      explanation:
        'Real hardening means encrypting etcd at rest, least-privilege RBAC on Secret objects, and often an external manager (Vault, cloud secret stores) as the source of truth.',
    },
    {
      question: 'How can a Pod consume a Secret?',
      options: [
        'Only by querying the API Server at runtime',
        'As environment variables or mounted files, just like a ConfigMap',
        'Secrets cannot be used by Pods, only by administrators',
        'By embedding it in the container image',
      ],
      correctIndex: 1,
      explanation:
        'Secrets mount the same way as ConfigMaps — env vars or volume files. Mounted files are generally preferred since env vars can leak via logs and child processes.',
    },
  ],
  '3-3': [
    {
      question: 'Why keep dev, staging, and production environments separate?',
      options: [
        'To triple the infrastructure bill',
        'So changes can be tested progressively without risking real users and data',
        'Because Kubernetes requires exactly three clusters',
        'To keep developers away from all Kubernetes access',
      ],
      correctIndex: 1,
      explanation:
        'Each stage catches different problems: dev is for fast iteration, staging mirrors production to catch integration issues, and production serves real traffic — each promotion increases confidence.',
    },
    {
      question: 'What is configuration drift?',
      options: [
        'When config files are too large to load',
        'When environments that should match slowly diverge through ad-hoc manual changes',
        'When a ConfigMap moves between namespaces',
        'When Pods drift between nodes',
      ],
      correctIndex: 1,
      explanation:
        'Drift happens when someone hotfixes staging or prod by hand and never records it. Eventually "staging passed" means nothing because staging no longer resembles production.',
    },
    {
      question: 'What is the common tooling approach for managing per-environment differences?',
      options: [
        'Maintain three completely separate copies of every YAML file',
        'A shared base configuration with small per-environment overlays (e.g., Kustomize)',
        'Editing live objects with kubectl edit in each cluster',
        'Using different container images per environment',
      ],
      correctIndex: 1,
      explanation:
        'Tools like Kustomize keep one base plus tiny overlays (replica counts, resource limits, hostnames per env). Differences stay explicit, reviewable, and version-controlled.',
    },
    {
      question: 'What is the healthiest way to promote a change from dev to production?',
      options: [
        'Rebuild the app from source separately for each environment',
        'Promote the same tested artifact/config through each environment in order',
        'Apply changes directly to production first since it matters most',
        'Copy files from the dev cluster to the prod cluster with scp',
      ],
      correctIndex: 1,
      explanation:
        'Promotion means the exact image and config you validated moves forward unchanged. Rebuilding per environment reintroduces the risk you tested to eliminate.',
    },
  ],
  '4-1': [
    {
      question: 'What is the difference between a resource request and a limit?',
      options: [
        'Requests are for CPU, limits are for memory',
        'A request is what the scheduler reserves for the Pod; a limit is the maximum it may use',
        'They are synonyms',
        'Requests apply in dev, limits apply in production',
      ],
      correctIndex: 1,
      explanation:
        'Requests drive scheduling (the node must have that much free); limits cap runtime usage. A container can burst above its request but never above its limit.',
    },
    {
      question: 'What happens when a container exceeds its memory limit?',
      options: [
        'It gets throttled to run slower',
        'It is OOMKilled — terminated immediately',
        'Kubernetes automatically raises the limit',
        'Nothing, limits are advisory',
      ],
      correctIndex: 1,
      explanation:
        'Memory is incompressible: you cannot take allocated memory back gradually. Exceed the limit and the kernel kills the container (OOMKilled, exit code 137).',
    },
    {
      question: 'What happens when a container tries to exceed its CPU limit?',
      options: [
        'It is killed, same as memory',
        'It is throttled — slowed down but kept running',
        'The node shuts down',
        'The Pod is rescheduled to a bigger node',
      ],
      correctIndex: 1,
      explanation:
        'CPU is compressible: the kernel can just give the container fewer cycles. Hitting the CPU limit makes your app slower, not dead — which is why CPU throttling can be a sneaky performance bug.',
    },
    {
      question: 'Which Pods are evicted first when a node runs out of resources?',
      options: [
        'The oldest Pods',
        'BestEffort Pods (no requests or limits set), then Burstable ones exceeding requests',
        'Guaranteed Pods with requests equal to limits',
        'Pods are never evicted',
      ],
      correctIndex: 1,
      explanation:
        'QoS classes decide eviction order: BestEffort (nothing set) go first, Burstable next, and Guaranteed (requests == limits) are protected longest. Setting requests honestly is self-defense.',
    },
  ],
  '4-2': [
    {
      question: 'What are labels and selectors used for in scheduling?',
      options: [
        'Coloring Pods in the dashboard',
        'Tagging nodes/Pods with key-value pairs and matching against them (e.g., nodeSelector: disktype=ssd)',
        'Encrypting node communication',
        'Setting the Pod restart policy',
      ],
      correctIndex: 1,
      explanation:
        'Labels are arbitrary key-value tags; selectors match against them. They are the foundation of scheduling constraints, Service routing, and almost every "which objects?" question in Kubernetes.',
    },
    {
      question: 'What does a taint on a node do?',
      options: [
        'Marks the node as broken so it is drained',
        'Repels Pods from scheduling there unless they have a matching toleration',
        'Attracts Pods with matching labels',
        'Encrypts the node disk',
      ],
      correctIndex: 1,
      explanation:
        'Taints say "keep Pods away unless explicitly allowed." A toleration on a Pod is permission to schedule there — but note: it permits, it does not attract.',
    },
    {
      question: 'A toleration alone guarantees a Pod will run on the tainted node. True or false?',
      options: [
        'True — tolerations force placement onto the tainted node',
        'False — a toleration only allows it; you need affinity or a selector to actually steer the Pod there',
        'True, but only for control plane nodes',
        'False — tolerations are ignored by the scheduler',
      ],
      correctIndex: 1,
      explanation:
        'A common gotcha: tolerations remove the repulsion but do not add attraction. To dedicate nodes, combine a taint (keep others out) with node affinity (pull the right Pods in).',
    },
    {
      question: 'What is Pod anti-affinity useful for?',
      options: [
        'Preventing Pods from ever restarting',
        'Spreading replicas across different nodes or zones so one failure cannot take them all down',
        'Keeping Pods from communicating with each other',
        'Blocking Pods from specific namespaces',
      ],
      correctIndex: 1,
      explanation:
        'Anti-affinity says "do not place me near Pods matching these labels." Spreading replicas of the same app across nodes/zones is the classic high-availability use.',
    },
  ],
  '4-3': [
    {
      question: 'What does the Horizontal Pod Autoscaler (HPA) do?',
      options: [
        'Increases CPU and memory of existing Pods',
        'Adjusts the number of Pod replicas based on observed metrics like CPU usage',
        'Adds more nodes to the cluster',
        'Restarts Pods that use too much memory',
      ],
      correctIndex: 1,
      explanation:
        'Horizontal scaling means more (or fewer) Pods. HPA watches metrics against a target (e.g., 70% CPU) and adjusts the replica count. Vertical scaling (bigger Pods) and node scaling are different tools.',
    },
    {
      question: 'What must be set on containers for CPU-based HPA to work?',
      options: [
        'A liveness probe',
        'Resource requests — utilization is calculated as a percentage of the request',
        'A LoadBalancer Service',
        'Privileged security context',
      ],
      correctIndex: 1,
      explanation:
        '"70% CPU utilization" means 70% of the requested CPU. Without requests, the HPA has no denominator and cannot compute utilization at all.',
    },
    {
      question: 'When does autoscaling "lie" — scaling in a way that does not help?',
      options: [
        'When traffic increases gradually',
        'When the bottleneck is elsewhere (e.g., the database), so more replicas just add more load to the real bottleneck',
        'When you have more than 10 replicas',
        'When Pods use less than 1 CPU',
      ],
      correctIndex: 1,
      explanation:
        'HPA assumes more replicas = more capacity. If the constraint is a shared dependency (database, external API, lock), scaling out can make things worse, not better.',
    },
    {
      question: 'Why does HPA have stabilization windows / cooldowns?',
      options: [
        'To save on cloud API rate limits',
        'To prevent thrashing — rapidly scaling up and down as metrics fluctuate',
        'Because Pods take exactly 5 minutes to start',
        'To give administrators time to approve each scale event',
      ],
      correctIndex: 1,
      explanation:
        'Metrics are noisy. Without damping, HPA would flap replica counts up and down constantly. Stabilization windows make it react quickly to spikes but scale down conservatively.',
    },
  ],
  '5-1': [
    {
      question: "What happens to files a container writes to its own filesystem when the container restarts?",
      options: [
        'They are preserved forever',
        'They are gone — the container filesystem is ephemeral',
        'They are automatically backed up to etcd',
        'They move to the control plane',
      ],
      correctIndex: 1,
      explanation:
        'A container filesystem lives and dies with the container. Anything that must survive a restart needs a volume — this is the core "containers are disposable" lesson.',
    },
    {
      question: 'What is an emptyDir volume good for?',
      options: [
        'Long-term database storage',
        'Scratch space shared between containers in a Pod, living as long as the Pod does',
        'Mounting the node root filesystem',
        'Storing Secrets encrypted',
      ],
      correctIndex: 1,
      explanation:
        'emptyDir is created when the Pod starts and deleted when the Pod goes away. It survives container restarts within the Pod and is great for caches and sidecar handoff — not for durable data.',
    },
    {
      question: 'Why is hostPath generally discouraged for application data?',
      options: [
        'It is too slow to use',
        'It ties the Pod to one specific node and can expose the host filesystem — a security and portability problem',
        'It only works on Windows nodes',
        'It has a maximum size of 1 GB',
      ],
      correctIndex: 1,
      explanation:
        'hostPath data lives on one node — reschedule the Pod elsewhere and the data is "gone." It also grants access to the host filesystem, which is a security risk.',
    },
    {
      question: 'How do ConfigMap and Secret volumes behave?',
      options: [
        'They are writable scratch space for the app',
        'They mount configuration data into the container as read-only files',
        'They persist application output across Pods',
        'They can only be used by init containers',
      ],
      correctIndex: 1,
      explanation:
        'Mounting a ConfigMap or Secret projects its keys into the container as files — a clean way to deliver config and credentials without baking them into the image.',
    },
  ],
  '5-2': [
    {
      question: 'What problem do PersistentVolumes and PersistentVolumeClaims solve?',
      options: [
        'They make containers start faster',
        'They decouple storage details from Pods: apps claim storage abstractly, admins/provisioners supply it',
        'They compress data to save disk',
        'They replicate data to every node',
      ],
      correctIndex: 1,
      explanation:
        'A PVC says "I need 10Gi of read-write storage" without caring where it comes from. The PV (created by an admin or provisioned dynamically) is the actual storage — the claim binds to it.',
    },
    {
      question: 'What is dynamic provisioning?',
      options: [
        'Manually creating a PV before every PVC',
        'A StorageClass automatically creates the underlying storage when a PVC is made',
        'Pods creating volumes at container runtime',
        'Copying volumes between clusters',
      ],
      correctIndex: 1,
      explanation:
        'With a StorageClass, you skip pre-creating PVs: submit a PVC and the provisioner creates a matching disk (EBS, Ceph, etc.) on demand. This is the modern default.',
    },
    {
      question: 'What does the ReadWriteOnce (RWO) access mode mean?',
      options: [
        'Only one container may ever open the volume',
        'The volume can be mounted read-write by a single node at a time',
        'The volume can be written once, then becomes read-only',
        'Any Pod on any node can write simultaneously',
      ],
      correctIndex: 1,
      explanation:
        'RWO is node-scoped: one node mounts it read-write (multiple Pods on that node can share it). For many-node write access you need ReadWriteMany (RWX), which most block storage cannot do.',
    },
    {
      question: 'Who typically creates the PVC in the PV/PVC model?',
      options: [
        'The cluster administrator only',
        'The application developer — as part of the app manifests',
        'The container runtime',
        'The cloud provider support team',
      ],
      correctIndex: 1,
      explanation:
        'That is the division of labor: developers write PVCs alongside their Deployments ("what my app needs"), while admins manage PVs and StorageClasses ("how storage is supplied").',
    },
  ],
  '5-3': [
    {
      question: 'What does a StatefulSet provide that a Deployment does not?',
      options: [
        'Faster Pod startup',
        'Stable, ordered Pod identities (web-0, web-1...) with per-Pod persistent storage',
        'Automatic database backups',
        'Multi-cluster replication',
      ],
      correctIndex: 1,
      explanation:
        'Deployment Pods are interchangeable cattle with random names. StatefulSet Pods have sticky identities, stable DNS names, and each keeps its own PVC across rescheduling.',
    },
    {
      question: 'How do StatefulSet Pods start by default?',
      options: [
        'All at once, in parallel',
        'In order: pod-0 must be ready before pod-1 starts, and so on',
        'In random order',
        'Only when traffic arrives',
      ],
      correctIndex: 1,
      explanation:
        'Ordered startup (and reverse-order shutdown) matters for systems like databases where the primary must exist before replicas join. Parallel mode is available if order is irrelevant.',
    },
    {
      question: 'What gives StatefulSet Pods stable network identity?',
      options: [
        'Static IP addresses assigned by the admin',
        'A headless Service providing per-Pod DNS names like db-0.db.namespace.svc',
        'kube-proxy pinning connections',
        'A LoadBalancer per Pod',
      ],
      correctIndex: 1,
      explanation:
        'A headless Service (clusterIP: None) gives each Pod a stable DNS entry based on its ordinal. Replicas can reliably address "db-0" as the primary even after rescheduling.',
    },
    {
      question: 'Why the caveat "databases in Kubernetes (carefully)"?',
      options: [
        'Kubernetes cannot mount disks at all',
        'StatefulSets handle orchestration, but backups, failover, and data safety still require real operational care (often via operators or managed services)',
        'Databases are not allowed by the Kubernetes license',
        'StatefulSets have a maximum of 2 replicas',
      ],
      correctIndex: 1,
      explanation:
        'A StatefulSet gives you stable identity and storage — not automatic failover, backups, or corruption protection. Many teams use operators or managed databases instead of DIY.',
    },
  ],
  '6-1': [
    {
      question: 'What is the fundamental rule of the Kubernetes networking model?',
      options: [
        'All traffic must pass through the API Server',
        'Every Pod gets its own IP and can reach every other Pod without NAT',
        'Pods can only talk within their own node',
        'All Pod traffic is encrypted by default',
      ],
      correctIndex: 1,
      explanation:
        'The flat network model: every Pod has a real, routable (in-cluster) IP, and Pod-to-Pod traffic is direct — no port mapping or address translation between them.',
    },
    {
      question: 'What implements this network model in practice?',
      options: [
        'The kubelet writes routing tables by hand',
        'A CNI plugin (Calico, Flannel, Cilium, etc.) chosen for the cluster',
        'The container runtime alone',
        'A hardware router required by Kubernetes',
      ],
      correctIndex: 1,
      explanation:
        'Kubernetes defines the rules but delegates implementation to Container Network Interface plugins — each uses different techniques (overlays, BGP, eBPF) to satisfy the same contract.',
    },
    {
      question: 'Why is "no NAT between Pods" a deliberate design choice?',
      options: [
        'NAT hardware is expensive',
        'It keeps networking simple and debuggable — the IP a Pod sees is the real source IP',
        'NAT is not supported on Linux',
        'It makes Pods unreachable from outside, which is safer',
      ],
      correctIndex: 1,
      explanation:
        'Without NAT, what you see is what there is: source IPs are honest, port conflicts between Pods do not exist, and apps behave like they would on ordinary networked hosts.',
    },
    {
      question: 'A Pod can reach other Pods but a Service name does not resolve. What is the likely suspect?',
      options: [
        'The container image is corrupted',
        'Cluster DNS (CoreDNS) is failing or misconfigured',
        'The node is out of disk',
        'The CNI plugin is not installed',
      ],
      correctIndex: 1,
      explanation:
        'Service discovery is DNS. If Pod IPs work but names fail, look at CoreDNS — one of the most common cluster networking issues in practice.',
    },
  ],
  '6-2': [
    {
      question: 'What is Ingress in Kubernetes?',
      options: [
        'A firewall that blocks incoming traffic',
        'An API for routing external HTTP(S) traffic to Services, based on host and path rules',
        'A type of Service that replaces ClusterIP',
        'A VPN into the cluster',
      ],
      correctIndex: 1,
      explanation:
        'An Ingress resource declares routing rules ("api.example.com/v1 → api-service"). It handles HTTP(S) traffic entering the cluster — one entry point for many Services.',
    },
    {
      question: 'What happens if you create an Ingress resource but no Ingress controller is running?',
      options: [
        'Kubernetes runs a built-in controller automatically',
        'Nothing — the resource sits inert; a controller (nginx, Traefik, HAProxy...) must exist to act on it',
        'The API Server rejects the resource',
        'Traffic is routed by kube-proxy instead',
      ],
      correctIndex: 1,
      explanation:
        'The classic gotcha: Ingress is just data. An Ingress controller is the actual reverse proxy that reads those rules and routes traffic — and it must be installed separately.',
    },
    {
      question: 'What is TLS termination at the Ingress?',
      options: [
        'Blocking all encrypted traffic',
        'The Ingress controller handles HTTPS decryption, then forwards plain HTTP to backend Services',
        'Deleting expired certificates',
        'Forcing every Pod to hold its own certificate',
      ],
      correctIndex: 1,
      explanation:
        'Terminating TLS at the edge centralizes certificate management in one place; backends receive decrypted traffic inside the cluster network.',
    },
    {
      question: 'When is Ingress the wrong tool?',
      options: [
        'When you have more than one Service',
        'For non-HTTP protocols (raw TCP/UDP, databases) — Ingress is HTTP(S)-centric',
        'When you need path-based routing',
        'When you want a single external IP',
      ],
      correctIndex: 1,
      explanation:
        'Ingress speaks HTTP. For a database port or custom TCP protocol, use a LoadBalancer/NodePort Service (or a controller-specific TCP passthrough), not an Ingress rule.',
    },
  ],
  '7-1': [
    {
      question: 'What is the difference between a User and a ServiceAccount?',
      options: [
        'There is none',
        'Users represent humans (managed outside Kubernetes); ServiceAccounts are identities for workloads inside the cluster',
        'ServiceAccounts are for administrators only',
        'Users are per-namespace, ServiceAccounts are cluster-wide',
      ],
      correctIndex: 1,
      explanation:
        'Kubernetes has no User objects — human identity comes from certificates/OIDC outside the API. ServiceAccounts are in-cluster identities that Pods use to call the API.',
    },
    {
      question: 'What is the relationship between a Role and a RoleBinding?',
      options: [
        'A Role defines a set of permissions; a RoleBinding grants that Role to specific subjects',
        'A RoleBinding defines permissions; a Role assigns them',
        'They are interchangeable',
        'Roles are for Pods, RoleBindings are for nodes',
      ],
      correctIndex: 0,
      explanation:
        'Roles are the "what" (verbs on resources); bindings are the "who" (users, groups, ServiceAccounts). Permission requires both halves.',
    },
    {
      question: 'What is the difference between a Role and a ClusterRole?',
      options: [
        'ClusterRoles are read-only',
        'A Role is namespaced; a ClusterRole applies cluster-wide (or across namespaces / non-namespaced resources)',
        'Roles are deprecated in favor of ClusterRoles',
        'ClusterRoles can only be used by the admin user',
      ],
      correctIndex: 1,
      explanation:
        'Roles live in one namespace. ClusterRoles cover cluster-scoped resources (like nodes) or can be bound in many namespaces — useful for shared permission sets.',
    },
    {
      question: 'How can you check whether an identity is allowed to do something?',
      options: [
        'Try it in production and see',
        'kubectl auth can-i <verb> <resource> --as=<subject>',
        'Read the etcd database',
        'There is no way to test permissions',
      ],
      correctIndex: 1,
      explanation:
        '`kubectl auth can-i` asks the API Server to evaluate a permission — with --as you can impersonate a ServiceAccount or user to verify RBAC without risky experiments.',
    },
  ],
  '7-2': [
    {
      question: 'What does a SecurityContext control?',
      options: [
        'Which namespace a Pod runs in',
        'Security settings for Pods/containers: user ID, privilege escalation, capabilities, filesystem permissions',
        'TLS certificates for Services',
        'Network firewall rules',
      ],
      correctIndex: 1,
      explanation:
        'SecurityContext is where you declare runAsNonRoot, allowPrivilegeEscalation: false, dropped capabilities, read-only root filesystem — the guardrails on what the process can do.',
    },
    {
      question: 'Why is privileged: true so dangerous?',
      options: [
        'It uses more CPU',
        'It gives the container essentially full access to the host — root on the node, defeating container isolation',
        'It prevents the Pod from being scheduled',
        'It disables logging',
      ],
      correctIndex: 1,
      explanation:
        'A privileged container gets all capabilities and device access — escaping to the host is trivial. Compromise one privileged Pod and the attacker effectively owns the node.',
    },
    {
      question: 'What are the three Pod Security Standards levels?',
      options: [
        'Low, Medium, High',
        'Privileged, Baseline, Restricted',
        'Dev, Staging, Production',
        'Open, Guarded, Locked',
      ],
      correctIndex: 1,
      explanation:
        'Privileged (anything goes), Baseline (blocks known privilege escalations), Restricted (hardened best practice: non-root, dropped capabilities, no escalation). Namespaces can enforce a level.',
    },
    {
      question: 'Which combination reflects a hardened Pod?',
      options: [
        'runAsUser: 0 with privileged: true',
        'runAsNonRoot: true, allowPrivilegeEscalation: false, drop ALL capabilities, readOnlyRootFilesystem: true',
        'hostNetwork: true with hostPath mounts',
        'No securityContext at all — defaults are the safest',
      ],
      correctIndex: 1,
      explanation:
        'That set is the Restricted-profile core: no root, no escalation path, minimal kernel capabilities, immutable root filesystem. Defaults in Kubernetes are permissive, not safe.',
    },
  ],
  '7-3': [
    {
      question: 'With no NetworkPolicies in place, what traffic is allowed between Pods?',
      options: [
        'None — everything is denied by default',
        'All of it — every Pod can talk to every other Pod',
        'Only traffic within the same namespace',
        'Only HTTPS traffic',
      ],
      correctIndex: 1,
      explanation:
        'Kubernetes defaults to a flat, open network. NetworkPolicies are how you opt in to restrictions — until then, east-west traffic is unrestricted.',
    },
    {
      question: 'What happens once any NetworkPolicy selects a Pod for ingress?',
      options: [
        'Nothing changes until 10 policies exist',
        'That Pod becomes default-deny for ingress: only traffic matching some policy is allowed',
        'The Pod is restarted',
        'All egress is also blocked automatically',
      ],
      correctIndex: 1,
      explanation:
        'Policies are additive whitelists: selection flips the Pod to deny-by-default for that direction, and each policy then opens specific holes. Ingress and egress are controlled separately.',
    },
    {
      question: 'What is "east-west" traffic?',
      options: [
        'Traffic between data centers in different regions',
        'Pod-to-Pod / service-to-service traffic inside the cluster',
        'Traffic from users on the internet',
        'DNS queries only',
      ],
      correctIndex: 1,
      explanation:
        'North-south is in/out of the cluster; east-west is lateral movement inside it. Zero-trust means restricting east-west so a compromised Pod cannot roam freely.',
    },
    {
      question: 'A NetworkPolicy is applied but traffic is not being blocked. A classic reason is:',
      options: [
        'NetworkPolicies must be written in JSON',
        'The cluster CNI plugin does not enforce NetworkPolicies',
        'The Pods need privileged mode',
        'Policies only work on control plane nodes',
      ],
      correctIndex: 1,
      explanation:
        'Enforcement is the CNI plugin\'s job — some (like classic Flannel) accept the objects but silently ignore them. Always confirm your CNI supports policies.',
    },
  ],
  '8-1': [
    {
      question: 'Where should containerized applications write their logs?',
      options: [
        'To a log file deep inside the container filesystem',
        'To stdout and stderr, letting the platform collect them',
        'Directly to a database',
        'To the node syslog via SSH',
      ],
      correctIndex: 1,
      explanation:
        'The twelve-factor rule: apps write to stdout/stderr; the runtime captures the streams, kubectl logs can read them, and node agents ship them to a central store.',
    },
    {
      question: 'Why is centralized logging important in Kubernetes?',
      options: [
        'It makes logs prettier',
        'Pod logs vanish when Pods are deleted or rescheduled — central collection preserves and correlates them',
        'kubectl cannot read logs at all',
        'It is required for Pods to start',
      ],
      correctIndex: 1,
      explanation:
        'kubectl logs only shows what is on the node right now, from a Pod that still exists. Aggregation (e.g., a node-level agent shipping to Elasticsearch/Loki) survives Pod churn and enables search.',
    },
    {
      question: 'What is structured logging and why prefer it?',
      options: [
        'Indenting log lines with tabs',
        'Emitting logs as machine-parseable key-value data (often JSON), making search and filtering reliable',
        'Writing logs in alphabetical order',
        'Only logging errors',
      ],
      correctIndex: 1,
      explanation:
        'Structured logs turn "grep and pray" into real queries: filter by level, request ID, user, or latency. Free-text logs are for humans; structured logs are for systems and humans.',
    },
    {
      question: 'What is a correlation ID for?',
      options: [
        'Correlating CPU with memory usage',
        'Tracing one request across multiple services by tagging every log line it generates with the same ID',
        'Encrypting log content',
        'Numbering log files on disk',
      ],
      correctIndex: 1,
      explanation:
        'In a microservices system, one user action touches many services. A shared correlation ID stitches those scattered log lines back into a single story.',
    },
  ],
  '8-2': [
    {
      question: 'How does Prometheus collect metrics?',
      options: [
        'Applications push metrics to it continuously',
        'It scrapes HTTP /metrics endpoints exposed by applications and exporters on an interval',
        'It reads them from container logs',
        'It queries etcd for metrics',
      ],
      correctIndex: 1,
      explanation:
        'Prometheus uses a pull model: targets expose a /metrics endpoint and Prometheus scrapes them periodically, storing the results as time series.',
    },
    {
      question: 'Which is a sensible thing to alert on?',
      options: [
        'Every Pod restart, immediately',
        'User-facing symptoms: sustained error-rate or latency beyond an acceptable threshold',
        'CPU usage above 50% for any container',
        'Each new deployment',
      ],
      correctIndex: 1,
      explanation:
        'Alert on symptoms users feel (errors, latency, saturation), not on every internal cause. Kubernetes restarts Pods by design — paging on routine events breeds alert fatigue.',
    },
    {
      question: 'Why is alerting on every transient spike a bad idea?',
      options: [
        'Alerts cost money per message',
        'Alert fatigue: constant noise trains people to ignore alerts, so real incidents get missed',
        'Prometheus cannot send more than 10 alerts',
        'Spikes are always harmless',
      ],
      correctIndex: 1,
      explanation:
        'An alert should mean "a human must act now." Noisy alerts erode that meaning, and the one page that matters drowns in the hundred that do not.',
    },
    {
      question: 'What are metrics, versus logs?',
      options: [
        'They are the same data in different formats',
        'Metrics are cheap numeric time series for trends and alerting; logs are detailed event records for investigation',
        'Metrics are only for billing',
        'Logs are numeric, metrics are text',
      ],
      correctIndex: 1,
      explanation:
        'Metrics answer "how much, how fast, is it getting worse?" efficiently over time. Logs answer "what exactly happened in this request?" They complement, not replace, each other.',
    },
  ],
  '8-3': [
    {
      question: 'A Pod is stuck in Pending. Which command best reveals why?',
      options: [
        'kubectl logs <pod>',
        'kubectl describe pod <pod> — the Events section usually says why it cannot schedule',
        'kubectl delete pod <pod>',
        'kubectl exec -it <pod> -- sh',
      ],
      correctIndex: 1,
      explanation:
        'Pending means no node has accepted the Pod, so there are no logs yet. describe shows scheduler events like "Insufficient cpu" or unbound PVCs — the crime scene report.',
    },
    {
      question: 'What does CrashLoopBackOff mean?',
      options: [
        'The node has crashed',
        'The container keeps exiting shortly after start, and Kubernetes is waiting increasingly longer between restart attempts',
        'The image could not be downloaded',
        'The Pod is out of disk space',
      ],
      correctIndex: 1,
      explanation:
        'The container starts, dies, restarts, dies... Kubernetes backs off exponentially between attempts. The container is broken (bad config, missing dependency, crash on boot) — check its logs.',
    },
    {
      question: 'How do you see the logs of the PREVIOUS (crashed) container instance?',
      options: [
        'kubectl logs <pod> --previous',
        'kubectl describe pod <pod>',
        'You cannot — they are deleted immediately',
        'kubectl get events',
      ],
      correctIndex: 0,
      explanation:
        'The current container may be seconds old with empty logs. --previous shows output from the instance that just crashed — usually where the actual error is.',
    },
    {
      question: 'What does kubectl exec let you do?',
      options: [
        'Execute YAML files',
        'Run a command inside a running container (e.g., open a shell) to inspect it from within',
        'Execute commands on the control plane',
        'Restart the kubelet',
      ],
      correctIndex: 1,
      explanation:
        'exec drops you into the container: check env vars, test DNS, hit localhost endpoints. Essential for "works from outside but not inside" mysteries.',
    },
  ],
  '9-1': [
    {
      question: 'Why is deploying with the :latest tag a bad practice?',
      options: [
        'It is slower to pull',
        'It is ambiguous and mutable — you cannot tell what is running, reproduce it, or roll back reliably',
        'Kubernetes rejects it',
        'It only works with Docker Hub',
      ],
      correctIndex: 1,
      explanation:
        '"latest" points at different images over time. Two nodes may pull different versions; rollback becomes meaningless. Deploy specific, immutable tags (version or commit SHA).',
    },
    {
      question: 'What does an "immutable deployment" mean?',
      options: [
        'The application can never be updated',
        'Once built, an image/tag never changes — updates ship as new tags, never by overwriting old ones',
        'Pods cannot be deleted',
        'Configuration is hardcoded in the image',
      ],
      correctIndex: 1,
      explanation:
        'Immutability makes deployments reproducible and rollbacks trustworthy: tag v1.4.2 is the same bits forever, so "go back to v1.4.1" means something.',
    },
    {
      question: 'What role do readiness probes play during a rolling update?',
      options: [
        'They speed up image pulls',
        'They gate traffic: new Pods only receive requests once ready, so a broken release does not take traffic',
        'They restart the old Pods faster',
        'They are only used at initial deploy',
      ],
      correctIndex: 1,
      explanation:
        'The rollout waits for new Pods to pass readiness before shifting traffic and killing old ones. Without honest probes, Kubernetes happily routes users to a Pod that is not actually working.',
    },
    {
      question: 'What do maxSurge and maxUnavailable control?',
      options: [
        'Node autoscaling limits',
        'How many extra Pods may be created and how many may be down during a rolling update',
        'CPU and memory limits',
        'The number of allowed rollbacks',
      ],
      correctIndex: 1,
      explanation:
        'They tune rollout speed vs safety: maxSurge = how far above desired count you may go; maxUnavailable = how far below. (25%/25% is the default trade-off.)',
    },
  ],
  '9-2': [
    {
      question: 'What is the core idea of GitOps?',
      options: [
        'Storing application code in Git',
        'Git holds the declared desired state of your infrastructure, and automation continuously syncs the cluster to match it',
        'Deploying by running git pull on each node',
        'Using GitHub Actions for everything',
      ],
      correctIndex: 1,
      explanation:
        'In GitOps, the repo is the source of truth. An in-cluster agent (Argo CD, Flux) watches it and reconciles the cluster toward whatever is committed — deploys become merges.',
    },
    {
      question: 'How does a GitOps agent like Argo CD typically apply changes?',
      options: [
        'CI pushes kubectl apply from the build server into the cluster',
        'The agent runs inside the cluster and pulls desired state from Git, then syncs',
        'Developers apply manifests manually after approval',
        'Git hooks SSH into nodes',
      ],
      correctIndex: 1,
      explanation:
        'The pull model is the differentiator: nothing outside needs cluster credentials. The agent watches the repo, detects drift ("OutOfSync"), and converges the cluster.',
    },
    {
      question: 'Someone kubectl-edits a Deployment by hand in a GitOps-managed cluster. What happens?',
      options: [
        'The change becomes permanent',
        'The agent detects drift from Git and reverts (or flags) the change',
        'Git is automatically updated to match the cluster',
        'The cluster locks all further changes',
      ],
      correctIndex: 1,
      explanation:
        'Reconciliation is continuous: the live state no longer matches Git, so the agent puts it back (or marks the app OutOfSync). To change production, you change Git.',
    },
    {
      question: 'What operational benefits does GitOps give you?',
      options: [
        'Fewer YAML files',
        'Audit trail, reviewable changes, easy rollback (git revert), and reproducible environments',
        'No need for CI pipelines',
        'Automatic database migrations',
      ],
      correctIndex: 1,
      explanation:
        'Every change is a commit: who, what, when, why — with PR review before and `git revert` after. Rebuilding an environment is "point the agent at the repo."',
    },
  ],
  '10-1': [
    {
      question: 'A Pod is in CrashLoopBackOff. What is the FIRST thing to check?',
      options: [
        'The cloud provider status page',
        'The container logs (including --previous) for why the process exits',
        'The Ingress configuration',
        'Node kernel versions',
      ],
      correctIndex: 1,
      explanation:
        'CrashLoopBackOff means the process keeps dying — the reason is almost always in the container output: bad config, missing env var, failed connection, crash on boot.',
    },
    {
      question: 'How can a misconfigured liveness probe take down a healthy app?',
      options: [
        'It cannot — probes are read-only',
        'An over-aggressive probe (too-short timeout, wrong path) fails and Kubernetes kills healthy containers in a loop',
        'It deletes the Deployment',
        'It blocks DNS resolution',
      ],
      correctIndex: 1,
      explanation:
        'The liveness probe is a kill switch. If it checks the wrong endpoint or times out during normal slow starts, Kubernetes "helpfully" restarts perfectly healthy Pods forever.',
    },
    {
      question: 'Pods are being OOMKilled after a traffic increase. The right fix is usually:',
      options: [
        'Remove all memory limits so nothing gets killed',
        'Measure real usage, then raise requests/limits appropriately (or fix the leak / add replicas)',
        'Restart the node',
        'Switch to privileged containers',
      ],
      correctIndex: 1,
      explanation:
        'OOMKills mean the workload needs more than it is allowed. Removing limits just moves the failure to the node. Right-size from real metrics — or fix the leak the metrics reveal.',
    },
    {
      question: 'Symptoms like "sometimes service names fail to resolve" point to:',
      options: [
        'A corrupted container image',
        'Cluster DNS problems (CoreDNS overload or misconfiguration)',
        'An expired TLS certificate',
        'The scheduler being down',
      ],
      correctIndex: 1,
      explanation:
        'Intermittent name-resolution failures are the classic DNS smell. Check CoreDNS Pods, their load and errors — DNS issues masquerade as dozens of other bugs.',
    },
  ],
  '10-2': [
    {
      question: 'What does a managed Kubernetes service (EKS, GKE, AKS) handle for you?',
      options: [
        'Everything, including your application bugs',
        'The control plane: API Server, etcd, upgrades and availability of the cluster brain',
        'Only the billing',
        'Writing your Deployment manifests',
      ],
      correctIndex: 1,
      explanation:
        'The provider runs and backs up the control plane. That removes the hardest ops burden — you no longer nurse etcd at 3 AM.',
    },
    {
      question: 'What is still YOUR responsibility on managed Kubernetes?',
      options: [
        'Nothing — it is fully managed',
        'Workloads: app configuration, resource limits, security policies, monitoring, and (largely) node management',
        'Only DNS records',
        'The physical data center',
      ],
      correctIndex: 1,
      explanation:
        'Managed control plane ≠ managed applications. Misconfigured probes, missing limits, open RBAC, and broken deploys are still entirely yours to own.',
    },
    {
      question: 'How does OpenShift differ from plain managed Kubernetes?',
      options: [
        'It is not based on Kubernetes at all',
        'It layers an opinionated platform on top: built-in CI/CD, image registry, developer tooling, and stricter security defaults',
        'It only runs on bare metal',
        'It removes the API Server',
      ],
      correctIndex: 1,
      explanation:
        'OpenShift is Kubernetes plus batteries: routes, integrated builds, an internal registry, and notably stricter defaults (e.g., containers run as non-root by default).',
    },
    {
      question: 'When might you choose managed Kubernetes over self-hosting?',
      options: [
        'Only when money is unlimited',
        'Almost always, unless you have hard requirements (compliance, air-gapped, special hardware) and a team ready to operate control planes',
        'Never — self-hosting is always better',
        'Only for clusters under 3 nodes',
      ],
      correctIndex: 1,
      explanation:
        'Operating etcd, upgrades, and control plane HA well takes dedicated expertise. For most teams the managed premium is far cheaper than the engineering time it replaces.',
    },
  ],
  '10-3': [
    {
      question: 'What is the honest first question before adopting Kubernetes?',
      options: [
        'Which cloud has the cheapest nodes?',
        'Do we actually have the scale, team, and operational need to justify its complexity?',
        'How fast can we migrate everything?',
        'Which service mesh should we pick?',
      ],
      correctIndex: 1,
      explanation:
        'Kubernetes is a power tool with a real ongoing cost: expertise, upgrades, debugging distributed failures. If a simpler platform serves your needs, that is engineering maturity, not weakness.',
    },
    {
      question: 'Which is a reasonable simpler alternative for a small web app?',
      options: [
        'A bigger Kubernetes cluster',
        'A PaaS or container service (Heroku-style platforms, Cloud Run, App Service, a VM with docker compose)',
        'Writing a custom orchestrator',
        'Running production from a laptop',
      ],
      correctIndex: 1,
      explanation:
        'Managed platforms give deploys, scaling, and TLS with a fraction of the operational surface. Many successful products never need more than that.',
    },
    {
      question: 'Which signal genuinely favors adopting Kubernetes?',
      options: [
        'The team read about it on Hacker News',
        'Many services, multiple teams, non-trivial scaling and availability requirements that simpler platforms cannot express',
        'A single monolith with steady low traffic',
        'Wanting to add it to the company tech radar',
      ],
      correctIndex: 1,
      explanation:
        'Kubernetes pays off when its abstractions match real problems: fleets of services, portability requirements, sophisticated rollout and scaling needs across teams.',
    },
    {
      question: 'What is the hidden cost most teams underestimate?',
      options: [
        'The license fee for Kubernetes',
        'Ongoing operational load: upgrades, security patching, debugging, and the expertise to do all of it well',
        'Disk space for YAML files',
        'DNS registration costs',
      ],
      correctIndex: 1,
      explanation:
        'Kubernetes is free like a puppy: the acquisition is easy, the years of care are the real commitment. Budget for the operating, not just the adopting.',
    },
  ],
};
