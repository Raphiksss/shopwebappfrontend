import { useCartStore } from "../../../features/cart/model/useCartStore";
import { useTelegramStore } from "../../../entities/telegram/model/useTelegramStore";
import { Button } from "../../assets/Button/Button";
import { QtyBox } from "../QtyBox/QtyBox";
import { useToastStore } from "../../../shared/model/useToasterStore";

export const CartControls = ({
    product,
    size,
    text = "Добавить в корзину",
}) => {
    const initData = useTelegramStore((state) => state.initData);
    const { addToCart, removeFromCartOneCurrent, actionLoading, cart } =
        useCartStore();
    const { showToast } = useToastStore();

    if (!product) return null;

    const count = product ? cart[product.id] || 0 : 0;
    const controlsDisabled = actionLoading || !initData;

    const handleAdd = () => {
        if (!initData) return;
        addToCart(product.id);
    };

    const handlePrimaryAdd = () => {
        handleAdd();
        if (initData) {
            showToast("Товар добавлен в корзину!");
        }
    };

    const handleRemove = () => {
        if (!initData) return;
        removeFromCartOneCurrent(product.id);
    };

    return count === 0 ? (
        <Button
            size={size}
            onClick={handlePrimaryAdd}
            disabled={controlsDisabled}
        >
            {text}
        </Button>
    ) : (
        <QtyBox
            count={count}
            onDecrement={handleRemove}
            onIncrement={handleAdd}
            disabled={controlsDisabled}
        />
    );
};
