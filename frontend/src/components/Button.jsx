import React from "react";
import styles from "./Button.module.css";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  loading = false,
  className = "",
  ...props
}) => {
  const sizeClass = {
    small: styles.small,
    medium: "",
    large: styles.large,
  }[size];

  const variantClass = styles[variant] || styles.primary;

  return (
    <button
      className={`${styles.button} ${variantClass} ${sizeClass} ${
        fullWidth ? styles.fullWidth : ""
      } ${loading ? styles.loading : ""} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
