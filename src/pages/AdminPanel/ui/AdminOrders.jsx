import { useState, useEffect, useCallback, useRef } from "react";
import { apiOrders } from "../../../shared/api";
import styles from "./AdminOrders.module.css";

const PAGE_SIZE = 20;

const STATUSES = [
    { value: "", label: "все" },
    { value: "pending", label: "pending" },
    { value: "done", label: "done" },
    { value: "declined", label: "declined" },
];

const STATUS_CLASSES = {
    pending: "statusPending",
    done: "statusDone",
    declined: "statusDeclined",
};

const OrderItem = ({ order, onStatusChange }) => {
    const [changingTo, setChangingTo] = useState(null);

    const user = order.user_rel;
    const userName = user?.username || user?.name || `#${user?.tg_id || "?"}`;

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
                    <span>{userName}</span>
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
                        <div key={item.id} className={styles.itemCard}>
                            {item.product_rel?.image && (
                                <img
                                    src={item.product_rel.image}
                                    alt={item.product_rel.title}
                                    className={styles.itemImg}
                                />
                            )}
                            <span className={styles.itemTitle}>
                                {item.product_rel?.title || `#${item.product_id}`}
                            </span>
                            <span className={styles.itemPrice}>
                                {item.product_rel?.price} ₽
                            </span>
                        </div>
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
    const [loadingMore, setLoadingMore] = useState(false);
    const [filter, setFilter] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const pageRef = useRef(1);

    const loadOrders = useCallback(async (pageNum = 1, append = false) => {
        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }
        try {
            const data = await apiOrders.list(filter || null, pageNum, PAGE_SIZE);
            const items = Array.isArray(data) ? data : [];
            setOrders((prev) => append ? [...prev, ...items] : items);
            setHasMore(items.length >= PAGE_SIZE);
            pageRef.current = pageNum;
            setPage(pageNum);
        } catch {
            if (!append) setOrders([]);
            setHasMore(false);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [filter]);

    useEffect(() => {
        setPage(1);
        pageRef.current = 1;
        loadOrders(1, false);
    }, [loadOrders]);

    const handleLoadMore = () => {
        const next = pageRef.current + 1;
        loadOrders(next, true);
    };

    const handleStatusChange = () => {
        loadOrders(1, false);
    };

    const handleFilterChange = (value) => {
        setFilter(value);
    };

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
                        onClick={() => handleFilterChange(s.value)}
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
                        onStatusChange={handleStatusChange}
                    />
                ))}
            </div>

            {hasMore && !loading && (
                <button
                    className={styles.loadMoreBtn}
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                >
                    {loadingMore ? (
                        <span className={styles.spin}>&#9881;</span>
                    ) : (
                        "Загрузить ещё"
                    )}
                </button>
            )}
        </div>
    );
};
