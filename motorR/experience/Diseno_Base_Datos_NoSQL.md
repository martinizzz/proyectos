# 4. Diseño e Implementación de Base de Datos (Adaptación a Firebase NoSQL)

*Nota aclaratoria para la evaluación:* El proyecto se desarrolló sobre una arquitectura Serverless utilizando Firebase Firestore, el cual es un gestor de base de datos **NoSQL Orientado a Documentos**. Por su naturaleza, no utiliza un Modelo Relacional estricto, Diagramas ER tradicionales, Llaves Foráneas rígidas ni Normalización (1FN, 2FN, 3FN). A continuación se documenta el diseño bajo los paradigmas NoSQL equivalentes a la rúbrica.

## 4.1 Justificación del Gestor (NoSQL vs SQL)
Se seleccionó **Firebase Firestore** en lugar de gestores relacionales tradicionales (MySQL/SQL Server) debido a:
1. **Velocidad de Lectura (Escalabilidad):** El catálogo de un e-commerce y el motor de inferencia requieren lecturas inmediatas y distribuidas globalmente para entregar recomendaciones en milisegundos.
2. **Sincronización en Tiempo Real:** Permite a la interfaz asíncrona escuchar cambios en el inventario instantáneamente.
3. **Estructura Flexible:** Permite acoplar atributos variables para los productos biológicos (plantas) sin necesidad de reestructurar tablas relacionales mediante sentencias `ALTER TABLE`.

## 4.2 Modelo de Datos: Colecciones y Documentos
En lugar del esquema Entidad-Relación tradicional, el modelo de datos de Firestore se distribuye en jerarquías de Colecciones y Sub-documentos:

### Colección: `products`
Esta colección reemplaza a la clásica "Tabla de Productos". Los registros son documentos JSON independientes.
- **`id`** (Automático de Firestore) -> Actúa como *Llave Primaria (PK)*.
- **`name`** (String): Nombre botánico o comercial.
- **`category`** (String): Categoría semántica (ej. Fertilizantes).
- **`price`** (Number): Precio unitario.
- **`stock`** (Number): Disponibilidad en vivero.
- **`imageUrl`** (String): Enlace al blob de Cloudinary.
- **`active`** (Boolean): Regla de control (soft-delete).
- **`createdAt`** (Timestamp).

### Colección: `orders`
Almacena el registro final de pago, reemplazando las tablas relacionales de "Ventas" y "Detalle_Ventas".
- **`orderId`** (String) -> *Llave Primaria (PK)* generada por Stripe.
- **`amount`** (Number): Total de la orden.
- **`status`** (String): Estado transaccional (ej. 'paid').
- **`items`** (Array of Objects): Arreglo incrustado (embedded) que contiene copias en el tiempo de los productos comprados (id_referencia, cantidad, precio). Esto reemplaza el uso de Llaves Foráneas (FK) y Tablas Intermedias mediante **Des-normalización**.
- **`timestamp`** (Date).

## 4.3 Des-normalización y Reglas de Integridad
En bases de datos SQL se busca **Normalizar** para no repetir datos. En NoSQL (Firebase), deliberadamente **Des-normalizamos** los datos por velocidad.
- En la colección `orders`, dentro del campo `items`, se clona el nombre y el precio del producto en el instante preciso de la venta. 
- **Integridad:** Esto garantiza que, si el precio del producto cambia en el futuro en la colección `products`, el registro histórico de la orden no se corrompe.
- En lugar de llaves foráneas estrictas, almacenamos el ID del documento original en el arreglo del carrito como una "referencia suave".

## 4.4 Reglas de Seguridad (Security Rules)
Las reglas de integridad y protección a nivel de motor en Firebase se programan mediante Security Rules. Nuestro sistema aplica reglas que simulan validaciones a nivel base de datos:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Lectura pública del catálogo de plantas solo para elementos activos
    match /products/{product} {
      allow read: if true;
      allow write: if false; // Solo el Motor/Backend Node.js tiene credenciales de Admin
    }
    
    // Las órdenes son insertadas únicamente de forma privada mediante Server-to-Server
    match /orders/{order} {
      allow read, write: if false; // Bloqueo al cliente frontend. Se asienta por Webhook (Node.js)
    }
  }
}
```
