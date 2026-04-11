import json
import random

combos=[
    ["Laptop", "Mouse", "Cargador"],
    ["Celular", "Audifonos", "Funda"],
    ["Pintura Blanca", "Brocha", "Cinta Masking"], # Tu proyecto de casa
    ["Filtro de Aceite", "Aceite 5W-30", "Arandela"], # Tu Nissan Frontier
    ["Cafe", "Filtros", "Azucar"],
    ["Monitor", "Cable HDMI", "Soporte VESA"],
    ["Cuaderno", "Pluma", "Marca textos"]
]

productos_sueltos = ["Teclado", "Mochila", "Lampara", "Webcam", "Disco Duro", "Router"]

data_final = []

for _ in range(1000):
    if random.random() < 0.7:  # 70% de probabilidad de elegir un combo
        trasaccion = random.choice(combos).copy()

        if random.random() < 0.2:  # 30% de probabilidad de agregar un producto suelto
            trasaccion.pop(random.randint(0, len(trasaccion)-1))  # Elimina un producto del combo

    else:
        trasaccion = random.sample(productos_sueltos, random.randint(1, 3))  # Elige entre 1 y 3 productos sueltos

    data_final.append(trasaccion)
with open ('transacciones.json', 'w', encoding='utf-8') as f:
    json.dump(data_final, f, indent=2)
print("Transacciones generadas y guardadas en transacciones.json")