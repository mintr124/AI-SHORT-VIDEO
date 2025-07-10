import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  return (
    <>
      <nav className="navbar">
        <div>MINAI</div>
      </nav>
    </>
  );
}

export default Navbar;
