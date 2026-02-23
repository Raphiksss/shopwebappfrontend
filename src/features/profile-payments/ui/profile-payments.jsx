import { useMemo, useState, useEffect } from "react";

import styles from "./profile-payments.module.css";
import { Button } from "../../../shared/assets/Button/Button";
import { useUserStore } from "../../../entities/user/model/useUserStore";
import { useTelegramStore } from "../../../entities/telegram/model/useTelegramStore";
import { apiPayments, apiSettings } from "../../../shared/api";

const formatBalance = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return "—";
    return `${new Intl.NumberFormat("ru-RU").format(num)} ₽`;
};

export const PaymentMethods = () => {
    const tgId = useTelegramStore((state) => state.tgId);
    const closeApp = useTelegramStore((state) => state.closeApp);
    const { data: user, loading } = useUserStore((state) => ({
        data: state.data,
        loading: state.loading,
    }));
    const [showPaymentPanel, setShowPaymentPanel] = useState(false);
    const [amount, setAmount] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingMethod, setProcessingMethod] = useState(null);
    const [paymentUrl, setPaymentUrl] = useState(null);
    const [enabledMethods, setEnabledMethods] = useState(null);

    useEffect(() => {
        apiSettings.getPaymentMethods()
            .then((data) => {
                if (data) setEnabledMethods(data);
            })
            .catch(() => {});
    }, []);

    const balance = useMemo(() => {
        if (loading && !user) return "Загрузка...";
        return formatBalance(user?.balance);
    }, [loading, user]);

    const handleTopUpClick = () => {
        setShowPaymentPanel(true);
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (value === "" || /^\d+$/.test(value)) {
            setAmount(value);
        }
    };

    const handlePaymentMethodClick = async (method) => {
        if (method === "telegram-stars" || method === "crypto" || method === "card") {
            if (!amount || Number(amount) <= 0) {
                alert("Пожалуйста, введите корректную сумму");
                return;
            }

            if (!tgId) {
                alert("Не удалось получить ваш Telegram ID");
                return;
            }

            setIsProcessing(true);
            setProcessingMethod(method);
            try {
                if (method === "telegram-stars") {
                    await apiPayments.replenishStars(tgId, amount);
                    closeApp();
                } else if (method === "crypto") {
                    await apiPayments.replenishCrypto(tgId, amount);
                    closeApp();
                } else if (method === "card") {
                    const response = await apiPayments.replenishYoomoney(tgId, amount);
                    if (response?.payment_url) {
                        setPaymentUrl(response.payment_url);
                        setShowPaymentPanel(false);
                    } else {
                        alert("Не удалось получить ссылку на оплату");
                    }
                    setIsProcessing(false);
                    setProcessingMethod(null);
                }
            } catch (error) {
                console.error("Payment error:", error);
                alert("Ошибка при отправке запроса на пополнение");
                setIsProcessing(false);
                setProcessingMethod(null);
            }
        } else {
            console.log(`Selected payment method: ${method}`);
        }
    };

    return (
        <div className={styles.tabContent}>
            <div className={styles.title}>
                <h3 className={styles.subtitle}>Баланс</h3>
                <div className={styles.sum}>{balance}</div>
            </div>
            <div className={styles.paymentMethods}>
                <input
                    className={styles.searchInput}
                    type="text"
                    placeholder="Введите сумму..."
                    value={amount}
                    onChange={handleAmountChange}
                    disabled={!tgId || isProcessing}
                />
                <Button size="medium" disabled={!tgId || isProcessing} onClick={handleTopUpClick}>
                    Пополнить
                </Button>
            </div>

            {showPaymentPanel && !paymentUrl && (
                <div className={styles.paymentPanel}>
                    <div className={styles.panelHeader}>
                        <h4 className={styles.panelTitle}>Выберите способ оплаты</h4>
                        <button
                            className={styles.closeButton}
                            onClick={() => setShowPaymentPanel(false)}
                        >
                            ✕
                        </button>
                    </div>
                    <div className={styles.paymentOptions}>
                        {(!enabledMethods || enabledMethods.stars) && (
                            <button
                                className={styles.paymentOption}
                                onClick={() => handlePaymentMethodClick('telegram-stars')}
                                disabled={isProcessing}
                            >
                                <span className={styles.optionIcon}>⭐</span>
                                <span className={styles.optionText}>
                                    {processingMethod === 'telegram-stars' ? "Обработка..." : "Telegram Stars"}
                                </span>
                            </button>
                        )}
                        {(!enabledMethods || enabledMethods.crypto_bot) && (
                            <button
                                className={styles.paymentOption}
                                onClick={() => handlePaymentMethodClick('crypto')}
                                disabled={isProcessing}
                            >
                                <span className={styles.optionIcon}>₿</span>
                                <span className={styles.optionText}>
                                    {processingMethod === 'crypto' ? "Обработка..." : "Crypto Bot"}
                                </span>
                            </button>
                        )}
                        {(!enabledMethods || enabledMethods.yoomoney) && (
                            <button
                                className={styles.paymentOption}
                                onClick={() => handlePaymentMethodClick('card')}
                                disabled={isProcessing}
                            >
                                <span className={styles.optionIcon}>💳</span>
                                <span className={styles.optionText}>
                                    {processingMethod === 'card' ? "Обработка..." : "Банковская карта"}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {paymentUrl && (
                <div className={styles.paymentPanel}>
                    <div className={styles.panelHeader}>
                        <h4 className={styles.panelTitle}>Оплата картой</h4>
                        <button
                            className={styles.closeButton}
                            onClick={() => setPaymentUrl(null)}
                        >
                            ✕
                        </button>
                    </div>
                    <div className={styles.pendingPayment}>
                        <div className={styles.pendingIcon}>💳</div>
                        <p className={styles.pendingText}>
                            Скопируйте ссылку и перейдите по ней для оплаты. После оплаты баланс будет пополнен автоматически.
                        </p>
                        <div className={styles.linkContainer}>
                            <span className={styles.linkText}>{paymentUrl}</span>
                        </div>
                        <div className={styles.pendingStatus}>
                            <span className={styles.spinner}></span>
                            Ожидание подтверждения платежа...
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

