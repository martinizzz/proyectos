# 5. Desarrollo usando Metodología Ágil

## 5.1 Explicación de la Metodología Utilizada
Para la administración del ciclo de vida del desarrollo se utilizó el marco de trabajo **Scrum**, perteneciente a las Metodologías Ágiles. Se eligió esta aproximación porque permite abordar de manera iterativa tanto el desarrollo de la interfaz de usuario (Front-end) como la paulatina incorporación de inteligencia analítica (Motor Python). Trabajar por iteraciones o *Sprints* permitió hacer pruebas constantes de las recomendaciones en el carrito sin tener que esperar a finalizar todo el ecosistema.

## 5.2 Historias de Usuario (User Stories)
La planificación del sistema giró en torno a las siguientes historias de usuario, priorizadas según su aporte de valor:
1. **HU01 - Catálogo Vivo:** *Como cliente del vivero, quiero ver un catálogo de plantas y accesorios ordenable y buscable, para encontrar fácilmente lo que necesito cultivar.*
2. **HU02 - Gestión de Bolsa:** *Como cliente, quiero poder agregar, ajustar cantidades y borrar productos de mi bolsa de compras (carrito) en tiempo real, sin que la página se recargue.*
3. **HU03 - Motor Predictivo:** *Como administrador del negocio, quiero que el sistema rastree la bolsa del usuario y le sugiera automáticamente complementos (ej. Tierra o Macetas para una Planta), para aumentar el ticket promedio.*
4. **HU04 - Pago Seguro:** *Como cliente, quiero ser dirigido a una pasarela de pago segura y moderna tras confirmar mis elementos.*

## 5.3 Planeación por Etapas y Sprints (Abril - Junio)
El desarrollo, asignado a mediados de abril, fue dividido en 4 Sprints quincenales, culminando con la entrega programada para el 3 de junio.

### Sprint 1: Arquitectura Base y Mockups (15 Abril - 30 Abril)
- **Actividades:** Definición tecnológica (Node.js, Express, Firebase Firestore). Creación del repositorio y estructura de directorios. 
- **Logro:** Diagramación del UI con Glassmorphism y conexión básica entre Front y BD.

### Sprint 2: Catálogo y Carrito Dinámico (1 Mayo - 15 Mayo)
- **Actividades:** Desarrollo completo de `app.js` y `ui.js` empleando Vanilla JS. Implementación del renderizado de tarjetas, buscador, filtros y el panel Offcanvas de la bolsa.
- **Logro:** Cierre de la funcionalidad transaccional básica de e-commerce.

### Sprint 3: Inteligencia y Minería de Datos (16 Mayo - 26 Mayo)
- **Actividades:** Análisis del historial de ventas offline. Creación del script en **Python (`motorR.py`)** empleando `mlxtend` y el algoritmo *Apriori*. Extracción de pares predictivos e integración de `reglas.json` con el servidor REST Express.
- **Logro:** Endpoint `/api/recommendations` exitosamente fusionado con el evento de agregar al carrito en el frontend.

### Sprint 4: Pasarela, Refinamiento y Entregables (27 Mayo - 3 Junio)
- **Actividades:** Refinamiento estético premium (micro-animaciones, estados vacíos). Creación de documentación, checklist y reportes PDF para la rúbrica del laboratorio. Integración webhook de Stripe.
- **Logro:** Sistema robusto y listo para presentación presencial.

## 5.4 Backlog Básico (Product Backlog)
A continuación, el tablero consolidado de tareas y su estatus final:
- [x] Levantar servidor Node.js y enrutamiento básico.
- [x] Configurar Firebase Admin SDK y reglas de seguridad.
- [x] Codificar frontend estático (HTML/CSS) con interfaz de vidrio esmerilado.
- [x] Codificar la lógica del carrito de compras en JS modular.
- [x] Programar script en Python (Apriori) para reglas de minería.
- [x] Exponer las reglas en Node.js mediante endpoint paramétrico.
- [x] Enlazar el frontend con el endpoint de recomendaciones dinámico.
- [x] Integrar API de Cloudinary para imágenes.
- [x] Configurar sesión de Stripe para Checkout.
- [x] Escribir reporte físico y PDF (Documentación Rúbrica).
