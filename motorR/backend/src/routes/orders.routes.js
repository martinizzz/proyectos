import { Router } from "express";
import { db } from "../services/firebase.js";

const orderRoutes = Router();

// Obtener todas las órdenes (GET /api/orders)
orderRoutes.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.json({ ok: true, orders });
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Error al obtener órdenes', error: error.message });
    }
});

// Obtener una orden específica (GET /api/orders/:id)
orderRoutes.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await db.collection('orders').doc(id).get();
        
        if (!doc.exists) {
            return res.status(404).json({ ok: false, message: 'Orden no encontrada' });
        }
        
        return res.json({ ok: true, order: { id: doc.id, ...doc.data() } });
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Error consultando la orden', error: error.message });
    }
});

// Eliminar una orden (DELETE /api/orders/:id)
orderRoutes.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('orders').doc(id).delete();
        return res.json({ ok: true, message: 'Orden eliminada con éxito' });
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Error al eliminar la orden', error: error.message });
    }
});

export default orderRoutes;
