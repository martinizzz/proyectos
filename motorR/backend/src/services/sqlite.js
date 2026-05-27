import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Single connection instance
let dbInstance = null;

export const getDb = async () => {
    if (!dbInstance) {
        dbInstance = await open({
            filename: path.join(__dirname, '../../ecommerce.db'),
            driver: sqlite3.Database
        });
    }
    return dbInstance;
}
