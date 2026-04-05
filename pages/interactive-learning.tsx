import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function InteractiveLearning() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Interactive Learning</title>
        <meta name="description" content="Interactive learning modules and activities" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Interactive Learning</h1>
        <section className={styles.spotlight}>
          <p>Welcome to the Interactive Learning page! Here you&apos;ll find hands-on activities, simulations, and challenges to deepen your understanding of cloud-native and Kubernetes concepts. Stay tuned for more interactive content coming soon.</p>
        </section>
      </main>
    </div>
  );
}
