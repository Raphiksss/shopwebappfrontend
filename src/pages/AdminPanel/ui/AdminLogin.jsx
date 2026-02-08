import { useState } from "react";
import { useAuthStore } from "../../../features/auth/model/useAuthStore";
import { Button } from "../../../shared/assets/Button/Button";
import styles from "./AdminLogin.module.css";

export const AdminLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const login = useAuthStore((s) => s.login);
    const loading = useAuthStore((s) => s.loading);
    const error = useAuthStore((s) => s.error);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(username, password);
    };

    return (
        <div className={styles.wrapper}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={styles.title}>Admin Panel</h2>

                {error && <div className={styles.error}>{error}</div>}

                <input
                    className={styles.input}
                    type="text"
                    placeholder="Логин"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                />
                <input
                    className={styles.input}
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                />

                <Button type="submit" disabled={loading || !username || !password}>
                    {loading ? "Вход..." : "Войти"}
                </Button>
            </form>
        </div>
    );
};
