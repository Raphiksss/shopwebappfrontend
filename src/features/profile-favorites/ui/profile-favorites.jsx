import { useEffect } from "react";

import { Button } from "../../../shared/assets/Button/Button";
import { useFavoriteStore } from "../model/useFavoriteStore";
import { useProductsStore } from "../../../entities/product/model/useProductStore";
import { useTelegramStore } from "../../../entities/telegram/model/useTelegramStore";
import { CartControls } from "../../../shared/ui/CartControl/CartControls";
import { useGoToCatalog } from "../../../shared/lib/goToCatalog";

import styles from "./profile-favorites.module.css";
import CrossIcon from "../../../shared/assets/icons/cross.svg?react";

export const FavoritesList = () => {
    const initData = useTelegramStore((state) => state.initData);
    const favoriteIds = useFavoriteStore((state) => Array.from(state.ids));
    const removeFavorite = useFavoriteStore((state) => state.removeFavorite);
    const fetchFavorites = useFavoriteStore((state) => state.fetchFavorites);

    const getProductById = useProductsStore((s) => s.getProductById);

    const goToCatalog = useGoToCatalog();

    useEffect(() => {
        if (!initData) return;
        fetchFavorites();
    }, [initData, fetchFavorites]);

    const products = favoriteIds
        .map((id) => getProductById(id))
        .filter(Boolean);

    return (
        <div className={styles.tabContent}>
            <h3 className={styles.subtitle}>Избранные товары</h3>

            {products.length === 0 ? (
                <div className={styles.catalogState}>
                    <p className={styles.title}>Пока ничего нет</p>
                    <Button onClick={goToCatalog} size="medium">
                        Перейти в каталог
                    </Button>
                </div>
            ) : (
                <ul className={styles.emptyState}>
                    {products.map((product) => (
                        <li key={product.id} className={styles.card}>
                            <div className={styles.imageContainer}>
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className={styles.image}
                                />
                            </div>
                            <div className={styles.productMain}>
                                <h3 className={styles.productTitle}>
                                    {product.title}
                                </h3>
                            </div>
                            <div className={styles.priceBlock}>
                                <div className={styles.priceContainer}>
                                    <span className={styles.currentPrice}>
                                        {product.price} ₽
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        if (!initData) return;
                                        removeFavorite(product.id);
                                    }}
                                    className={styles.button}
                                >
                                    <CrossIcon className={styles.icon} />
                                </button>
                            </div>
                            <div className={styles.addBlock}>
                                <CartControls
                                    product={product}
                                    size={"medium"}
                                    text={"Добавить в корзину"}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
