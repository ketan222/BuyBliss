import { Link } from "react-router-dom";
import './Navbar.css';
import { toast } from "react-toastify";

function Navbar(props) {
  const { isLoggesIn, setIsloggesIn, handleLogout } = props;

  const logoutHandler = () => {
    setIsloggesIn(false); // Reset login state
    handleLogout(); // Perform the logout logic
    toast.warning("Logged out successfully.");
  };

  return (
    <nav className="navbar">
      <p className="heading-nav"><Link to="/">BuyBliss</Link></p>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/shop">Shop</Link></li>
        {/* <li><Link to="/about">About us</Link></li> */}
        <li><Link to="/services">Analytics</Link></li>
        {/* <li><Link to="/blog">Blog</Link></li> */}
        <li><Link to="/contact">Contact us</Link></li>
      </ul>
      <div className="btns">
        {!isLoggesIn && (
          <>
            <Link to="/login"><button className="login-btn">Log in</button></Link>
            <Link to="/signup"><button className="signup-btn">Sign up</button></Link>
          </>
        )}
        {isLoggesIn && (
          <>
            <button className="logout-btn" onClick={logoutHandler}>Log out</button>
            <Link to="/cart"><button className="cart-btn">Cart</button></Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
