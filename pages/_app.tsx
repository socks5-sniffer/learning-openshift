import '../styles/globals.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '@fontsource/jetbrains-mono/600.css'
import App, { type AppContext, type AppProps } from 'next/app'
import { ThemeProvider } from '../components/ThemeContext'
import { ProgressProvider } from '../components/ProgressContext'
import CodeCopy from '../components/CodeCopy'
import ModuleRibbon from '../components/ModuleRibbon'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <Component {...pageProps} />
        <CodeCopy />
        <ModuleRibbon />
      </ProgressProvider>
    </ThemeProvider>
  )
}

// Request-specific CSP nonces must be inserted while rendering each response.
// A custom App.getInitialProps disables automatic static optimization for
// Pages Router routes without getStaticProps. Keep these pages server-rendered.
MyApp.getInitialProps = async (context: AppContext) => App.getInitialProps(context)

export default MyApp
