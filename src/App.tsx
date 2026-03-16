import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ToastContainer } from 'react-toastify'
import { useTheme } from './hooks/useTheme'


import { AuthProvider } from './context/AuthContext'

function App() {
  const { appliedTheme } = useTheme()
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer theme={appliedTheme} />
    </AuthProvider>
  )
}


export default App
