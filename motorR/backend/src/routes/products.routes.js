import { Router } from "express";
import { db } from "../services/firebase.js";

const productRoutes = Router();

// Obtener todos los productos (GET /api/products)
productRoutes.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('products').get();
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json({ ok: true, products });
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Error al obtener productos', error: error.message });
    }
});

// Crear un nuevo producto (POST /api/products)
productRoutes.post('/', async (req, res) => {
    try {
        const { name, price, stock, imageUrl, active } = req.body;
        
        if (!name || price === undefined) {
            return res.status(400).json({ ok: false, message: 'El nombre y precio son requeridos' });
        }

        const newProduct = {
            name: String(name),
            price: Number(price),
            stock: Number(stock || 0),
            imageUrl: imageUrl ? String(imageUrl) : '',
            active: active !== undefined ? Boolean(active) : true,
            createdAt: new Date()
        };
        
        const docRef = await db.collection('products').add(newProduct);
        return res.status(201).json({ ok: true, id: docRef.id, product: newProduct });
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Error al crear el producto', error: error.message });
    }
});

// Actualizar un producto (PUT /api/products/:id)
productRoutes.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        await db.collection('products').doc(id).update({
            ...updates,
            updatedAt: new Date()
        });
        
        return res.json({ ok: true, message: 'Producto actualizado con éxito' });
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Error al actualizar producto', error: error.message });
    }
});

// Eliminar un producto (DELETE /api/products/:id)
productRoutes.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('products').doc(id).delete();
        return res.json({ ok: true, message: 'Producto eliminado' });
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Error al eliminar producto', error: error.message });
    }
});

export default productRoutes;
