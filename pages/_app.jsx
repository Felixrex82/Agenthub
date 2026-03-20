// ============================================================
// pages/_app.jsx
// ============================================================
import '../styles/globals.css'
import Layout from '../components/Layout'
import { useWallet } from '../hooks/useWallet'

export default function App({ Component, pageProps }) {
  const wallet = useWallet()

  return (
    <Layout wallet={wallet}>
      <Component {...pageProps} wallet={wallet} />
    </Layout>
  )
}
