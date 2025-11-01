import styles from "./QtyBox.module.css";

export const QtyBox = ({
    count,
    onDecrement,
    onIncrement,
    disabled = false,
}) => {
    return (
        <div className={styles.qtyBox}>
            <button
                onClick={onDecrement}
                className={styles.qtyBtn}
                disabled={count <= 0 || disabled}
                aria-label="Decrease quantity"
            >
                -
            </button>
            <span className={styles.qtyNumber}>{count}</span>
            <button
                onClick={onIncrement}
                className={styles.qtyBtn}
                disabled={disabled}
                aria-label="Increase quantity"
            >
                +
            </button>
        </div>
    );
};