import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../utils/toastContext";
import Button from "../components/Button";
import FormField from "../components/FormField";
import styles from "./Auth.module.css";

const CreateGroup = () => {
  const navigate = useNavigate();
  const { error: showError, success: showSuccess } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = "Group name is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/group/create", { name: formData.name });
      showSuccess("Group created successfully!");
      navigate(`/group/${response.data.group._id}`);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create New Group</h1>
          <p className={styles.subtitle}>Start a new expense group</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <FormField
            label="Group Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Trip to Goa, Roommates"
            error={errors.name}
            required
          />

          <Button
            className={styles.submitButton}
            type="submit"
            size="large"
            loading={loading}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Group"}
          </Button>
        </form>

        <div className={styles.footer}>
          <Button variant="secondary" onClick={() => navigate("/")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
