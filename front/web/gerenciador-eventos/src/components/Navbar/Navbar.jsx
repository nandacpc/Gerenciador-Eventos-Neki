import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./navbar.module.css";
import { AuthContext } from "../../context/auth";

export function Navbar() {
  const { user, signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  return (
    <div className={styles.navbar}>
      <h1 className={styles.title}>Gerenciador de Eventos</h1>
      {user && (
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  );
}
