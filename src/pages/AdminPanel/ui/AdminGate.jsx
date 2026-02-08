import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../../../features/auth/model/useAuthStore";
import { AdminLayout } from "./AdminLayout";
import { AdminLogin } from "./AdminLogin";

export const AdminGate = () => {
    const user = useAuthStore((s) => s.user);
    const loading = useAuthStore((s) => s.loading);
    const checkSession = useAuthStore((s) => s.checkSession);

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    if (loading && !user) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 120px)", color: "var(--muted)" }}>
                Загрузка...
            </div>
        );
    }

    if (!user) {
        return <AdminLogin />;
    }

    return <AdminLayout userStaff={user.role || "admin"} />;
};
