import { create } from "zustand";
import { persist } from "zustand/middleware";
import { sendKafkaEvent } from "../actions/track-user";

type Product = {
    id: string;
    title: string;
    price: number;
    image: string;
    quantity?: number;
    shopId: string;
}

type Store = {
    cart: Product[];
    wishlist: Product[];
    addToCart: (
        product: Product,
        user: any,
        location: any,
        deviceInfo: any,
    ) => void;
    removeFromCart: (
        id: string,
        user: any,
        location: any,
        deviceInfo: any,
    ) => void;
    addToWishList: (
        product: Product,
        user: any,
        location: any,
        deviceInfo: any
    ) => void;
    removeFromWishList: (
        id: string,
        user: any,
        location: any,
        deviceInfo: any,
    ) => void;
};

export const useStore = create<Store>()(
    persist(
        (set, get) => ({
            cart: [],
            wishlist: [],

            // Add to Cart
            addToCart: (product, user, location, deviceInfo) => {
                void user;
                void location;
                void deviceInfo;
                set((state) => {
                    const existing = state.cart?.find((item) => item.id === product.id);
                    if (existing) {
                        return {
                            cart: state.cart.map((item) => item.id === product.id 
                            ? { ...item, quantity: (item.quantity ?? 1) + 1} 
                            : item),
                        };
                    }
                    return {cart: [...state.cart, { ...product, quantity: 1 }]};
                });

                // send kafka event
                if (user?.id && location && deviceInfo) {
                    sendKafkaEvent({
                        userId: user?.id,
                        productId: product?.id,
                        shopId: product?.shopId,
                        action: "add_to_cart",
                        country: location?.country || "Unknown",
                        city: location?.city || "Unknown",
                        device: deviceInfo || "Unknown Device",
                    });
                }
            },

            // Remove from Cart
            removeFromCart: (id, user, location, deviceInfo) => {
                void user;
                void location;
                void deviceInfo;

                // find the product before calling set
                const removeProduct = get().cart.find((item) => item.id === id);
                set((state) => ({
                    cart: state.cart.filter((item) => item.id !== id),
                }));

                // send kafka event
                if (user?.id && location && deviceInfo && removeProduct) {
                    sendKafkaEvent({
                        userId: user?.id,
                        productId: removeProduct?.id,
                        shopId: removeProduct?.shopId,
                        action: "remove_from_cart",
                        country: location?.country || "Unknown",
                        city: location?.city || "Unknown",
                        device: deviceInfo || "Unknown Device",
                    });
                }
            },

            // Add to Wishlist
            addToWishList: (product, user, location, deviceInfo) => {
                void user;
                void location;
                void deviceInfo;
                set((state) => {
                    const alreadyInWishlist = state.wishlist.some((item) => item.id === product.id);
                    if (alreadyInWishlist) return state;
                    return {
                        wishlist: [...state.wishlist, product],
                    };
                });

                // send kafka event
                if (user?.id && location && deviceInfo) {
                    sendKafkaEvent({
                        userId: user?.id,
                        productId: product?.id,
                        shopId: product?.shopId,
                        action: "add_to_wishlist",
                        country: location?.country || "Unknown",
                        city: location?.city || "Unknown",
                        device: deviceInfo || "Unknown Device",
                    });
                }
            },

            // Remove from Wishlist
            removeFromWishList: (id, user, location, deviceInfo) => {
                void user;
                void location;
                void deviceInfo;

                // Find the product BEFORE calling `set`
                const removeProduct = get().wishlist.find((item) => item.id === id);
                set((state) => ({
                    wishlist: state.wishlist.filter((item) => item.id !== id),
                }));

                // send kafka event
                if (user?.id && location && deviceInfo && removeProduct) {
                    sendKafkaEvent({
                        userId: user?.id,
                        productId: removeProduct?.id,
                        shopId: removeProduct?.shopId,
                        action: "remove_from_wishlist",
                        country: location?.country || "Unknown",
                        city: location?.city || "Unknown",
                        device: deviceInfo || "Unknown Device",
                    });
                }
            },
        }),
        { name: "user-store" }
    )
);