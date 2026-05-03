import React, { useState } from "react";
import api from "../services/api";
import { useToast } from "../utils/toastContext";
import FormField from "./FormField";
import Button from "./Button";
import styles from "./AddExpenseModal.module.css";

const AddExpenseModal = ({ groupId, group, onClose, onExpenseAdded }) => {
  const { error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [splitType, setSplitType] = useState("equal");
  const memberOptions = (group?.members || []).map((member, index) => {
    const memberId = member?.user?._id || member?.user || member?._id;
    const memberName =
      member?.user?.name || member?.name || `Member ${index + 1}`;
    return { value: memberId, label: memberName, memberId, memberName };
  });

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    paidBy: memberOptions[0]?.value || "",
  });

  const [splits, setSplits] = useState(
    memberOptions.map((member) => ({
      member: member.memberId,
      name: member.memberName,
      amount: 0,
    })),
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-calculate equal split when amount changes
    if (name === "amount" && splitType === "equal") {
      const numAmount = parseFloat(value) || 0;
      const perPerson = numAmount / splits.length;
      setSplits(
        splits.map((s) => ({
          ...s,
          amount: parseFloat(perPerson.toFixed(2)),
        })),
      );
    }
  };

  const handleSplitTypeChange = (type) => {
    setSplitType(type);
    if (type === "equal") {
      const numAmount = parseFloat(formData.amount) || 0;
      const perPerson = numAmount / splits.length;
      setSplits(
        splits.map((s) => ({
          ...s,
          amount: parseFloat(perPerson.toFixed(2)),
        })),
      );
    }
  };

  const handleSplitChange = (index, amount) => {
    const newSplits = [...splits];
    newSplits[index].amount = amount === "" ? 0 : parseFloat(amount) || 0;
    setSplits(newSplits);
  };

  const validateForm = () => {
    if (!formData.description) return "Description is required";
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      return "Amount must be greater than 0";

    const totalSplit = splits.reduce((sum, s) => sum + (s.amount || 0), 0);
    const roundedTotal = Math.round(totalSplit * 100) / 100;
    const roundedAmount = Math.round(parseFloat(formData.amount) * 100) / 100;

    if (roundedTotal !== roundedAmount) {
      return `Split total (₹${roundedTotal.toFixed(2)}) doesn't match amount (₹${roundedAmount.toFixed(2)})`;
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      showError(error);
      return;
    }

    try {
      setLoading(true);
      await api.post("/expense/add", {
        description: formData.description,
        amount: parseFloat(formData.amount),
        paidBy: formData.paidBy,
        groupId,
        splits: splits
          .filter((s) => s.amount > 0)
          .map((s) => ({
            user: s.member,
            amount: s.amount,
          })),
      });

      onExpenseAdded();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Add Expense</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <FormField
            label="Description"
            name="description"
            type="text"
            value={formData.description}
            onChange={handleFormChange}
            placeholder="e.g., Dinner, Movie tickets"
            required
          />

          <FormField
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleFormChange}
            placeholder="0.00"
            step="0.01"
            required
          />

          <FormField
            label="Paid By"
            name="paidBy"
            type="select"
            value={formData.paidBy}
            onChange={handleFormChange}
            options={memberOptions.map((m) => ({
              value: m.value,
              label: m.label,
            }))}
            required
          />

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "var(--spacing-sm)",
                fontWeight: "var(--font-weight-semibold)",
              }}
            >
              Split Type
            </label>
            <div className={styles.splitTypeSelector}>
              <button
                type="button"
                className={`${styles.splitTypeOption} ${splitType === "equal" ? styles.active : ""}`}
                onClick={() => handleSplitTypeChange("equal")}
              >
                Split Equally
              </button>
              <button
                type="button"
                className={`${styles.splitTypeOption} ${splitType === "custom" ? styles.active : ""}`}
                onClick={() => handleSplitTypeChange("custom")}
              >
                Custom Split
              </button>
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "var(--spacing-sm)",
                fontWeight: "var(--font-weight-semibold)",
              }}
            >
              Split Among Members
            </label>
            <div className={styles.splitList}>
              {splits.map((split, index) => (
                <div key={split.member} className={styles.splitItem}>
                  <span className={styles.splitMemberName}>{split.name}</span>
                  <input
                    type="number"
                    className={styles.splitAmountInput}
                    value={split.amount || ""}
                    onChange={(e) => handleSplitChange(index, e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    disabled={splitType === "equal"}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formActions}>
            <Button
              className={styles.cancelButton}
              variant="secondary"
              type="button"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className={styles.submitButton}
              type="submit"
              loading={loading}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Expense"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
