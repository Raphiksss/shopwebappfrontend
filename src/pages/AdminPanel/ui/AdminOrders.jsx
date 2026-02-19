import { useState, useEffect, useCallback } from "react";
import { apiOrders, apiUsers, apiProducts } from "../../../shared/api";
import styles from "./AdminOrders.module.css";

const STATUSES = [
    { value: "", label: "Все" },
    { value: "pending", label: "Pending" },
    { value: "done", label: "Done" },
    { value: "declined", label: "Declined" },
];

const STATUS_CLASSES = {
    pending: "statusPending",
    done: "statusDone",
    declined: "statusDeclined",
};

const OrderItem = ({ order, onStatusChange }) => {
    const [userName, setUserName] = useState(null);
    const [productNames, setProductNames] = useState({});
    const [changingTo, setChangingTo] = useState(null);

    useEffect(() => {
        if (order.user) {
            apiUsers
                .getByTgId(order.user)
                .then((u) => setUserName(u?.name || u?.username || `#${order.user}`))
                .catch(() => setUserName(`#${order.user}`));
        }
    }, [order.user]);

    useEffect(() => {
        if (!order.items?.length) return;
        order.items.forEach((item) => {
            if (!productNames[item.product_id]) {
                apiProducts
                    .byId(item.product_id)
                    .then((p) =>
                        setProductNames((prev) => ({
                            ...prev,
                            [item.product_id]: p?.title || `#${item.product_id}`,
                        }))
                    )
                    .catch(() =>
                        setProductNames((prev) => ({
                            ...prev,
                            [item.product_id]: `#${item.product_id}`,
                        }))
                    );
            }
        });
    }, [order.items]);

    const handleStatus = async (newStatus) => {
        setChangingTo(newStatus);
        try {
            await apiOrders.updateStatus(order.id, newStatus);
            onStatusChange();
        } catch {
            // ignore
        } finally {
            setChangingTo(null);
        }
    };

    return (
        <div className={styles.orderCard}>
            <div className={styles.orderHeader}>
                <span className={styles.orderId}>#{order.id}</span>
                <span className={`${styles.statusBadge} ${styles[STATUS_CLASSES[order.status]] || ""}`}>
                    {order.status}
                </span>
            </div>

            <div className={styles.orderInfo}>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Пользователь:</span>
                    <span>{userName ?? "..."}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Сумма:</span>
                    <span>{order.sum} ₽</span>
                </div>
            </div>

            {order.items?.length > 0 && (
                <div className={styles.itemsList}>
                    <span className={styles.infoLabel}>Товары:</span>
                    {order.items.map((item) => (
                        <span key={item.id} className={styles.itemChip}>
                            {productNames[item.product_id] || `#${item.product_id}`}
                        </span>
                    ))}
                </div>
            )}

            <div className={styles.statusActions}>
                <span className={styles.infoLabel}>Изменить статус:</span>
                <div className={styles.statusBtns}>
                    {["pending", "done", "declined"].map((s) => (
                        <button
                            key={s}
                            className={
                                order.status === s
                                    ? styles.statusBtnActive
                                    : styles.statusBtn
                            }
                            disabled={order.status === s || changingTo !== null}
                            onClick={() => handleStatus(s)}
                        >
                            {changingTo === s ? (
                                <span className={styles.spin}>&#9881;</span>
                            ) : (
                                s
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("");

    const loadOrders = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiOrders.list(filter || null);
            setOrders(Array.isArray(data) ? data : []);
        } catch {
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    return (
        <div>
            <div className={styles.filterRow}>
                {STATUSES.map((s) => (
                    <button
                        key={s.value}
                        className={
                            filter === s.value
                                ? styles.filterActive
                                : styles.filterBtn
                        }
                        onClick={() => setFilter(s.value)}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            {loading && <div className={styles.muted}>Загрузка...</div>}

            {!loading && orders.length === 0 && (
                <div className={styles.muted}>Заказов нет</div>
            )}

            <div className={styles.orderList}>
                {orders.map((order) => (
                    <OrderItem
                        key={order.id}
                        order={order}
                        onStatusChange={loadOrders}
                    />
                ))}
            </div>
        </div>
    );
};
