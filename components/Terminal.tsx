// components/Terminal.tsx
import React, { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'

const Terminal = () => {
  const [text, setText] = useState('')
  const fullText = "> oc login -u lcn-dev\n> ​Login successful.\n> "

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setText(fullText.slice(0, index))
      index++
      if (index > fullText.length) clearInterval(interval)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.terminalWindow}>
      <div className={styles.terminalHeader}>
        <span className={styles.redDot}></span>
        <span className={styles.yellowDot}></span>
        <span className={styles.greenDot}></span>
      </div>
      <pre className={styles.terminalBody}>{text}<span className={styles.cursor}>_</span></pre>
    </div>
  )
}

// 🚨 THIS IS THE LINE THAT WAS LIKELY MISSING OR BROKEN
export default Terminal