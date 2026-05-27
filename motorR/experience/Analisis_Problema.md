# 1. Análisis del Problema

## 1.1 Explicación de la problemática planteada
En la actualidad, los comercios electrónicos de jardinería y viveros enfrentan un gran desafío: los clientes suelen adquirir un solo producto (por ejemplo, una planta) y abandonan la tienda sin considerar productos complementarios necesarios para el mantenimiento o desarrollo de dicha compra (fertilizantes, macetas, sustratos). Esto ocurre porque las tiendas tradicionales no ofrecen una experiencia de venta cruzada inteligente. La problemática radica en la falta de un sistema capaz de predecir y sugerir artículos útiles en tiempo real, lo que resulta en ventas por debajo del potencial real y en una experiencia de usuario estática y poco personalizada.

## 1.2 Necesidades del usuario
**Del lado del cliente (Comprador):**
- Necesita una interfaz rápida, intuitiva y estéticamente agradable (amigable) para buscar y agregar plantas o artículos de jardinería.
- Necesita recibir sugerencias automáticas de productos que realmente complementen lo que acaba de seleccionar (ahorrándole tiempo de búsqueda).
- Requiere un proceso transparente para ver el subtotal, manipular el carrito y proceder al pago de forma segura y ágil.

**Del lado del negocio (Administrador/Vivero):**
- Necesita aumentar el ticket promedio de compra (cross-selling).
- Requiere de un motor basado en datos históricos (minería de datos) para que las recomendaciones no sean aleatorias, sino altamente probables y efectivas.
- Necesita que el sistema opere fluidamente en la web, integrándose con una base de datos moderna (Firebase NoSQL) para el catálogo en tiempo real.

## 1.3 Entorno donde se utilizará el sistema
El sistema se desplegará en un **entorno web (Web Application)**, accesible desde navegadores modernos tanto en equipos de escritorio (desktop) como en dispositivos móviles (responsive design).
- **Frontend:** Ejecutado del lado del cliente (navegador del comprador), operando con HTML5, CSS avanzado (Glassmorphism) y JavaScript Vanilla de forma asíncrona.
- **Backend:** Servidor Node.js operando de forma continua para escuchar peticiones de la API REST e integrarse con el motor analítico, Stripe y Firebase.
- **Entorno de Datos:** Sistema en la nube basado en Firebase Firestore (NoSQL) garantizando alta disponibilidad y escalabilidad de las lecturas del catálogo.
- **Entorno Analítico (Offline/Batch):** Script de Python que se ejecuta en el backend para precalcular las reglas predictivas y dejarlas disponibles para consumo instantáneo.

## 1.4 Entradas, Procesos y Salidas del Sistema

### Entradas (Inputs)
- **Interacciones del Usuario:** Clics en la búsqueda de productos y selección de botones de "Agregar a la bolsa".
- **Datos de Catálogo:** Solicitud de carga inicial de productos desde la base de datos Firebase Firestore.
- **Historial Transaccional:** Conjunto de datos históricos (dataset de compras anteriores) ingeridos por el script de Python para entrenar el modelo predictivo.
- **Datos de Checkout:** Petición de pago con el contenido del carrito hacia el procesador externo (Stripe).

### Procesos (Processing)
- **Generación de Reglas (Python):** El sistema analiza el historial usando el algoritmo *Apriori* (librería `mlxtend`), extrayendo el Soporte, Confianza y Lift, y genera el archivo de base de conocimiento predictivo (`reglas.json`).
- **Motor de Inferencia (Node.js):** El servidor Express intercepta el artículo recién agregado a la bolsa, lee el archivo de conocimiento y filtra dinámicamente los productos complementarios ("consecuentes") exactos.
- **Renderizado Dinámico Frontend:** JavaScript procesa la respuesta del backend y manipula el DOM para mostrar visualmente (y con animaciones) los elementos sugeridos en la interfaz gráfica.
- **Gestión de Compra:** Validación del carrito y creación de una sesión encriptada de Stripe para delegar el pago.

### Salidas (Outputs)
- **UI Recomendaciones:** Despliegue visual inmediato en la interfaz (secciones "Fertilizantes y macetas ideales" / "Especies sugeridas") con los artículos recomendados.
- **Estado Visual de Bolsa:** Actualización en tiempo real del subtotal, total de elementos e interfaz gráfica del carrito (`Offcanvas`).
- **Archivo de Conocimiento:** Documento `reglas.json` resultante de la minería de datos.
- **Redirección de Pago:** URL generada que traslada al cliente a la pasarela segura de pago de Stripe.
