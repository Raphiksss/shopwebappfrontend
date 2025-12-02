import styles from "./Navigation.module.css";

import HeartIcon from "../../../shared/assets/icons/heart.svg?react";
import BoxIcon from "../../../shared/assets/icons/box.svg?react";
import CardIcon from "../../../shared/assets/icons/card.svg?react";

export const ProfileNav = ({ activeTab, setActiveTab }) => {
    return (
        <nav className={styles.profileNav}>
            <button
                className={`${styles.navItem} ${
                    activeTab === "favorites" ? styles.active : ""
                }`}
                onClick={() => {
                    console.log("SET favorites");
                    setActiveTab("favorites");
                }}
            >
                <HeartIcon className={styles.icon} />
                <span>Избранное</span>
            </button>

            <button
                className={`${styles.navItem} ${
                    activeTab === "orders" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("orders")}
            >
                <BoxIcon className={styles.icon} />
                <span>Заказы</span>
            </button>

            <button
                className={`${styles.navItem} ${
                    activeTab === "payments" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("payments")}
            >
                <CardIcon className={styles.icon} />
                <span>Баланс</span>
            </button>
        </nav>
    );
};
