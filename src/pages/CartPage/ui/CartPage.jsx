import { useEffect, useMemo, useState } from "react";

import { CartList } from "../../../features/cart/ui/CartList";
import { useCartStore } from "../../../features/cart/model/useCartStore";
import { CartEmpty } from "./CartEmpty";
import { useTelegramStore } from "../../../entities/telegram/model/useTelegramStore";
import { useUserStore } from "../../../entities/user/model/useUserStore";
import { useToastStore } from "../../../shared/model/useToasterStore";
import { apiOrders } from "../../../shared/api";
import { Toaster } from "../../../shared/ui/Toaster/Toaster";

import styles from "./CartPage.module.css";

export const CartPage = () => {
    const [isOrdering, setIsOrdering] = useState(false);
    const sum = useCartStore((state) => state.getTotalPrice());
    const current = useCartStore((state) => state.getTotalCount());

    const discount = current > 0 ? 70 : 0;
    const finalPrice = useMemo(
        () => Math.max(sum - discount, 0),
        [sum, discount]
    );
    const payableAmount = sum;

    const tgId = useTelegramStore((state) => state.tgId);
    const { data: user, loadUser } = useUserStore((state) => ({
        data: state.data,
        loadUser: state.loadUser,
    }));
    const closeTelegramApp = useTelegramStore((state) => state.closeApp);
    const { showToast } = useToastStore();

    useEffect(() => {
        if (tgId) {
            loadUser(tgId);
        }
    }, [tgId, loadUser]);

    const handleCheckout = async () => {
        if (!tgId) {
            showToast("Не удалось определить пользователя Telegram.");
            return;
        }
        if (current === 0) {
            showToast("Корзина пуста.");
            return;
        }

        const balance = Number(user?.balance ?? 0);
        if (!Number.isFinite(balance)) {
            showToast("Не удалось получить баланс пользователя.");
            return;
        }

        if (balance < payableAmount) {
            showToast("Недостаточно средств на балансе.");
            return;
        }

        try {
            setIsOrdering(true);
            await apiOrders.create(tgId);
            showToast("Заказ успешно оформлен!");
            closeTelegramApp?.();
        } catch (error) {
            console.error("Order creation failed:", error);
            showToast("Не удалось оформить заказ. Попробуйте позже.");
        } finally {
            setIsOrdering(false);
        }
    };

    return (
        <div>
            <Toaster />
            <h2 className={styles.title}>Корзина</h2>
            <div>
                <CartList />

                {current === 0 ? (
                    <CartEmpty />
                ) : (
                    <>
                        <div className={styles.promoSection}>
                            <div className={styles.totalPrice}>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Промокод"
                                />
                            </div>
                            <div className={styles.promoDetails}>
                                <div className={styles.promoRow}>
                                    <span>{current} товаров</span>
                                    <span>{sum} ₽</span>
                                </div>
                                {discount > 0 && (
                                    <div className={styles.promoPrice}>
                                        <span>Скидка</span>
                                        <span>-{discount} ₽</span>
                                    </div>
                                )}
                                <div className={styles.priceRow}>
                                    <span>К оплате</span>
                                    <span>{finalPrice} ₽</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.checkoutBlock}>
                            <div className={styles.productCount}>
                                {current} товаров
                            </div>
                            <div className={styles.priceComparison}>
                                <span className={styles.discountedPrice}>
                                    {finalPrice} ₽
                                </span>
                            </div>
                            <button
                                className={styles.checkoutButton}
                                onClick={handleCheckout}
                                disabled={isOrdering}
                            >
                                {isOrdering
                                    ? "Оформляем..."
                                    : "К оформлению"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
