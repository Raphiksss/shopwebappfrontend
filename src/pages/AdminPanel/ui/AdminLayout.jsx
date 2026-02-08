import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { Button } from "../../../shared/assets/Button/Button";
import { useAuthStore } from "../../../features/auth/model/useAuthStore";

import styles from "./AdminLayout.module.css";

export const AdminLayout = ({ userStaff }) => {
    const navigate = useNavigate();
    const logout = useAuthStore((s) => s.logout);

    const handleLogout = () => {
        logout();
        navigate("/catalog");
    };

    return (
        <div className={styles.layout}>
            <div className={styles.panel}>
                <h3 className={styles.brand}>Admin Panel</h3>
                <div className={styles.userStaff}>{userStaff}</div>
            </div>
            <nav className={styles.nav}>
                <NavLink
                    to="catalog"
                    className={({ isActive }) =>
                        isActive ? styles.active : styles.link
                    }
                >
                    Каталог товаров
                </NavLink>
                <NavLink
                    to="orders"
                    className={({ isActive }) =>
                        isActive ? styles.active : styles.link
                    }
                >
                    Заказы
                </NavLink>
                <NavLink
                    to="customers"
                    className={({ isActive }) =>
                        isActive ? styles.active : styles.link
                    }
                >
                    Пользователи
                </NavLink>
            </nav>

            <main className={styles.outlet}>
                <Outlet />
            </main>
            <div className={styles.user}>
                <Button onClick={handleLogout} size="small">
                    Выйти
                </Button>
            </div>
        </div>
    );
};
