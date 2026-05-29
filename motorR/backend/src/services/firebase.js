import {initializeApp, cert, getApps} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

function getServiceAccount(){
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if(!raw){
        throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not defined in environment variables');
    }
    return JSON.parse(raw);
}

if( !getApps().length){
    initializeApp({
        credential: cert(getServiceAccount())
    });
}

export const db = getFirestore()