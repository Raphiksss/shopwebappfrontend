import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { CategoriesNav } from "../../../widgets/CategoriesNav/CategoriesNav";
import ProductCards from "../../../entities/product/ui/ProductCards";
import { SortPanel } from "../../../shared/ui/SortPanel/SortPanel";

import SettingsIcon from "../../../shared/assets/icons/settings.svg?react";
import CroosIcon from "../../../shared/assets/icons/cross.svg?react";

import { Toaster } from "../../../shared/ui/Toaster/Toaster";
import { useToastStore } from "../../../shared/model/useToasterStore";

import styles from "./CatalogPage.module.css";

export const
    CatalogPage = () => {
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
            <AnimatePresence>
                {active && (
                    <motion.div
                        className={styles.overlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        onClick={handleClose}
                    />
                )}
            </AnimatePresence>
            <div className={styles.titleBlock}>
                <h2 className={styles.title}>Каталог</h2>
                <AnimatePresence>
                    {sort !== "default" && (
                        <motion.span className={styles.sortBadge}>
                            {sortLabels[sort]}
                            <button
                                className={styles.badgeClose}
                                onClick={() => setSort("default")}
                                title="Сбросить сортировку"
                            >
                                <CroosIcon className={styles.icon} />
                            </button>
                        </motion.span>
                    )}
                </AnimatePresence>
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
                {/* Показывать все товары на главной странице каталога */}
                <Route path="/" element={<ProductCards sort={sort} />} />
                <Route
                    path="/:category"
                    element={<ProductCards sort={sort} />}
                />
            </Routes>

            <AnimatePresence>
                {active && (
                    <motion.div
                        className={styles.sortPanel}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                    >
                        <SortPanel
                            value={sort}
                            onChange={(s) => {
                                setSort(s);
                                setActive(false);
                            }}
                            onClose={handleClose}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
