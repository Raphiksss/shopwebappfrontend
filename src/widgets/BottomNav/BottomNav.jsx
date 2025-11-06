import { Link, useLocation } from "react-router-dom";
import { useCartStore } from "../../features/cart/model/useCartStore";
import { motion, AnimatePresence } from "framer-motion";

import styles from "./BottomNav.module.css";

import HomeIcon from "../../shared/assets/icons/home.svg?react";
import TrashIcon from "../../shared/assets/icons/trash.svg?react";
import UserIcon from "../../shared/assets/icons/user.svg?react";

export const BottomNav = () => {
    const { pathname } = useLocation();
    const count = useCartStore((state) => state.getTotalCount());

    const isCatalogActive =
        pathname === "/catalog" || pathname.startsWith("/catalog/");

    return (
        <nav className={styles.nav}>
            <Link
                to="/catalog"
                className={isCatalogActive ? styles.active : ""}
            >
                <HomeIcon className={styles.icon} />
                <div className={styles.title}>каталог</div>
            </Link>
            <Link
                to="/cart"
                className={pathname === "/cart" ? styles.active : ""}
            >
                <TrashIcon className={styles.icon} />
                <div className={styles.title}>
                    <AnimatePresence>
                        {count > 0 && (
                            <motion.span
                                className={styles.badge}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                            >
                                {count}
                            </motion.span>
                        )}
                    </AnimatePresence>
                    корзина
                </div>
            </Link>
            <Link
                to="/profile"
                className={pathname === "/profile" ? styles.active : ""}
            >
                <UserIcon className={styles.icon} />
                <div className={styles.title}>профиль</div>
            </Link>
        </nav>
    );
};
