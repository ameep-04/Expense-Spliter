import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../utils/toastContext";
import Button from "../components/Button";
import AddExpenseModal from "../components/AddExpenseModal";
import styles from "./GroupDetail.module.css";

const GroupDetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { error: showError, success: showSuccess } = useToast();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("expenses");
  const [showAddExpense, setShowAddExpense] = useState(false);

  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  const fetchGroupData = async () => {
    try {
      setLoading(true);
      const [groupRes, expensesRes, balancesRes] = await Promise.all([
        api.get(`/group/${groupId}`),
        api.get(`/expense/group/${groupId}`),
        api.get(`/balance/${groupId}`),
      ]);

      setGroup(groupRes.data.group || null);
      setExpenses(expensesRes.data.expenses || []);
      setBalances(balancesRes.data.balances || {});
    } catch (err) {
      showError("Failed to load group data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseAdded = async () => {
    await fetchGroupData();
    setShowAddExpense(false);
    showSuccess("Expense added successfully!");
  };

  const handleNavigateToDashboard = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className={styles.container}>
        <div className={styles.maxWidth}>
          <div className={styles.emptyState}>
            <div className={styles.emptyTitle}>Group not found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.maxWidth}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.breadcrumb}>
              <span
                onClick={handleNavigateToDashboard}
                className={styles.breadcrumbLink}
              >
                Dashboard
              </span>
              <span>/</span>
              <span>{group.name}</span>
            </div>
            <h1 className={styles.title}>{group.name}</h1>
            <p className={styles.memberCount}>
              {group.members?.length} member
              {group.members?.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button onClick={() => setShowAddExpense(true)}>+ Add Expense</Button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "expenses" ? styles.active : ""}`}
            onClick={() => setActiveTab("expenses")}
          >
            Expenses
          </button>
          <button
            className={`${styles.tab} ${activeTab === "balances" ? styles.active : ""}`}
            onClick={() => setActiveTab("balances")}
          >
            Balances
          </button>
        </div>

        {activeTab === "expenses" && (
          <div>
            {expenses.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📝</div>
                <h3 className={styles.emptyTitle}>No expenses yet</h3>
                <p className={styles.emptyText}>
                  Start adding expenses to track spending
                </p>
                <Button onClick={() => setShowAddExpense(true)}>
                  Add Expense
                </Button>
              </div>
            ) : (
              <div className={styles.expenseList}>
                {expenses.map((expense) => (
                  <div key={expense._id} className={styles.expenseItem}>
                    <div className={styles.expenseInfo}>
                      <div className={styles.expenseName}>
                        {expense.description}
                      </div>
                      <div className={styles.expensePaidBy}>
                        Paid by{" "}
                        {expense.paidBy?.name || expense.paidBy || "Unknown"}
                      </div>
                    </div>
                    <div className={styles.expenseAmount}>
                      <div className={styles.expenseAmountLabel}>
                        Total Amount
                      </div>
                      <div className={styles.expenseAmountValue}>
                        ₹{expense.amount?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "balances" && (
          <div className={styles.balanceGrid}>
            <div className={styles.balanceCard}>
              <div className={styles.balanceCardTitle}>Who Owes You</div>
              <div className={styles.balanceCardContent}>
                {Object.entries(balances).filter(
                  ([_, balance]) => (balance?.net || 0) > 0,
                ).length === 0 ? (
                  <p
                    className={styles.balanceAmount}
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    No one owes you
                  </p>
                ) : (
                  Object.entries(balances)
                    .filter(([_, balance]) => (balance?.net || 0) > 0)
                    .map(([userId, balance]) => (
                      <div key={userId} className={styles.balanceRow}>
                        <span className={styles.balanceName}>
                          {balance?.name || userId}
                        </span>
                        <span
                          className={`${styles.balanceAmount} ${styles.balancePositive}`}
                        >
                          ₹{(balance?.net || 0).toFixed(2)}
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>

            <div className={styles.balanceCard}>
              <div className={styles.balanceCardTitle}>You Owe</div>
              <div className={styles.balanceCardContent}>
                {Object.entries(balances).filter(
                  ([_, balance]) => (balance?.net || 0) < 0,
                ).length === 0 ? (
                  <p
                    className={styles.balanceAmount}
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    You don't owe anyone
                  </p>
                ) : (
                  Object.entries(balances)
                    .filter(([_, balance]) => (balance?.net || 0) < 0)
                    .map(([userId, balance]) => (
                      <div key={userId} className={styles.balanceRow}>
                        <span className={styles.balanceName}>
                          {balance?.name || userId}
                        </span>
                        <span
                          className={`${styles.balanceAmount} ${styles.balanceNegative}`}
                        >
                          ₹{Math.abs(balance?.net || 0).toFixed(2)}
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {showAddExpense && (
        <AddExpenseModal
          groupId={groupId}
          group={group}
          onClose={() => setShowAddExpense(false)}
          onExpenseAdded={handleExpenseAdded}
        />
      )}
    </div>
  );
};

export default GroupDetail;
