import tkinter as tk
#from tkinter import messagebox, ttk
#import matplotlib.pyplot as plt
#from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import pandas as pd
import json
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori , association_rules

#
with open('transacciones.json','r', encoding='utf-8') as f:
    data = json.load(f)

print(f"-- Transacciones Cargadas: {len(data)} transacciones encontradas ---")


te = TransactionEncoder()

transacciones = te.fit(data).transform(data)

df = pd.DataFrame (transacciones, columns = te.columns_)

print(df.astype(int))

item_frecuencia = apriori(df , min_support=0.05 , use_colnames=True)

print(item_frecuencia.sort_values(by="support", ascending=False))

reglas = association_rules (item_frecuencia, metric = "lift", min_threshold=1.5)

# Cambia la última línea por esta:
print(reglas[['antecedents', 'consequents', 'support', 'confidence', 'lift']])

reglas_interesantes = reglas[
    (reglas['confidence'] > 0.6) & 
    (reglas['lift'] > 2.0)
]

print(f"Se encontraron {len(reglas_interesantes)} reglas de oro.")
print(reglas_interesantes[['antecedents', 'consequents', 'confidence', 'lift']].head(10))


reglas_finales = reglas[reglas['lift'] > 1.0]

print (reglas_finales[['antecedents', 'consequents', 'support', 'confidence', 'lift']])


def recomendar_productos(producto, reglas):
    # Filtro
    filtro = reglas[reglas['antecedents'].apply(lambda x: producto in x)]
    recomendaciones = filtro.sort_values(by='lift', ascending=False)

    if not recomendaciones.empty:
        sugerencias = list(recomendaciones.iloc[0]['consequents']) [0]
        return sugerencias
    else:
        return "No se encontraron recomendaciones para este producto."
    
producto_carro = 'Arandela'
print(f"Porque compraste {producto_carro}, te recomendamos comprar: {recomendar_productos(producto_carro, reglas_finales)}")


#Crear ventana principal
root = tk.Tk()
root.title("Motor de Recomendaciones Cross-Selling")
root.geometry("800x500")

# Dividir ventana en dos partes (Frames)
frame_producto = tk.LabelFrame(root, text = "Producto", padx=10, pady=10)
frame_producto.pack(side="left", fill="both", expand=True, padx=10, pady=10)

frame_recomendacion = tk.LabelFrame(root, text = "Recomendación", padx=10, pady=10)
frame_recomendacion.pack(side="right", fill="both", expand=True, padx=10, pady=10)

# Lista de procutos 
lista_productos = tk.Listbox(frame_producto, font = ("Arial", 10))
lista_productos.pack(side="left", fill="both", expand=True)

scrollbar = tk.Scrollbar(frame_producto)
scrollbar.pack(side="right", fill="y")

# Enlazar scrollbar con la lista de productos
lista_productos.config(yscrollcommand=scrollbar.set)
scrollbar.config(command=lista_productos.yview)

for producto in df.columns:
    lista_productos.insert(tk.END, producto)

