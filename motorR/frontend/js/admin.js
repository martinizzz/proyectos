import {uploadImage} from "./upload.js"
import { createProduct } from "./products.js"

const productForm = document.querySelector("#productForm")
const nameInput = document.querySelector("#name")
const priceInput = document.querySelector("#precio")
const stockInput = document.querySelector("#stock")
const imageInput = document.querySelector("#image")
const statusEl = document.querySelector("#status")
const previewEl = document.querySelector("#preview")
const saveBtn = document.querySelector("#saveBtn")


productForm.addEventListener("submit", async (e)=>{
    e.preventDefault()
    try {
        const file = imageInput.files?.[0]
        if (!file){
            statusEl.textContent = "Por favor selecciona una imagen"
            return
        }
        saveBtn.disabled = true
        statusEl.textContent = "Subiendo imagen...(Clounidary)"
        const uploadResult = await uploadImage(file)
        previewEl.src = uploadResult.url
        previewEl.classList.remove("d-none")
        statusEl.textContent = "Guardando producto... (Firebase)"
        await createProduct({
            name: nameInput.value.trim(),
            price: Number(priceInput.value),
            stock: Number(stockInput.value),
            imageUrl: uploadResult.url,
            active: true
        })
        statusEl.textContent = "Producto guardado exitosamente"
        productForm.reset()

    } catch(error){
        statusEl.textContent = error.message || "Error al guardar el producto"

    } finally{
        saveBtn.disabled = false

    }
})
