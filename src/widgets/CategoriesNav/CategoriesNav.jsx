import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";

import styles from "./CategoriesNav.module.css";

import { useCategoryStore } from "../../entities/category/model/useCategoryStore";

const slugify = (value) => {
    if (!value) return null;
    const trimmed = value.toString().trim();
    if (!trimmed) return null;

    const hasNonLatin = /[^a-z0-9\s-]/i.test(trimmed);

    if (hasNonLatin) {
        return encodeURIComponent(trimmed.replace(/\s+/g, "-"));
    }

    const latinSlug = trimmed
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return latinSlug || encodeURIComponent(trimmed.replace(/\s+/g, "-"));
};

const CategoryAvatar = ({ title, imageUrl }) => {
    const [hasError, setHasError] = useState(false);
    const fallback = title?.trim()?.[0]?.toUpperCase() ?? "?";
    const showFallback = !imageUrl || hasError;

    return (
        <div className={styles.avatarWrapper}>
            {!showFallback && (
                <img
                    src={imageUrl}
                    alt={title}
                    className={styles.avatar}
                    onError={() => setHasError(true)}
                />
            )}
            {showFallback && (
                <span className={styles.avatarFallback}>{fallback}</span>
            )}
        </div>
    );
};

export const CategoriesNav = () => {
    const navRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const { categories, loading, error, loadCategories } = useCategoryStore();

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const handleMouseDown = (event) => {
        if (!navRef.current) return;
        event.preventDefault();
        isDragging.current = true;
        startX.current = event.pageX - navRef.current.offsetLeft;
        scrollLeft.current = navRef.current.scrollLeft;
    };

    const handleMouseMove = (event) => {
        if (!isDragging.current || !navRef.current) return;
        event.preventDefault();
        const x = event.pageX - navRef.current.offsetLeft;
        const walk = x - startX.current;
        navRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const stopDragging = () => {
        isDragging.current = false;
    };

    const preparedCategories = (categories ?? [])
        .map((category) => {
            const slug =
                category?.slug ||
                category?.path ||
                slugify(category?.code) ||
                slugify(category?.title);

            if (!slug) return null;

            return {
                id: category?.id ?? slug,
                slug,
                title: category?.title ?? slug,
                imageUrl:
                    category?.img ??
                    category?.image_url ??
                    category?.imageUrl ??
                    category?.image,
            };
        })
        .filter(Boolean);

    const showSkeleton = loading && preparedCategories.length === 0;
    const showEmpty = !loading && !error && preparedCategories.length === 0;

    return (
        <>
            <div className={styles.subtitle}>Категории</div>
            {error && <div className={styles.error}>{error}</div>}
            <nav
                ref={navRef}
                className={styles.nav}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseLeave={stopDragging}
                onMouseUp={stopDragging}
            >
                {showSkeleton &&
                    Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className={styles.skeletonItem}>
                            <div className={styles.skeletonAvatar} />
                            <div className={styles.skeletonTitle} />
                        </div>
                    ))}

                {preparedCategories.map((category) => (
                    <NavLink
                        key={category.id}
                        to={`/catalog/${category.slug}`}
                        className={({ isActive }) =>
                            clsx(styles.link, { [styles.active]: isActive })
                        }
                    >
                        <CategoryAvatar
                            title={category.title}
                            imageUrl={category.imageUrl}
                        />
                        <div className={styles.title}>{category.title}</div>
                    </NavLink>
                ))}

                {showEmpty && (
                    <div className={styles.emptyState}>
                        Категории скоро появятся
                    </div>
                )}
            </nav>
        </>
    );
};
