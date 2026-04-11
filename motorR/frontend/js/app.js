import { fetchProducts } from "./products.js";
import { addToCart, readCart, updateQty, removeItem, clearCart } from "./cart.js";
import { renderProducts, renderCart, renderRecommendations } from "./ui.js";
import { startCheckout } from "./checkout.js";

const productsGrid = document.querySelector('#productsGrid');
const emptyState = document.querySelector('#emptyState');
const cartItems = document.querySelector('#cartItems');
const cartTotal = document.querySelector('#cartTotal');
const cartCount = document.querySelector('#cartCount');
const cartEmpty = document.querySelector('#cartEmpty');
const searchInput = document.querySelector('#searchInput');
const sortSelect = document.querySelector('#sortSelect');
const clearCartBtn = document.querySelector('#clearCartBtn');
const checkoutBtn = document.querySelector('#checkoutBtn');
const cartRecommendations = document.querySelector('#cartRecommendations');
const recommendationsList = document.querySelector('#recommendationsList');
const topRecommendationsSection = document.querySelector('#topRecommendationsSection');
const topRecommendationsGrid = document.querySelector('#topRecommendationsGrid');

let cart = readCart()
let allProducts = []
let stateProducts = []

function applyFilters() {
    if (!allProducts.length) return;
    const q = (searchInput.value || '').toLowerCase().trim();
    let list = allProducts.filter(p => p.name.toLowerCase().includes(q));

    const sort = sortSelect.value;
    if (sort === 'name_asc') list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'price_asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);

    emptyState.classList.toggle("d-none", list.length > 0);

    renderProducts(productsGrid, list, (id) => {
        const p = allProducts.find(prod => prod.id === id);
        if (!p) return;
        cart = addToCart(p);
        paintCart();
    });
}

async function init() {
    try {
        allProducts = await fetchProducts()
        applyFilters()
        paintCart()
    }catch(error) {
        console.error("Error initializing app:", error)
        emptyState.classList.remove("d-none")
    }
}

function paintCart() {
    renderCart(cartItems, cartEmpty, cartTotal, cartCount, cart, {
        onQty: (id, qty) => { 
            cart = updateQty(id, qty); 
            paintCart(); 
        },
        onRemove: (id) => { 
            cart = removeItem(id); 
            paintCart(); 
        }
    });

    handleRecommendations();
}

async function handleRecommendations() {
    if (cart.length > 0) {
        try {
            // Recommend based on the last added product
            const lastProduct = cart[cart.length - 1];
            const res = await fetch(`http://localhost:4050/api/recommendations/${encodeURIComponent(lastProduct.name)}`);
            if (res.ok) {
                const data = await res.json();
                renderRecommendations(cartRecommendations, recommendationsList, data.recomends || [], allProducts, (id) => {
                    const p = allProducts.find(prod => prod.id === id);
                    if (p) {
                        cart = addToCart(p);
                        paintCart();
                    }
                });

                // Render top section
                const validRecs = allProducts.filter(p => (data.recomends || []).includes(p.name));
                if (validRecs.length > 0) {
                    topRecommendationsSection.classList.remove('d-none');
                    renderProducts(topRecommendationsGrid, validRecs, (id) => {
                        const p = allProducts.find(prod => prod.id === id);
                        if (p) {
                            cart = addToCart(p);
                            paintCart();
                        }
                    });
                } else {
                    topRecommendationsSection.classList.add('d-none');
                }

            } else {
                cartRecommendations.classList.add('d-none');
                topRecommendationsSection.classList.add('d-none');
            }
        } catch (error) {
            console.error("Error fetching recommendations:", error);
            cartRecommendations.classList.add('d-none');
            topRecommendationsSection.classList.add('d-none');
        }
    } else {
        cartRecommendations.classList.add('d-none');
        topRecommendationsSection.classList.add('d-none');
    }
}

searchInput.addEventListener("input", applyFilters);
sortSelect.addEventListener("change", applyFilters);

clearCartBtn.addEventListener("click", () => {
    cart = clearCart();
    paintCart();
});

checkoutBtn.addEventListener("click", async  () => {
    try {
        if (!cart.length) {
            alert("El carrito está vacío");
            return;
        }
        checkoutBtn.disabled = true
        checkoutBtn.textContent = "Procesando..."
        const result = await startCheckout(cart);
        window.location.href = result.url;
    } catch (error) {
        alert(error.message ||"Error during checkout");
    } finally {
        checkoutBtn.disabled = false
        checkoutBtn.textContent = "Pagar"
    }
});

// Inicialización
paintCart();
applyFilters();
init();