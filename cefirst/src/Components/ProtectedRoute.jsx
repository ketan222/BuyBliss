import { Navigate } from "react-router-dom";

function ProtectedRoute({ isLoggesIn, children }) {
    return isLoggesIn ? children : <Navigate to="/login" replace />;
}
  

export default ProtectedRoute;
