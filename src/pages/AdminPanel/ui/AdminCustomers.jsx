import { useState, useEffect, useCallback } from "react";
import { apiUsers } from "../../../shared/api";
import { PencilIcon } from "./PencilIcon";
import styles from "./AdminCustomers.module.css";

const UserCard = ({ user, onBalanceChanged }) => {
    const [editing, setEditing] = useState(false);
    const [balance, setBalance] = useState("");
    const [saving, setSaving] = useState(false);

    const handleEdit = () => {
        setBalance(String(user.balance ?? 0));
        setEditing(true);
    };

    const handleCancel = () => {
        setEditing(false);
        setBalance("");
    };

    const handleSave = async () => {
        const num = Number(balance);
        if (isNaN(num)) return;
        setSaving(true);
        try {
            await apiUsers.update(user.id, { balance: num });
            onBalanceChanged();
            setEditing(false);
        } catch {
            // ignore
        } finally {
            setSaving(false);
        }
    };

    const handleKey = (e) => {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") handleCancel();
    };

    return (
        <div className={styles.card}>
            <div className={styles.info}>
                <span className={styles.userId}>#{user.id}</span>
                <span className={styles.username}>
                    {user.username || user.name || `tg:${user.tg_id}`}
                </span>
            </div>

            <div className={styles.balanceRow}>
                {editing ? (
                    <div className={styles.editRow}>
                        <input
                            type="number"
                            className={styles.balanceInput}
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            onKeyDown={handleKey}
                            autoFocus
                        />
                        <button
                            className={styles.saveBtn}
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? (
                                <span className={styles.spin}>&#9881;</span>
                            ) : (
                                "✓"
                            )}
                        </button>
                        <button
                            className={styles.cancelBtn}
                            onClick={handleCancel}
                            disabled={saving}
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <div className={styles.balanceDisplay}>
                        <span className={styles.balanceLabel}>Баланс:</span>
                        <span className={styles.balanceValue}>{user.balance ?? 0} ₽</span>
                        <button className={styles.editBtn} onClick={handleEdit}>
                            <PencilIcon size={14} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export const AdminCustomers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiUsers.list();
            setUsers(Array.isArray(data) ? data : []);
        } catch {
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    return (
        <div>
            {loading && <div className={styles.muted}>Загрузка...</div>}

            {!loading && users.length === 0 && (
                <div className={styles.muted}>Пользователей нет</div>
            )}

            <div className={styles.list}>
                {users.map((user) => (
                    <UserCard
                        key={user.id}
                        user={user}
                        onBalanceChanged={loadUsers}
                    />
                ))}
            </div>
        </div>
    );
};
