import React from "react";
import styles from "./FormField.module.css";

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder,
  helpText,
  disabled = false,
  rows = 4,
  options = [],
  className = "",
  ...props
}) => {
  const fieldClass = error ? `${styles.input} ${styles.error}` : styles.input;

  if (type === "textarea") {
    return (
      <div className={`${styles.formGroup} ${className}`}>
        {label && (
          <label className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}
        <textarea
          className={`${styles.textarea} ${error ? styles.error : ""}`}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          {...props}
        />
        {error && <p className={styles.errorMessage}>{error}</p>}
        {helpText && <p className={styles.helpText}>{helpText}</p>}
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className={`${styles.formGroup} ${className}`}>
        {label && (
          <label className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}
        <select
          className={`${styles.select} ${error ? styles.error : ""}`}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          {...props}
        >
          <option value="">Select {label?.toLowerCase()}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {helpText && <p className={styles.helpText}>{helpText}</p>}
      </div>
    );
  }

  return (
    <div className={`${styles.formGroup} ${className}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        className={fieldClass}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        {...props}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
      {helpText && <p className={styles.helpText}>{helpText}</p>}
    </div>
  );
};

export default FormField;
