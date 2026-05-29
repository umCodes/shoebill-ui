import './App.css'
import { useContext } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Logo from "../public/logo.png"
import AuthModal from './components/AuthModal';
import { AuthContext } from './contexts/AuthContext';
import { FiLogOut, FiMoon, FiSun, FiUser, FiUserPlus, FiZap } from 'react-icons/fi';
import { useConfirm } from './contexts/ConfirmContext';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const { user, isOpen, setIsOpen, logOutUser } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const { confirm } = useConfirm();
  const location = useLocation();


  const isActive = (path: string) =>
    location.pathname === path ? "active" : "";

  return (
    <section id="center">
      <header className="header">
        <div className="badge">
          <div className="logo-wrapper">
            <img src={Logo} alt="Shoebill AI logo" className="logo" />
          </div>
          Shoebill AI
        </div>

        <nav className="header-nav">
          {/* ── Theme toggle ── */}
          <div className="header-item">
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <FiSun size={17} /> : <FiMoon size={17} />}
            </button>
          </div>
          {user ? (
            <>
              <div className="header-item">
                <span className="header-value"><FiZap size={14} color="#a777e3" /> {user.credits}</span>
                {/* <span className="header-label">Credits</span> */}
              </div>
              <div className="header-item">
                <span className="header-value"><FiUser size={14} /> {user.name}</span>
                {/* <span className="header-label">Username</span> */}
              </div>
              <div className="header-item">
                
              <button className="logout-btn" onClick={async () => {
                if (await confirm({
                  title: "Confirm Logout",
                  description: "Are you sure you want to log out?",
                  confirmLabel: "Yes, Log Out",
                  variant: "danger",
                })) logOutUser()
                }} title="Logout">
                <FiLogOut size={18} />
              </button>
              </div>
            </>
          ) : (
            <div className="header-item">
              <button className="auth-btn" onClick={() => setIsOpen(true)}>
                 <FiUserPlus size={15} /> Sign Up / Sign In</button>
            </div>
          )}

        </nav>
      </header>

      <nav className="nav">
        <Link className={`link ${isActive("/")}`} to="">Generate Quiz</Link>
        <Link className={`link ${isActive("/history")}`} to="history">History</Link>
      </nav>

      <div className="wrap">
        <Outlet />
      </div>

      {!user && (<AuthModal isOpen={isOpen}  onClose={() => setIsOpen(false)}/>)}
    </section>
  );
}

export default App;