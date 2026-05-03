import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../utils/toastContext";
import useAuthStore from "../stores/authStore";
import Button from "../components/Button";
import styles from "./Dashboard.module.css";

const Groups = () => {
  const navigate = useNavigate();
  const { error: showError } = useToast();
  const { user } = useAuthStore();

  const [groups, setGroups] = useState([]);
  const [balances, setBalances] = useState({});
  const [groupExpenseTotals, setGroupExpenseTotals] = useState({});
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

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
        fetchGroupExpenseTotals(groupList),
      ]);
    } catch (err) {
      showError("Failed to load groups");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalances = async (groupList) => {
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

    setBalances(Object.fromEntries(balanceResponses));
  };

  const fetchGroupExpenseTotals = async (groupList) => {
    const expenseResponses = await Promise.all(
      groupList.map((group) => api.get(`/expense/group/${group._id}`)),
    );

    const totalsByGroup = {};
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
    });

    setGroupExpenseTotals(totalsByGroup);
  };

  const filteredGroups = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();
    const base = trimmedQuery
      ? groups.filter((group) =>
          group.name?.toLowerCase().includes(trimmedQuery),
        )
      : groups;

    return [...base].sort(
      (a, b) =>
        (groupExpenseTotals[b._id] || 0) - (groupExpenseTotals[a._id] || 0),
    );
  }, [groups, groupExpenseTotals, query]);

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
          <h1 className={styles.title}>Groups</h1>
          <p className={styles.subtitle}>
            Browse all your groups and open any group to manage expenses.
          </p>
        </div>

        <div className={styles.groupsToolbar}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search groups by name"
              className={styles.searchInput}
              aria-label="Search groups"
            />
          </div>
          <div className={styles.toolbarMeta}>
            <span className={styles.resultChip}>
              {filteredGroups.length} group
              {filteredGroups.length !== 1 ? "s" : ""}
            </span>
          </div>
          <Button onClick={handleCreateGroup}>+ Create Group</Button>
        </div>

        {filteredGroups.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👥</div>
            <h3 className={styles.emptyTitle}>
              {groups.length === 0 ? "No groups yet" : "No matching groups"}
            </h3>
            <p className={styles.emptyText}>
              {groups.length === 0
                ? "Create your first group to start splitting expenses."
                : "Try a different search term."}
            </p>
            {groups.length === 0 && (
              <Button onClick={handleCreateGroup}>
                Create Your First Group
              </Button>
            )}
          </div>
        ) : (
          <div className={styles.groupsGrid}>
            {filteredGroups.map((group) => (
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
                  <span className={styles.balanceLabel}>Your Net Balance</span>
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
  );
};

export default Groups;
