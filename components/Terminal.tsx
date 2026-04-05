// components/Terminal.tsx
import React, { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'

const Terminal = () => {
  const [text, setText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  
  const commands = [
    { type: 'prompt', text: '$ ' },
    { type: 'command', text: 'kubectl get pods -n production' },
    { type: 'output', text: '\nNAME                          READY   STATUS    RESTARTS   AGE' },
    { type: 'output', text: '\nkube-learn-7d4f8b6c9d-xk2m    1/1     Running   0          2d' },
    { type: 'output', text: '\nkube-learn-7d4f8b6c9d-p9n3    1/1     Running   0          2d' },
    { type: 'prompt', text: '\n$ ' },
  ]

  const fullText = commands.map(c => c.text).join('')

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setText(fullText.slice(0, index))
      index++
      if (index > fullText.length) {
        clearInterval(interval)
      }
    }, 35)
    return () => clearInterval(interval)
  }, [fullText])

  return (
    <div className={styles.terminalWindow}>
      <div className={styles.terminalHeader}>
        <div className={styles.terminalDots}>
          <span className={styles.redDot}></span>
          <span className={styles.yellowDot}></span>
          <span className={styles.greenDot}></span>
        </div>
        <span className={styles.terminalTitle}>kubectl — production</span>
        <div style={{ width: 52 }}></div>
      </div>
      <pre className={styles.terminalBody}>
        {text}
        <span className={styles.cursor}>█</span>
      </pre>
    </div>
  )
}

export default Terminal