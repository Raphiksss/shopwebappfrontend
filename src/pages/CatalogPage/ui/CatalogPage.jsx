import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import { CategoriesNav } from "../../../widgets/CategoriesNav/CategoriesNav";
import ProductCards from "../../../entities/product/ui/ProductCards";
import { SortPanel } from "../../../shared/ui/SortPanel/SortPanel";

import SettingsIcon from "../../../shared/assets/icons/settings.svg?react";
import CroosIcon from "../../../shared/assets/icons/cross.svg?react";

import { Toaster } from "../../../shared/ui/Toaster/Toaster";
import { useToastStore } from "../../../shared/model/useToasterStore";

import styles from "./CatalogPage.module.css";

export const CatalogPage = () => {
    const { message, clearToast } = useToastStore();

    const [active, setActive] = useState(false);
    const [sort, setSort] = useState("default");

    const handleClose = () => setActive(false);

    const sortLabels = {
        default: "Без сортировки",
        expensive: "Сначала дорогие",
        cheap: "Сначала дешёвые",
    };

    return (
        <div className={styles.catalogPage}>
            {active && (
                <div
                    className={styles.overlay}
                    onClick={handleClose}
                />
            )}
            <div className={styles.titleBlock}>
                <h2 className={styles.title}>Каталог</h2>
                {sort !== "default" && (
                    <span className={styles.sortBadge}>
                        {sortLabels[sort]}
                        <button
                            className={styles.badgeClose}
                            onClick={() => setSort("default")}
                            title="Сбросить сортировку"
                        >
                            <CroosIcon className={styles.icon} />
                        </button>
                    </span>
                )}
                <button
                    className={styles.button}
                    onClick={() => setActive(true)}
                >
                    <SettingsIcon />
                </button>
            </div>
            <CategoriesNav />
            <Toaster message={message} onClose={clearToast} />
            <Routes>
                <Route path="/" element={<ProductCards sort={sort} />} />
                <Route
                    path="/:category"
                    element={<ProductCards sort={sort} />}
                />
            </Routes>

            {active && (
                <div className={styles.sortPanel}>
                    <SortPanel
                        value={sort}
                        onChange={(s) => {
                            setSort(s);
                            setActive(false);
                        }}
                        onClose={handleClose}
                    />
                </div>
            )}
        </div>
    );
};
