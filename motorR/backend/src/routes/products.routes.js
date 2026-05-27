import { Router } from "express";
import { getDb } from "../services/sqlite.js";

const productRoutes = Router();

// Obtener todos los productos (GET /api/products)
productRoutes.get('/', async (req, res) => {
    try {
        const db = await getDb();
        const productsRows = await db.all(`
            SELECT p.id_producto as id, p.nombre as name, p.precio as price, 
                   p.stock, c.nombre as category
            FROM productos p
            LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
        `);
        
        const products = productsRows.map(row => ({
            id: row.id.toString(),
            name: row.name,
            price: row.price,
            stock: row.stock,
            category: row.category,
            imageUrl: '', 
            active: true
        }));
        
        return res.json({ ok: true, products });
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Error al obtener productos', error: error.message });
    }
});

// Rutas de mutación deshabilitadas en esta integración (Solo analítica ML)
productRoutes.post('/', async (req, res) => res.json({ok: false, message: 'Modo solo lectura ML (Vivero)'}));
productRoutes.put('/:id', async (req, res) => res.json({ok: false, message: 'Modo solo lectura ML (Vivero)'}));
productRoutes.delete('/:id', async (req, res) => res.json({ok: false, message: 'Modo solo lectura ML (Vivero)'}));

export default productRoutes;
