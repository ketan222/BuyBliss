const RedirectLoggedIn = ({ isLoggesIn, children }) => {
    if (isLoggesIn) {
      return <Navigate to="/" replace />;
    }
    return children;
  };
  
  export default RedirectLoggedIn;
  