import { Router } from "express";
import { getDb } from "../services/sqlite.js";

const orderRoutes = Router();

// Obtener todas las órdenes (GET /api/orders) formato ML
orderRoutes.get('/', async (req, res) => {
    try {
        const db = await getDb();
        
        const ordenesRows = await db.all('SELECT * FROM ordenes ORDER BY fecha_orden DESC');
        const orders = [];
        
        for (let row of ordenesRows) {
            const itemsRows = await db.all(`
                SELECT p.nombre as name, d.cantidad as quantity, d.precio_unitario as price
                FROM detalles_orden d
                JOIN productos p ON d.id_producto = p.id_producto
                WHERE d.id_orden = ?
            `, [row.id_orden]);
            
            orders.push({
                id: row.id_orden.toString(),
                id_cliente: row.id_cliente,
                total: row.total,
                estado: row.estado,
                createdAt: row.fecha_orden,
                items: itemsRows // Compatible con Python ML [{name: "Producto"}]
            });
        }
        
        return res.json({ ok: true, orders });
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Error al obtener órdenes', error: error.message });
    }
});

orderRoutes.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDb();
        const doc = await db.get('SELECT * FROM ordenes WHERE id_orden = ?', [id]);
        
        if (!doc) return res.status(404).json({ ok: false, message: 'Orden no encontrada' });
        return res.json({ ok: true, order: { id: doc.id_orden, ...doc } });
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Error consultando la orden', error: error.message });
    }
});

orderRoutes.delete('/:id', async (req, res) => {
    return res.json({ ok: false, message: 'Eliminación deshabilitada en modo Vivero ML' });
});

export default orderRoutes;
