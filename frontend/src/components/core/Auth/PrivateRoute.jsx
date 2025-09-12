// This will prevent non-authenticated users from accessing this route
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

function PrivateRoute({ children }) {
  const { token } = useSelector((state) => state.auth)

  if (token) {
    return children
  } else {
    return <Navigate to="/login" replace/>
  }
}

export default PrivateRoute