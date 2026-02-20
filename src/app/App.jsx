import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { TopBar } from "../widgets/TopBar/TopBar";
import { CartPage } from "../pages/CartPage";
import { CatalogPage } from "../pages/CatalogPage";
import { ProfilePage } from "../pages/ProfilePage";
import { BottomNav } from "../widgets/BottomNav/BottomNav";
import { ProductPage } from "../pages/ProductPage";
import AdminPanel from "../pages/AdminPanel";
import { AdminCatalog } from "../pages/AdminPanel/ui/AdminCatalog";
import { AdminOrders } from "../pages/AdminPanel/ui/AdminOrders";
import { AdminCustomers } from "../pages/AdminPanel/ui/AdminCustomers";
import { WebAppWarning } from "../shared/ui/WebAppWarning/WebAppWarning";

import styles from "./App.module.css";

function App() {
    return (
        <BrowserRouter>
            <div className={styles.app}>
                <TopBar />
                <main className={styles.scroll}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/catalog" />} />
                        <Route path="/product/:id" element={<ProductPage />} />
                        <Route path="/catalog/*" element={<CatalogPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/profile" element={<ProfilePage />} />

                        <Route
                            path="/admin/*"
                            element={<AdminPanel />}
                        >
                            <Route
                                index
                                element={<Navigate to="catalog" replace />}
                            />
                            <Route path="orders" element={<AdminOrders />} />
                            <Route path="catalog" element={<AdminCatalog />} />
                            <Route path="customers" element={<AdminCustomers />} />
                        </Route>
                    </Routes>
                </main>

                <BottomNav />
                <WebAppWarning />
            </div>
        </BrowserRouter>
    );
}

export default App;
