import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'



export const AppLayout: React.FC = () => {

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Outlet />
    </div>
  )
}

