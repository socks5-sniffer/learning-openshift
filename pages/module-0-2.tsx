import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Module02() {
  const [showVMDetails, setShowVMDetails] = useState(false);
  const [showContainerDetails, setShowContainerDetails] = useState(false);

  return (
    <div className={styles.container}>
      <Head>
        <title>Module 0.2: Containers 101</title>
        <meta name="description" content="Just enough Docker to understand Kubernetes" />
      </Head>

      {/* Home link in top right */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 30,
        zIndex: 10
      }}>
        <Link href="/learning-modules" legacyBehavior>
          <a style={{
            textDecoration: 'none',
            color: '#9c0606ff',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            background: 'rgba(255,255,255,0.85)',
            padding: '8px 16px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>All Modules</a>
        </Link>
      </div>

      <main className={styles.main}>
        <h1 className={styles.title}>Module 0.2: Containers 101</h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280', marginTop: '-10px' }}>
          (Just Enough Docker)
        </p>
        
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/module-0-1" legacyBehavior>
            <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              ← Previous: Why Kubernetes Exists
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/learning-modules" legacyBehavior>
            <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              All Modules
            </a>
          </Link>
          <span style={{ margin: '0 1rem', color: '#64748b' }}>|</span>
          <Link href="/module-1-1" legacyBehavior>
            <a style={{ color: '#636060ff', textDecoration: 'none', fontSize: '1.1rem' }}>
              Next: Architecture Overview →
            </a>
          </Link>
        </div>

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

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#0369a1' }}>💡 Key Insight</h3>
            <p style={{ marginBottom: 0 }}>
              Containers are <strong>not tiny virtual machines</strong>. VMs virtualize hardware and 
              run a full OS. Containers share the host OS kernel and virtualize at the OS level. 
              This makes them much lighter and faster to start.
            </p>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Interactive: Containers vs Virtual Machines</h2>
          <p>Click on each to see the differences:</p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginTop: '20px'
          }}>
            {/* Virtual Machine Card */}
            <div 
              onClick={() => setShowVMDetails(!showVMDetails)}
              style={{
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                background: showVMDetails ? '#f9fafb' : 'white',
                boxShadow: showVMDetails ? '0 4px 12px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <h3 style={{ marginTop: 0, color: '#9c0606ff' }}>🖥️ Virtual Machine</h3>
              
              <div style={{
                background: '#f3f4f6',
                padding: '16px',
                borderRadius: '8px',
                margin: '12px 0',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                color: '#1e293b'
              }}>
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

            {/* Container Card */}
            <div 
              onClick={() => setShowContainerDetails(!showContainerDetails)}
              style={{
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                background: showContainerDetails ? '#f0f9ff' : 'white',
                boxShadow: showContainerDetails ? '0 4px 12px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <h3 style={{ marginTop: 0, color: '#0ea5e9' }}>📦 Container</h3>
              
              <div style={{
                background: '#f3f4f6',
                padding: '16px',
                borderRadius: '8px',
                margin: '12px 0',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                color: '#1e293b'
              }}>
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

          <div style={{
            background: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#b45309' }}>🔑 Analogy</h3>
            <p style={{ marginBottom: 0 }}>
              <strong>Image = Class</strong> in programming<br/>
              <strong>Container = Instance</strong> of that class<br/><br/>
              You can create multiple instances (containers) from one class (image), and each instance 
              can have different runtime state.
            </p>
          </div>
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

          <div style={{
            background: '#f0fdf4',
            border: '2px solid #22c55e',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#15803d' }}>✅ Benefits of Containers</h3>
            <ul style={{ marginBottom: 0 }}>
              <li><strong>Consistency:</strong> Same environment everywhere</li>
              <li><strong>Reproducibility:</strong> Anyone can run your app instantly</li>
              <li><strong>Isolation:</strong> Dependencies don't conflict with other projects</li>
              <li><strong>Portability:</strong> Runs on any system with a container runtime</li>
            </ul>
          </div>
        </section>

        <section className={styles.spotlight}>
          <h2>Building and Running a Simple Container</h2>
          <p>Let's walk through a practical example. Here's a simple Node.js app:</p>

          <h3>Step 1: Write Your Application</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            overflowX: 'auto',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}>// app.js</div>
            <div style={{ color: '#f1f5f9' }}>const express = require('express');</div>
            <div style={{ color: '#f1f5f9' }}>const app = express();</div>
            <div style={{ color: '#f1f5f9' }}>const PORT = 3000;</div>
            <br/>
            <div style={{ color: '#f1f5f9' }}>app.get('/', (req, res) =&gt; {'{'}</div>
            <div style={{ color: '#f1f5f9' }}>&nbsp;&nbsp;res.send('Hello from a container!');</div>
            <div style={{ color: '#f1f5f9' }}>{'}'});</div>
            <br/>
            <div style={{ color: '#f1f5f9' }}>app.listen(PORT, () =&gt; {'{'}</div>
            <div style={{ color: '#f1f5f9' }}>&nbsp;&nbsp;console.log(`Server running on port ${'{'}PORT{'}'}`);</div>
            <div style={{ color: '#f1f5f9' }}>{'}'});</div>
          </div>

          <h3>Step 2: Create a Dockerfile</h3>
          <p>A Dockerfile is the recipe for building your container image.</p>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            overflowX: 'auto',
            margin: '16px 0'
          }}>
            <div style={{ color: '#64748b' }}># Start from a base image with Node.js installed</div>
            <div style={{ color: '#f1f5f9' }}>FROM node:18-alpine</div>
            <br/>
            <div style={{ color: '#64748b' }}># Set the working directory inside the container</div>
            <div style={{ color: '#f1f5f9' }}>WORKDIR /app</div>
            <br/>
            <div style={{ color: '#64748b' }}># Copy package files and install dependencies</div>
            <div style={{ color: '#f1f5f9' }}>COPY package*.json ./</div>
            <div style={{ color: '#f1f5f9' }}>RUN npm install</div>
            <br/>
            <div style={{ color: '#64748b' }}># Copy the rest of the application code</div>
            <div style={{ color: '#f1f5f9' }}>COPY . .</div>
            <br/>
            <div style={{ color: '#64748b' }}># Expose the port the app runs on</div>
            <div style={{ color: '#f1f5f9' }}>EXPOSE 3000</div>
            <br/>
            <div style={{ color: '#64748b' }}># Command to run when container starts</div>
            <div style={{ color: '#f1f5f9' }}>CMD ["node", "app.js"]</div>
          </div>

          <h3>Step 3: Build the Image</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '16px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            margin: '16px 0'
          }}>
            $ docker build -t my-node-app:1.0 .
          </div>
          <p>This creates an image tagged as <code>my-node-app:1.0</code>.</p>

          <h3>Step 4: Run the Container</h3>
          <div style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '16px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            margin: '16px 0'
          }}>
            $ docker run -p 8080:3000 my-node-app:1.0
          </div>
          <p>
            This starts a container from your image, mapping port 8080 on your machine to port 3000 
            inside the container. Visit <code>http://localhost:8080</code> and you'll see "Hello from a container!"
          </p>

          <div style={{
            background: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0',
            color: '#1e293b'
          }}>
            <h3 style={{ marginTop: 0, color: '#0369a1' }}>💡 What Just Happened?</h3>
            <p>
              Docker created an isolated environment with Node.js 18, installed your dependencies, 
              copied your code, and started your application—all without affecting anything else on 
              your system. Anyone with Docker can now run <code>docker run my-node-app:1.0</code> 
              and get <em>exactly</em> the same environment.
            </p>
            <p style={{ marginBottom: 0 }}>
              This is why containers are revolutionary. No more "it works on my machine." If the 
              container works, it works everywhere.
            </p>
          </div>
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

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginTop: '60px',
          paddingTop: '30px',
          borderTop: '2px solid #e5e7eb',
          gap: '20px'
        }}>
          <Link href="/module-0-1" legacyBehavior>
            <a style={{
              textDecoration: 'none',
              color: '#4b5563',
              fontWeight: 600,
              padding: '12px 24px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>← Previous: Why Kubernetes Exists</a>
          </Link>
          
          <Link href="/learning-modules" legacyBehavior>
            <a style={{
              textDecoration: 'none',
              color: '#fff',
              background: '#9c0606ff',
              fontWeight: 600,
              padding: '12px 24px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              display: 'inline-block'
            }}>Back to All Modules</a>
          </Link>
        </div>
      </main>
    </div>
  );
}
