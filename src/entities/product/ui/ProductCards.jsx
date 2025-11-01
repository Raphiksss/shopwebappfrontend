import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import { useProductsStore } from "../model/useProductStore";
import { CartControls } from "../../../shared/ui/CartControl/CartControls";
import { Skeleton } from "../../../shared/ui/Skeleton/Skeleton";
import { FavoriteButton } from "../../../shared/ui/FavoriteButton/FavoriteButton";

import styles from "./ProductCards.module.css";

const ProductCards = ({ category, sort }) => {
    const { loadProducts, getProducts, loading, error } = useProductsStore();

    useEffect(() => {
        loadProducts(category);
    }, [category, loadProducts]);

    const products = getProducts(category);

    const filtered = useMemo(() => {
        if (!Array.isArray(products)) return [];
        let arr = products;

        if (category) {
            arr = arr.filter(
                (p) =>
                    p?.category?.toLowerCase() === category?.toLowerCase()
            );
        }

        if (sort === "expensive") {
            arr = [...arr].sort((a, b) => b.price - a.price);
        }
        if (sort === "cheap") {
            arr = [...arr].sort((a, b) => a.price - b.price);
        }

        return arr;
    }, [products, category, sort]);

    if (loading) {
        return (
            <ul className={styles.cards}>
                {[1, 2, 3, 4].map((i) => (
                    <li key={i} className={`${styles.card} ${styles.skeleton}`}>
                        <Skeleton height={160} />
                        <div className={styles.contentContainer}>
                            <Skeleton height={16} width="80%" margin="8px 0" />
                            <Skeleton height={16} width="60%" margin="8px 0" />
                            <Skeleton
                                height={40}
                                width="100%"
                                margin="12px 0 0 0"
                            />
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

    if (error) {
        return (
            <p className={styles.error}>
                �?�?��+��� �����?�?�?�����: {error}
            </p>
        );
    }

    return (
        <ul className={styles.cards}>
            {filtered.map((product) => (
                <li key={product.id} className={styles.card}>
                    <Link
                        className={styles.link}
                        to={`/product/${product.id}`}
                        state={{ fromCategory: category }}
                    >
                        <div className={styles.imageContainer}>
                            <img
                                src={product.image}
                                alt={product.title}
                                className={styles.image}
                            />
                        </div>
                    </Link>
                    <div className={styles.contentContainer}>
                        <div className={styles.meta}>
                            <Link
                                className={styles.link}
                                to={`/product/${product.id}`}
                                state={{ fromCategory: category }}
                            >
                                <h3 className={styles.name}>
                                    {product.title}
                                </h3>
                            </Link>
                        </div>
                        <div className={styles.priceContainer}>
                            <span className={styles.price}>
                                {product.price} ₽
                            </span>
                            <FavoriteButton product={product} size="medium" />
                        </div>
                        <div className={styles.buttonContainer}>
                            <CartControls
                                product={product}
                                size="small"
                                text={"В корзину"}
                            />
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default ProductCards;

