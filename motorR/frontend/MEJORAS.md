# Mejoras de Diseño Frontend (Premium UI)

Este documento detalla las mejoras realizadas a la interfaz de usuario para elevar el aspecto visual, pasando de un diseño simple a una experiencia premium, dinámica y moderna.

## 1. Tipografía Moderna
- **Outfit**: Se ha integrado la fuente 'Outfit' de Google Fonts para los encabezados (`h1`, `h2`, logo, etc.). Esta fuente ofrece un aspecto muy geométrico, moderno y elegante que reemplaza a la clásica tipografía con serifa, dándole una frescura inmediata al sitio.
- **Nunito**: Se mantiene para los cuerpos de texto, ajustando pesos y contrastes para facilitar la lectura.

## 2. Glassmorphism (Efecto Cristal)
- Se han aplicado efectos de *Glassmorphism* en varios componentes clave (tarjetas de productos, barra de navegación, paneles del carrito).
- **Fondos semi-transparentes** con desenfoque (`backdrop-filter: blur(12px) saturate(150%)`).
- Bordes sutiles y blancos (`rgba(255, 255, 255, 0.5)`) que simulan el reflejo de la luz en el cristal, dando una sensación de profundidad y limpieza extrema.

## 3. Paleta de Colores y Gradientes
- El fondo sólido ha sido reemplazado por un **gradiente sutil y fijo** (`linear-gradient`) de tonos verde muy claro a blanco que hace sentir el sitio "vivo" sin distraer la atención.
- Los botones principales ya no son colores sólidos planos, sino que ahora cuentan con un **gradiente esmeralda premium** (`linear-gradient(135deg, #43a047, #2e7d32)`).

## 4. Micro-animaciones y Dinamismo
- **Tarjetas Interactivas**: Al pasar el ratón por encima, las tarjetas se elevan suavemente y la sombra se difumina para dar un aspecto 3D (levitación). La imagen interna tiene un efecto de zoom suave (`transform: scale(1.08)`).
- **Botones Dinámicos**: Efectos de transformación de escala (`transform: translateY(-2px) scale(1.02)`) acompañados de sombras de color iluminado (`box-shadow` dinámico).
- **Buscador**: El input de búsqueda ahora tiene un estado `:focus` mucho más rico con una transición suave en el anillo exterior y expansión sutil.

## 5. Sombras Optimizadas
- En lugar de sombras negras genéricas (`rgba(0,0,0,0.1)`), se han utilizado sombras enriquecidas con toques de azul/verde (`rgba(31, 38, 135, 0.08)`) que combinan de forma armónica con los colores de la jardinería, aportando una vibra más sofisticada.

## 6. Personalización de Barra de Desplazamiento (Scrollbar)
- Se implementó un **Scrollbar webkit customizado** mucho más delgado y sutil. Ahora los colores de la barra encajan perfectamente con el tema (pista de desplazamiento muy clara y el "pulgar" color verde translúcido que se vuelve sólido al hacer hover).

## 7. Animaciones Vivas (Keyframes)
- El sitio ahora incluye micro-animaciones continuas (`@keyframes float`). 
- El ícono del logotipo (`EcoVivero`) y el emoji de hojas (🌿) en las recomendaciones tienen una **animación flotante constante y un leve rotado**, dándole la impresión de que el sitio web respira sutilmente.

## 8. Estados Vacíos (Empty States) Premium
- Anteriormente, el mensaje de "Aún no hay naturaleza sembrada aquí" o "Tu bolsa está vacía" era simplemente texto flotando. 
- Ahora los estados vacíos tienen su propio contenedor con **Glassmorphism**, un borde punteado sutil que se ilumina al pasar el cursor y relleno amplio (`padding`). Esto elimina la sensación de un sitio roto y brinda una experiencia amigable y pulida cuando no hay datos.

## 9. Menú Lateral Ergonómico (Offcanvas)
- El panel de la bolsa (carrito) que se desliza desde la derecha ahora tiene **bordes redondeados (radius)** en su lado izquierdo. Esto suaviza la transición visual haciéndolo ver como una "tarjeta flotante" acoplada a la pantalla en vez de un bloque cuadrado rígido.
