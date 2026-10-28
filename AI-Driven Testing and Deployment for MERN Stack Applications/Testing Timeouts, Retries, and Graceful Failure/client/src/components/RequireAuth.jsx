import { Navigate, useLocation } from 'react-router'

function RequireAuth({ children }) {
  const location = useLocation()
  const token = localStorage.getItem('token')

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location, message: 'Please log in to view your tasks.' }}
      />
    )
  }

  return children
}

export default RequireAuth
