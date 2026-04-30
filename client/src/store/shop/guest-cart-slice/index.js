import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "hazalis_guest_cart";

function loadFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveToStorage(items) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch { }
}

const guestCartSlice = createSlice({
    name: "guestCart",
    initialState: {
        items: [],
    },
    reducers: {
        hydrateGuestCart(state) {
            state.items = loadFromStorage();
        },
        addGuestItem(state, action) {
            const { productId, title, image, price, salePrice, quantity = 1 } = action.payload;
            const existing = state.items.find((i) => i.productId === productId);
            if (existing) {
                existing.quantity += quantity;
            } else {
                state.items.push({ productId, title, image, price, salePrice, quantity });
            }
            saveToStorage(state.items);
        },
        removeGuestItem(state, action) {
            state.items = state.items.filter((i) => i.productId !== action.payload);
            saveToStorage(state.items);
        },
        updateGuestQty(state, action) {
            const { productId, quantity } = action.payload;
            const item = state.items.find((i) => i.productId === productId);
            if (item) {
                item.quantity = quantity;
                if (item.quantity <= 0) {
                    state.items = state.items.filter((i) => i.productId !== productId);
                }
            }
            saveToStorage(state.items);
        },
        clearGuestCart(state) {
            state.items = [];
            localStorage.removeItem(STORAGE_KEY);
        },
    },
});

export const {
    hydrateGuestCart,
    addGuestItem,
    removeGuestItem,
    updateGuestQty,
    clearGuestCart,
} = guestCartSlice.actions;

export default guestCartSlice.reducer;
