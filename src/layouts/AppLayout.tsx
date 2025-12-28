import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-alvorecer-cream/30">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
