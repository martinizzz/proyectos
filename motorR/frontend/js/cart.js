const KEY = 'shop_cart_v1';

export function readCart() {
    try {
        return JSON.parse(localStorage.getItem(KEY)) ?? [];
    } catch {
        return [];
    }
}

export function writeCart(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(product) {
    const cart = readCart();
    const idx = cart.findIndex(i => i.id === product.id);
    
    if (idx >= 0) {
        cart[idx].qty += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            qty: 1
        });
    }

    writeCart(cart);
    return cart;
}

export function updateQty(id, qty) {
    const cart = readCart();
    const item = cart.find(i => i.id === id);
    if (!item) return cart;
    item.qty = Math.max(1, Number(qty || 1));
    writeCart(cart);
    return cart;
}

export function removeItem(id) {
    const cart = readCart().filter(i => i.id !== id);
    writeCart(cart);
    return cart;
}

export function clearCart() {
    writeCart([]);
    return [];
}

export function cartTotals(cart) {
    const count = cart.reduce((a, i) => a + i.qty, 0);
    const total = cart.reduce((a, i) => a + (i.qty * i.price), 0);
    return { count, total };
}


