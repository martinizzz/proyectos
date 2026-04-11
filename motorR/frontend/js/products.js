import { collection, getDocs, query, where, addDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import {db} from "./firebase.js";

export async function fetchProducts(){
    const q=query(collection(db, "products"), where("active", "==", true))
    const products = await getDocs(q)
    return products.docs.map(d=> ({
        id: d.id,
        ...d.data()
    }))
}

export async function createProduct(product){
    const newProduct = await addDoc(collection(db, "products"), {
        ...product,
        createdAt: new Date().toISOString()
    })
}