import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../utils/toastContext";
import useAuthStore from "../stores/authStore";
import Button from "../components/Button";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { error: showError } = useToast();
  const { user } = useAuthStore();
  const [groups, setGroups] = useState([]);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalOwed, setTotalOwed] = useState(0);
  const [totalYouOwe, setTotalYouOwe] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [groupExpenseTotals, setGroupExpenseTotals] = useState({});

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await api.get("/group/my-groups");
      const groupList = response.data.groups || [];
      setGroups(groupList);
      await Promise.all([
        fetchBalances(groupList),
        fetchTotalExpenses(groupList),
      ]);
    } catch (err) {
      showError("Failed to load groups");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalances = async (groupList) => {
    try {
      const currentUserId = user?.id;
      const balanceResponses = await Promise.all(
        groupList.map(async (group) => {
          const res = await api.get(`/balance/${group._id}`);
          const userNet = currentUserId
            ? res.data?.balances?.[currentUserId]?.net || 0
            : 0;
          return [group._id, userNet];
        }),
      );
      const balanceData = Object.fromEntries(balanceResponses);
      setBalances(balanceData);

      // Calculate totals
      let owed = 0;
      let youOwe = 0;

      Object.values(balanceData).forEach((balance) => {
        if (balance > 0) {
          owed += balance;
        } else {
          youOwe += Math.abs(balance);
        }
      });

      setTotalOwed(owed);
      setTotalYouOwe(youOwe);
    } catch (err) {
      console.error("Failed to load balances:", err);
    }
  };

  const fetchTotalExpenses = async (groupList) => {
    try {
      const expenseResponses = await Promise.all(
        groupList.map((group) => api.get(`/expense/group/${group._id}`)),
      );

      const totalsByGroup = {};
      let total = 0;

      expenseResponses.forEach((response, index) => {
        const groupId = groupList[index]?._id;
        const expenses = response.data?.expenses || [];
        const groupTotal = expenses.reduce(
          (groupSum, expense) => groupSum + (Number(expense.amount) || 0),
          0,
        );
        if (groupId) {
          totalsByGroup[groupId] = groupTotal;
        }
        total += groupTotal;
      });

      setGroupExpenseTotals(totalsByGroup);
      setTotalExpenses(total);
    } catch (err) {
      console.error("Failed to load total expenses:", err);
    }
  };

  const handleGroupClick = (groupId) => {
    navigate(`/group/${groupId}`);
  };

  const handleCreateGroup = () => {
    navigate("/create-group");
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

  return (
    <div className={styles.container}>
      <div className={styles.maxWidth}>
        <div className={styles.header}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Manage your expenses and group balances
          </p>
        </div>

        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Total Expenses Logged</div>
            <div className={styles.summaryValue}>
              ₹{totalExpenses.toFixed(2)}
            </div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Total People Owe You</div>
            <div
              className={styles.summaryValue}
              style={{ color: "var(--color-success-light)" }}
            >
              ₹{totalOwed.toFixed(2)}
            </div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Total You Owe</div>
            <div
              className={styles.summaryValue}
              style={{ color: "var(--color-error-light)" }}
            >
              ₹{totalYouOwe.toFixed(2)}
            </div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Net Balance</div>
            <div
              className={styles.summaryValue}
              style={{
                color:
                  totalOwed - totalYouOwe >= 0
                    ? "var(--color-success-light)"
                    : "var(--color-error-light)",
              }}
            >
              ₹{(totalOwed - totalYouOwe).toFixed(2)}
            </div>
          </div>
        </div>

        <div>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Your Groups</h2>
            <Button onClick={handleCreateGroup}>+ Create Group</Button>
          </div>

          {groups.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>👥</div>
              <h3 className={styles.emptyTitle}>No groups yet</h3>
              <p className={styles.emptyText}>
                Create your first group or ask friends to add you to theirs
              </p>
              <Button onClick={handleCreateGroup}>
                Create Your First Group
              </Button>
            </div>
          ) : (
            <div className={styles.groupsGrid}>
              {groups.map((group) => (
                <div
                  key={group._id}
                  className={styles.groupCard}
                  onClick={() => handleGroupClick(group._id)}
                >
                  <div className={styles.groupName}>{group.name}</div>
                  <div className={styles.groupMembers}>
                    {group.members?.length} member
                    {group.members?.length !== 1 ? "s" : ""}
                  </div>
                  <div className={styles.groupBalance}>
                    <span className={styles.balanceLabel}>Group Expenses</span>
                    <span className={styles.balanceAmount}>
                      ₹{(groupExpenseTotals[group._id] || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className={styles.groupBalance}>
                    <span className={styles.balanceLabel}>
                      Your Net Balance
                    </span>
                    <span
                      className={`${styles.balanceAmount} ${
                        (balances[group._id] || 0) >= 0
                          ? styles.balancePositive
                          : styles.balanceNegative
                      }`}
                    >
                      ₹{(balances[group._id] || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
