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
    const tgId = useTelegramStore((state) => state.tgId);
    const { addToCart, removeFromCartOneCurrent, actionLoading, cart } =
        useCartStore();
    const { showToast } = useToastStore();

    if (!product) return null;

    const count = product ? cart[product.id] || 0 : 0;
    const controlsDisabled = actionLoading || !tgId;

    const handleAdd = () => {
        if (!tgId) return;
        addToCart(tgId, product.id);
    };

    const handlePrimaryAdd = () => {
        handleAdd();
        if (tgId) {
            showToast("Товар добавлен в корзину!");
        }
    };

    const handleRemove = () => {
        if (!tgId) return;
        removeFromCartOneCurrent(tgId, product.id);
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
