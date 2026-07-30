import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminProvider, useAdmin } from './context/AdminContext'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Merchants from './pages/Merchants'
import Users from './pages/Users'
import Ledger from './pages/Ledger'
import Approvals from './pages/Approvals'
import BcvRates from './pages/BcvRates'
import SystemHealth from './pages/SystemHealth'
import Tickets from './pages/Tickets'
import Settings from './pages/Settings'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdmin()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <AuthGuard>
                <Layout />
              </AuthGuard>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="merchants" element={<Merchants />} />
            <Route path="users" element={<Users />} />
            <Route path="ledger" element={<Ledger />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="bcv" element={<BcvRates />} />
            <Route path="health" element={<SystemHealth />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  )
}
