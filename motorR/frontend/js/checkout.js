export async function startCheckout(cart) {
    const res = await fetch("http://localhost:4050/api/checkout/create-session", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ items: cart })
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || "Error al pagar, no tienes fondos suficientes o tu tarjeta no es válida");

    }
    return data
}