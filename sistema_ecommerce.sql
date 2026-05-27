-- Script de creación de base de datos para Vivero (Ecommerce)
-- Tablas principales: categorias, productos, clientes, ordenes, detalles_orden

-- 1. Tabla categorias
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- 2. Tabla productos
CREATE TABLE IF NOT EXISTS productos (
    id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(150) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL,
    id_categoria INTEGER,
    FOREIGN KEY(id_categoria) REFERENCES categorias(id_categoria)
);

-- 3. Tabla clientes
CREATE TABLE IF NOT EXISTS clientes (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla ordenes
CREATE TABLE IF NOT EXISTS ordenes (
    id_orden INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER,
    fecha_orden DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'Pendiente',
    FOREIGN KEY(id_cliente) REFERENCES clientes(id_cliente)
);

-- 5. Tabla detalles_orden
CREATE TABLE IF NOT EXISTS detalles_orden (
    id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
    id_orden INTEGER,
    id_producto INTEGER,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY(id_orden) REFERENCES ordenes(id_orden),
    FOREIGN KEY(id_producto) REFERENCES productos(id_producto)
);

-- Inserción de 10 registros por tabla

-- Insertar Categóras
INSERT INTO categorias (nombre, descripcion) VALUES
('Plantas de Interior', 'Plantas adaptadas para crecer dentro de casa'),
('Árboles Frutales', 'Árboles jóvenes para huerto en casa'),
('Suculentas y Cactus', 'Plantas que requieren poco riego'),
('Macetas y Sustratos', 'Recipientes de barro y tierra preparada'),
('Fertilizantes', 'Nutrientes y vitaminas para plantas'),
('Herramientas', 'Palas, rastrillos, tijeras de podar'),
('Semillas', 'Sobres de semillas de hortalizas y flores'),
('Flores', 'Plantas decorativas con floración de temporada'),
('Arbustos', 'Plantas para cerco perimetral y jardín'),
('Orquídeas', 'Plantas exóticas de alta gama decorativa');

-- Insertar Productos
INSERT INTO productos (nombre, precio, stock, id_categoria) VALUES
('Ficus Lyrata', 45.50, 15, 1),
('Limonero 1m', 60.00, 20, 2),
('Aloe Vera', 15.00, 30, 3),
('Tierra Preparada 5kg', 8.00, 45, 4),
('Abono Orgánico', 12.00, 100, 5),
('Tijeras de Podar', 22.00, 50, 6),
('Semillas de Tomate', 3.50, 80, 7),
('Rosal Rojo', 25.00, 40, 8),
('Bugambilia', 35.00, 10, 9),
('Orquídea Phalaenopsis', 55.00, 12, 10);

-- Insertar Clientes
INSERT INTO clientes (nombre, email, telefono) VALUES
('Juan Perez', 'juan.perez@email.com', '555-1234'),
('Maria Garcia', 'maria.garcia@email.com', '555-5678'),
('Carlos Rodriguez', 'crodriguez@email.com', '555-8765'),
('Ana Martinez', 'ana.m@email.com', '555-4321'),
('Luis Hernandez', 'luis.hdz@email.com', '555-9988'),
('Laura Gomez', 'laura.gomez@email.com', '555-7766'),
('Jose Diaz', 'jdiaz@email.com', '555-5544'),
('Elena Torres', 'elena.torres@email.com', '555-3322'),
('Pedro Ruiz', 'pedro.ruiz@email.com', '555-1100'),
('Sofia Flores', 'sofia.flores@email.com', '555-2233');

-- Insertar Ordenes
INSERT INTO ordenes (id_cliente, total, estado) VALUES
(1, 106.50, 'Completada'),
(2, 60.00, 'Enviada'),
(3, 22.00, 'Pendiente'),
(4, 55.00, 'Completada'),
(5, 35.00, 'Pendiente'),
(6, 25.00, 'Cancelada'),
(7, 45.50, 'Enviada'),
(8, 15.00, 'Completada'),
(9, 12.00, 'Pendiente'),
(10, 3.50, 'Enviada');

-- Insertar Detalles de Orden
INSERT INTO detalles_orden (id_orden, id_producto, cantidad, precio_unitario) VALUES
(1, 1, 1, 45.50),
(1, 4, 1, 8.00),
(2, 2, 1, 60.00),
(3, 6, 1, 22.00),
(4, 10, 1, 55.00),
(5, 9, 1, 35.00),
(6, 8, 1, 25.00),
(7, 1, 1, 45.50),
(8, 3, 1, 15.00),
(9, 5, 1, 12.00);

-- Sentencias SELECT de ejemplo (Evidencias)
.mode column
.headers on

.print '\n--- Total de clientes registrados ---'
SELECT COUNT(*) AS total_clientes FROM clientes;

.print '--- Productos con sus categorías ---'
SELECT p.nombre AS Producto, p.precio, c.nombre AS Categoria 
FROM productos p 
JOIN categorias c ON p.id_categoria = c.id_categoria 
LIMIT 5;

.print '--- Ordenes y sus montos por cliente ---'
SELECT o.id_orden, cl.nombre AS Cliente, o.total, o.estado 
FROM ordenes o 
JOIN clientes cl ON o.id_cliente = cl.id_cliente 
WHERE o.estado = 'Completada';

.print '--- Detalle de la Orden 1 ---'
SELECT dor.id_orden, pr.nombre AS Producto, dor.cantidad, dor.precio_unitario, (dor.cantidad * dor.precio_unitario) AS subtotal
FROM detalles_orden dor
JOIN productos pr ON dor.id_producto = pr.id_producto
WHERE dor.id_orden = 1;
