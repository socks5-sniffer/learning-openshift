import { useState } from 'react';
import styles from '../styles/Home.module.css';
import moduleStyles from '../styles/Module.module.css';
import ModuleShell from '../components/module/ModuleShell';
import Callout from '../components/module/Callout';
import TermBox from '../components/module/TermBox';

const cardBase: React.CSSProperties = {
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  padding: '24px',
  cursor: 'pointer',
  transition: 'all var(--transition-normal)',
  background: 'var(--color-bg-elevated)',
};

const diagramBox: React.CSSProperties = {
  background: '#0f172a',
  color: '#e2e8f0',
  padding: '16px',
  borderRadius: 'var(--radius-md)',
  margin: '12px 0',
  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
  fontSize: '0.9rem',
};

export default function Module02() {
  const [showVMDetails, setShowVMDetails] = useState(false);
  const [showContainerDetails, setShowContainerDetails] = useState(false);

  return (
    <ModuleShell id="0-2" subtitle="(Just Enough Docker)">
      <section className={styles.spotlight}>
        <h2>What a Container Actually Is</h2>
        <p>
          A <strong>container</strong> is a lightweight, standalone package that includes everything
          needed to run a piece of software: the code, runtime, system tools, libraries, and settings.
          It's isolated from other containers and the host system, but shares the host's operating
          system kernel.
        </p>

        <h3>The Simple Explanation</h3>
        <p>
          Think of a container as a <em>standardized shipping container</em> for software. Just like
          physical shipping containers can hold anything (furniture, electronics, bananas) and be
          transported by any ship, truck, or train without repacking, software containers can hold
          any application and run on any system that has a container runtime (like Docker).
        </p>

        <h3>The Technical Explanation</h3>
        <p>
          Containers use Linux kernel features (namespaces and cgroups) to create isolated environments.
          Each container has its own:
        </p>
        <ul>
          <li><strong>File system:</strong> Its own root directory, libraries, and binaries</li>
          <li><strong>Process space:</strong> Processes inside can't see processes outside</li>
          <li><strong>Network stack:</strong> Its own IP address and ports</li>
          <li><strong>Users:</strong> Root inside the container ≠ root on the host (hopefully)</li>
        </ul>

        <Callout variant="info" icon="💡" title="Key Insight">
          <p>
            Containers are <strong>not tiny virtual machines</strong>. VMs virtualize hardware and
            run a full OS. Containers share the host OS kernel and virtualize at the OS level.
            This makes them much lighter and faster to start.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Interactive: Containers vs Virtual Machines</h2>
        <p>Click on each to see the differences:</p>

        <div className={moduleStyles.grid}>
          <div onClick={() => setShowVMDetails(!showVMDetails)} style={cardBase}>
            <h3 style={{ marginTop: 0, color: 'var(--color-text-accent)' }}>🖥️ Virtual Machine</h3>
            <div style={diagramBox}>
              <div>┌─ Host OS ─────────────┐</div>
              <div>│  Hypervisor           │</div>
              <div>│  ┌─ Guest OS ───────┐ │</div>
              <div>│  │  Kernel           │ │</div>
              <div>│  │  Libraries        │ │</div>
              <div>│  │  App              │ │</div>
              <div>│  └───────────────────┘ │</div>
              <div>└───────────────────────┘</div>
            </div>
            {showVMDetails && (
              <div style={{ marginTop: '16px', fontSize: '0.95rem' }}>
                <p><strong>Size:</strong> GBs (includes full OS)</p>
                <p><strong>Startup:</strong> Minutes</p>
                <p><strong>Isolation:</strong> Complete (separate kernel)</p>
                <p><strong>Overhead:</strong> High (virtualizes hardware)</p>
                <p><strong>Use case:</strong> Running different OSes, complete isolation</p>
              </div>
            )}
          </div>

          <div onClick={() => setShowContainerDetails(!showContainerDetails)} style={cardBase}>
            <h3 style={{ marginTop: 0, color: 'var(--color-info)' }}>📦 Container</h3>
            <div style={diagramBox}>
              <div>┌─ Host OS ─────────────┐</div>
              <div>│  Container Runtime    │</div>
              <div>│  ┌─ Container ──────┐ │</div>
              <div>│  │  Libraries       │ │</div>
              <div>│  │  App             │ │</div>
              <div>│  └──────────────────┘ │</div>
              <div>│  (shares host kernel) │</div>
              <div>└───────────────────────┘</div>
            </div>
            {showContainerDetails && (
              <div style={{ marginTop: '16px', fontSize: '0.95rem' }}>
                <p><strong>Size:</strong> MBs (shares host kernel)</p>
                <p><strong>Startup:</strong> Seconds (or less)</p>
                <p><strong>Isolation:</strong> Process-level</p>
                <p><strong>Overhead:</strong> Low (no hardware virtualization)</p>
                <p><strong>Use case:</strong> Microservices, rapid deployment, scaling</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className={styles.spotlight}>
        <h2>Images vs Containers</h2>
        <p>This distinction trips up everyone at first.</p>

        <h3>Container Image 📄</h3>
        <p>
          A <strong>container image</strong> is a template—a read-only blueprint for creating containers.
          It's a snapshot of a file system with all the dependencies and configuration needed to run
          an application.
        </p>
        <ul>
          <li>Built from a Dockerfile (a recipe)</li>
          <li>Stored in registries (Docker Hub, Google Container Registry, etc.)</li>
          <li>Immutable—once built, it doesn't change</li>
          <li>Versioned with tags (e.g., <code>nginx:1.21</code>, <code>myapp:latest</code>)</li>
        </ul>

        <h3>Container 🏃</h3>
        <p>
          A <strong>container</strong> is a running instance of an image. You can create many containers
          from the same image, just like you can bake many cookies from the same recipe.
        </p>
        <ul>
          <li>Running processes with isolated resources</li>
          <li>Can be started, stopped, deleted</li>
          <li>Has its own writable layer (changes don't affect the image)</li>
          <li>Ephemeral—when deleted, any changes are lost (unless saved to volumes)</li>
        </ul>

        <Callout variant="warning" icon="🔑" title="Analogy">
          <p>
            <strong>Image = Class</strong> in programming<br />
            <strong>Container = Instance</strong> of that class<br /><br />
            You can create multiple instances (containers) from one class (image), and each instance
            can have different runtime state.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Why "It Works on My Machine" Is a Crime</h2>
        <p>
          We've all heard (or said) this phrase. It's the developer equivalent of a shrug emoji.
          Containers exist largely to make this excuse impossible.
        </p>

        <h3>The Problem</h3>
        <p>Software has dependencies—lots of them:</p>
        <ul>
          <li>Programming language version (Python 3.9? 3.11?)</li>
          <li>Libraries and packages (and <em>their</em> versions)</li>
          <li>Environment variables</li>
          <li>System-level dependencies (image processing libraries, database drivers)</li>
          <li>Operating system differences (macOS vs Linux vs Windows)</li>
        </ul>
        <p>
          Traditionally, setting up a development environment meant spending hours (or days) installing
          everything correctly. Then a teammate joins, and they have to do it all again. Then production
          has a different setup, and things break mysteriously.
        </p>

        <h3>The Solution</h3>
        <p>
          With containers, the development environment <strong>IS</strong> the production environment.
          The container image contains all dependencies, configured exactly the same way. If it works
          in a container on your laptop, it will work in a container in production.
        </p>

        <Callout variant="success" icon="✅" title="Benefits of Containers">
          <ul>
            <li><strong>Consistency:</strong> Same environment everywhere</li>
            <li><strong>Reproducibility:</strong> Anyone can run your app instantly</li>
            <li><strong>Isolation:</strong> Dependencies don't conflict with other projects</li>
            <li><strong>Portability:</strong> Runs on any system with a container runtime</li>
          </ul>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Building and Running a Simple Container</h2>
        <p>Let's walk through a practical example. Here's a simple Node.js app:</p>

        <h3>Step 1: Write Your Application</h3>
        <TermBox>
          <div style={{ color: '#64748b' }}>// app.js</div>
          <div style={{ color: '#f1f5f9' }}>const express = require('express');</div>
          <div style={{ color: '#f1f5f9' }}>const app = express();</div>
          <div style={{ color: '#f1f5f9' }}>const PORT = 3000;</div>
          <br />
          <div style={{ color: '#f1f5f9' }}>app.get('/', (req, res) =&gt; {'{'}</div>
          <div style={{ color: '#f1f5f9' }}>&nbsp;&nbsp;res.send('Hello from a container!');</div>
          <div style={{ color: '#f1f5f9' }}>{'}'});</div>
          <br />
          <div style={{ color: '#f1f5f9' }}>app.listen(PORT, () =&gt; {'{'}</div>
          <div style={{ color: '#f1f5f9' }}>&nbsp;&nbsp;console.log(`Server running on port ${'{'}PORT{'}'}`);</div>
          <div style={{ color: '#f1f5f9' }}>{'}'});</div>
        </TermBox>

        <h3>Step 2: Create a Dockerfile</h3>
        <p>A Dockerfile is the recipe for building your container image.</p>
        <TermBox>
          <div style={{ color: '#64748b' }}># Start from a base image with Node.js installed</div>
          <div style={{ color: '#f1f5f9' }}>FROM node:18-alpine</div>
          <br />
          <div style={{ color: '#64748b' }}># Set the working directory inside the container</div>
          <div style={{ color: '#f1f5f9' }}>WORKDIR /app</div>
          <br />
          <div style={{ color: '#64748b' }}># Copy package files and install dependencies</div>
          <div style={{ color: '#f1f5f9' }}>COPY package*.json ./</div>
          <div style={{ color: '#f1f5f9' }}>RUN npm install</div>
          <br />
          <div style={{ color: '#64748b' }}># Copy the rest of the application code</div>
          <div style={{ color: '#f1f5f9' }}>COPY . .</div>
          <br />
          <div style={{ color: '#64748b' }}># Expose the port the app runs on</div>
          <div style={{ color: '#f1f5f9' }}>EXPOSE 3000</div>
          <br />
          <div style={{ color: '#64748b' }}># Command to run when container starts</div>
          <div style={{ color: '#f1f5f9' }}>CMD ["node", "app.js"]</div>
        </TermBox>

        <h3>Step 3: Build the Image</h3>
        <TermBox>$ docker build -t my-node-app:1.0 .</TermBox>
        <p>This creates an image tagged as <code>my-node-app:1.0</code>.</p>

        <h3>Step 4: Run the Container</h3>
        <TermBox>$ docker run -p 8080:3000 my-node-app:1.0</TermBox>
        <p>
          This starts a container from your image, mapping port 8080 on your machine to port 3000
          inside the container. Visit <code>http://localhost:8080</code> and you'll see "Hello from a container!"
        </p>

        <Callout variant="info" icon="💡" title="What Just Happened?">
          <p>
            Docker created an isolated environment with Node.js 18, installed your dependencies,
            copied your code, and started your application—all without affecting anything else on
            your system. Anyone with Docker can now run <code>docker run my-node-app:1.0</code>
            and get <em>exactly</em> the same environment.
          </p>
          <p>
            This is why containers are revolutionary. No more "it works on my machine." If the
            container works, it works everywhere.
          </p>
        </Callout>
      </section>

      <section className={styles.spotlight}>
        <h2>Key Container Concepts</h2>

        <h3>Layers</h3>
        <p>
          Images are built in layers. Each instruction in a Dockerfile creates a new layer.
          Layers are cached, so rebuilding is fast if nothing changed. This is why you copy
          <code>package.json</code> before copying the rest of your code—so dependency installation
          is cached.
        </p>

        <h3>Tags</h3>
        <p>
          Images are identified by tags (e.g., <code>nginx:1.21</code>). <code>:latest</code> is
          a common tag, but it's dangerous in production—"latest" is a moving target. Always use
          specific version tags in production.
        </p>

        <h3>Registries</h3>
        <p>
          Container images are stored in registries. Docker Hub is the default public registry,
          but you can use private ones (AWS ECR, Google GCR, Azure ACR) for proprietary code.
        </p>

        <h3>Volumes</h3>
        <p>
          Containers are ephemeral—data inside them is lost when they're deleted. <strong>Volumes</strong>
          are how you persist data. They're directories mounted from the host or from external storage.
        </p>
      </section>

      <section className={styles.spotlight}>
        <h2>What's Next?</h2>
        <p>
          Now you understand containers. But running containers manually with <code>docker run</code>
          doesn't scale. What if you need:
        </p>
        <ul>
          <li>10 copies of your app running at once?</li>
          <li>Automatic restarts when containers crash?</li>
          <li>Load balancing between containers?</li>
          <li>Automatic scaling based on traffic?</li>
          <li>Coordinated updates without downtime?</li>
        </ul>
        <p>
          This is where <strong>Kubernetes</strong> comes in. Kubernetes is a container orchestrator—it
          manages running, scaling, and maintaining containers in production. That's what we'll explore
          in the next modules.
        </p>
      </section>
    </ModuleShell>
  );
}
