import React from "react";
import { useToast } from "../utils/toastContext";
import styles from "./Toast.module.css";

const Toast = ({ id, message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <span className={styles["toast-message"]}>{message}</span>
      <button className={styles["toast-close"]} onClick={() => onClose(id)}>
        ✕
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className={styles["toast-container"]}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};
