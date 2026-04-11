import {initializeApp, cert, getApps} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import "dotenv/config";

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