import { db } from './services/firebase.js';

async function seedOrders() {
    console.log("Iniciando generador (seeder) de compras...");
    
    // 1. Obtener productos
    const snapshot = await db.collection('products').get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    if (products.length === 0) {
        console.log("¡Error! No hay productos en la base de datos. Agrega algunos productos al catálogo primero.");
        process.exit(1);
    }
    
    console.log(`Se encontraron ${products.length} productos en Firestore.`);

    // 2. Crear las compras con transacciones falsas
    const generatedOrders = [];
    
    console.log("Creando 35 compras con combinaciones y patrones aleatorios...");
    for (let i = 0; i < 35; i++) {
        const numItems = Math.floor(Math.random() * 3) + 2; // de 2 a 4 productos
        
        let selectedProducts = [];
        let pool = [...products];
        
        /* 
           Introducimos un patrón forzado para que el algoritmo lo detecte:
           En el 50% de las compras donde al menos hay 2 productos,
           añadimos los primeros dos productos de la base de datos siempre juntos. 
           (Así el Apriori siempre detecta esta regla).
        */
        let forcePattern = Math.random() < 0.5;
        if (forcePattern && pool.length >= 2) {
            selectedProducts.push(pool[0]);
            selectedProducts.push(pool[1]);
            // Removemos para no repetir
            pool = pool.slice(2);
        }
        
        // Llenamos el resto
        while(selectedProducts.length < numItems && pool.length > 0) {
            const index = Math.floor(Math.random() * pool.length);
            selectedProducts.push(pool[index]);
            pool.splice(index, 1);
        }
        
        const items = selectedProducts.map(p => ({
            id: String(p.id),
            name: String(p.name),
            price: Number(p.price || 0),
            qty: 1, // compran 1 de cada uno
            imageUrl: p.imageUrl ? String(p.imageUrl) : ''
        }));
        
        const total = items.reduce((acc, item) => acc + item.price * item.qty, 0);
        
        const newOrder = {
            status: 'completed',
            currency: 'mxn',
            total: total,
            items: items,
            stripeSessionId: `mock_session_${Math.random().toString(36).substring(7)}`,
            paymentStatus: 'paid',
            createdAt: new Date(),
            updateAt: new Date()
        };
        generatedOrders.push(newOrder);
    }
    
    // Subir a Firestore
    console.log("Subiendo información a las bases de datos en Firebase...");
    for (const order of generatedOrders) {
        await db.collection('orders').add(order);
    }
    
    console.log(`¡Éxito! Se guardaron ${generatedOrders.length} compras exitosamente. Ya puedes probar el script de recomendaciones.`);
    process.exit(0);
}

seedOrders().catch(err => {
    console.error("Error al preparar base de datos local:", err);
    process.exit(1);
});
