import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

import express from 'express';
import cors from 'cors';
import uploadRoutes from '../routes/upload.routes.js';
import checkoutRoutes from '../routes/checkout.routes.js';
import productRoutes from '../routes/products.routes.js';
import orderRoutes from '../routes/orders.routes.js';
import webhookRoutes from '../routes/webhook.routes.js';
import recommendationsRoutes from '../routes/recommendations.routes.js';
import emailRoutes from '../routes/email.routes.js';



const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || true
}));

app.use('/api/webhook', webhookRoutes);

app.use(express.json());
app.get('/funcionando', (req, res) => {
    res.json({
        ok: true,
        message: 'Server is working'
    });
});

app.use('/api/images', uploadRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/email', emailRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`API is running on port ${PORT}`);
});
