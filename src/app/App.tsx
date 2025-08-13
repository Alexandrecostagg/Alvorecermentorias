import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from '@/components/AppLayout'
import Home from '@/pages/Home'
import Courses from '@/pages/Courses'
import Kids from '@/pages/Kids'

function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center p-8 text-center">
      <div>
        <h1 className="text-3xl font-bold">404</h1>
        <p className="text-slate-600 mt-2">Página não encontrada.</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/kids" element={<Kids />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
