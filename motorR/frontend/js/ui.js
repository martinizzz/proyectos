import { cartTotals } from "./cart.js";

const money = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
});

export function renderProducts(gridEl, products, onAdd) {
    gridEl.innerHTML = products.map(p => `
        <div class="col-12 col-sm-6 col-lg-4">
            <div class="card h-100 garden-card border-0">
                <img class="card-img-top card-img-garden" src="${p.imageUrl}" alt="${p.name}">
                <div class="card-body d-flex flex-column p-4">
                    <div class="d-flex justify-content-between align-items-start gap-2 mb-3">
                        <h5 class="card-title h6 mb-0 text-garden" style="font-family: 'Lora', serif; font-size: 1.1rem;">${p.name}</h5>
                        <span class="badge-garden">${money.format(p.price)}</span>
                    </div>
                    <p class="text-muted small mb-4">Disponibles en el vivero: <span>${p.stock}</span></p>    
                    <button class="btn btn-garden w-100 mt-auto py-2" data-add="${p.id}">
                        Llevar al jardín
                    </button>
                </div>
            </div>
        </div>
    `).join("");

    gridEl.querySelectorAll("[data-add]").forEach(btn => {
        btn.addEventListener("click", () => {
            onAdd(btn.getAttribute("data-add"));
        });
    });
}

export function renderCart(cartItemsEl, cartEmptyEl, cartTotalEl, cartCountEl, cart, handlers) {
    const { count, total } = cartTotals(cart);
    cartCountEl.textContent = String(count);
    cartTotalEl.textContent = money.format(total);
    
    // Mostrar/ocultar mensaje de vacío
    cartEmptyEl.classList.toggle("d-none", cart.length !== 0);

    cartItemsEl.innerHTML = cart.map(i => `
        <div class="cart-item-garden d-flex gap-3 align-items-center">
            <img src="${i.imageUrl}" alt="${i.name}" width="56" height="56" style="object-fit:cover; border-radius: 8px; border: 1px solid var(--garden-border);">
            <div class="flex-grow-1">
                <div class="fw-bold small text-garden" style="font-family: 'Lora', serif;">${i.name}</div>
                <div class="text-muted mt-1" style="font-size: 0.8rem;">${money.format(i.price)} c/u</div>
            </div>
            <div class="d-flex align-items-center gap-2">
                <input class="form-control form-control-sm garden-input text-center px-1" style="width:60px; height: 36px;"
                       type="number" min="1" value="${i.qty}" data-qty="${i.id}">
                <button class="btn btn-link text-decoration-none p-0 ms-1 text-danger" style="font-size: 1.25rem; font-weight: bold;" data-remove="${i.id}">&times;</button>
            </div>
        </div>
    `).join("");

    cartItemsEl.querySelectorAll("[data-qty]").forEach(inp => {
        inp.addEventListener("change", () => handlers.onQty(inp.getAttribute("data-qty"), inp.value));
    });
    cartItemsEl.querySelectorAll("[data-remove]").forEach(btn => {
        btn.addEventListener("click", () => handlers.onRemove(btn.getAttribute("data-remove")));
    });
}

export function renderRecommendations(containerEl, listEl, recomends, allProducts, onAdd) {
    if (!recomends || recomends.length === 0) {
        containerEl.classList.add('d-none');
        return;
    }
    
    // Match valid products from the database that are recommended (by name)
    const validRecs = allProducts.filter(p => recomends.includes(p.name));
    
    if (validRecs.length === 0) {
        containerEl.classList.add('d-none');
        return;
    }

    containerEl.classList.remove('d-none');
    
    listEl.innerHTML = validRecs.map(p => `
        <div class="garden-card p-2 text-center" style="width: 105px;">
            <img src="${p.imageUrl}" alt="${p.name}" width="50" height="50" class="mb-2" style="object-fit:cover; border-radius: 50%; border: 2px solid var(--garden-green-light);">
            <div class="small fw-bold text-truncate mb-2 text-garden" style="font-family: 'Lora', serif; font-size: 0.8rem;" title="${p.name}">${p.name}</div>
            <button class="btn btn-sm btn-garden-outline w-100 py-1" style="font-size: 0.75rem;" data-add-rec="${p.id}">+ Sembrar</button>
        </div>
    `).join("");

    listEl.querySelectorAll("[data-add-rec]").forEach(btn => {
        btn.addEventListener("click", () => {
            onAdd(btn.getAttribute("data-add-rec"));
        });
    });
}