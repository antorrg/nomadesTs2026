import { Outlet } from 'react-router-dom'
import AdminNav from '../AdminNav'

const Admin = () => {
  return (
    <>
      <AdminNav />
      <Outlet />
    </>
  )
}

export default Admin