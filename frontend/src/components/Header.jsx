import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import Button from "./Button";
import Logo from "./Logo";
import styles from "./Header.module.css";

const Header = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link to="/" className={styles.logo}>
          <Logo size={28} />
          Expense Splitter
        </Link>

        {user && (
          <nav className={styles.nav}>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/groups"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
            >
              Groups
            </NavLink>
          </nav>
        )}

        <div className={styles.userMenu}>
          {user ? (
            <>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.userEmail}>{user.email}</span>
              </div>
              <Button variant="secondary" size="small" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" size="small">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="small">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
