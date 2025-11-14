import clsx from "clsx";

import { useFavoriteStore } from "../../../features/profile-favorites/model/useFavoriteStore";
import { useTelegramStore } from "../../../entities/telegram/model/useTelegramStore";
import HeartIcon from "../../assets/icons/heart.svg?react";

import styles from "./FavoriteButton.module.css";

export const FavoriteButton = ({ product, size = "medium" }) => {
    const tgId = useTelegramStore((state) => state.tgId);
    const isFavorite = useFavoriteStore((state) =>
        product ? state.isFavorite(product.id) : false
    );
    const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
    const actionLoading = useFavoriteStore((state) => state.actionLoading);

    if (!product) return null;

    const handleClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!tgId) return;
        toggleFavorite(tgId, product.id);
    };

    return (
        <button
            onClick={handleClick}
            className={styles.button}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            disabled={actionLoading || !tgId}
        >
            <HeartIcon
                className={clsx(styles.icon, styles[size], {
                    [styles.active]: isFavorite,
                })}
            />
        </button>
    );
};
