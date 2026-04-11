import pandas as pd
import json
import urllib.request
import os
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori , association_rules

# 1. Fetch data dynamically from backend API
data = []
print("Obteniendo transacciones dinámicas desde la base de datos...")
try:
    req = urllib.request.Request("http://localhost:4050/api/orders")
    with urllib.request.urlopen(req) as response:
        res_data = json.loads(response.read().decode('utf-8'))
        if res_data.get('ok'):
            orders = res_data.get('orders', [])
            for order in orders:
                if 'items' in order:
                    transaction = [item['name'] for item in order['items'] if 'name' in item]
                    if len(transaction) > 0:
                        data.append(transaction)
        else:
            print("Error: la API respondió con estado no OK")
except urllib.error.URLError as e:
    print(f"No se pudo conectar a la API del backend. Asegúrate de que npm start (puerto 5000) esté corriendo.")
except Exception as e:
    print(f"Error al conectar con la base de datos (API de backend): {e}")

print(f"-- Transacciones Cargadas: {len(data)} transacciones encontradas ---")

# Si no hay datos, creamos reglas vacías
if len(data) == 0:
    print("No hay transacciones suficientes. Generando reglas vacías.")
    reglas_finales = pd.DataFrame(columns=['antecedents', 'consequents', 'support', 'confidence', 'lift'])
else:
    # 2. Generar el modelo de recomendaciones
    te = TransactionEncoder()
    transacciones = te.fit(data).transform(data)
    df = pd.DataFrame(transacciones, columns=te.columns_)

    # Si hay muy pocas transacciones o productos, el minimal support puede que no encuentre nada
    # Para ser más flexibles en modo dinámico, se puede ajustar el soporte
    # Usamos 0.05 por defecto o más bajo si hay pocas compras
    min_support_value = 0.05 if len(data) > 10 else 0.01

    try:
        item_frecuencia = apriori(df, min_support=min_support_value, use_colnames=True)
        
        if item_frecuencia.empty:
            print("No se encontraron items frecuentes con el soporte mínimo.")
            reglas_finales = pd.DataFrame(columns=['antecedents', 'consequents', 'support', 'confidence', 'lift'])
        else:
            print("Items Frecuentes Principales:")
            print(item_frecuencia.sort_values(by="support", ascending=False).head())
            
            # Parametros para generar las reglas
            reglas = association_rules(item_frecuencia, metric="lift", min_threshold=1.1)
            
            reglas_finales = reglas[reglas['lift'] > 1.0].copy()
            
            reglas_interesantes = reglas[(reglas['confidence'] > 0.6) & (reglas['lift'] > 2.0)]
            print(f"Se encontraron {len(reglas_interesantes)} reglas de oro.")
            print(reglas_interesantes[['antecedents', 'consequents', 'confidence', 'lift']].head())
    
    except Exception as e:
        print(f"Error generando reglas (posiblemente falta de datos cruzados): {e}")
        reglas_finales = pd.DataFrame(columns=['antecedents', 'consequents', 'support', 'confidence', 'lift'])

def recomendar_productos(producto, reglas):
    if reglas.empty:
        return "No hay reglas generadas."
        
    filtro = reglas[reglas['antecedents'].apply(lambda x: producto in x)]
    recomendaciones = filtro.sort_values(by='lift', ascending=False)

    if not recomendaciones.empty:
        sugerencias = list(recomendaciones.iloc[0]['consequents'])[0]
        return sugerencias
    else:
        return "No se encontraron recomendaciones para este producto."

producto_carro = 'Arandela'
print(f"Porque compraste '{producto_carro}', te recomendamos comprar: {recomendar_productos(producto_carro, reglas_finales)}")

# 3. Exportar reglas a JSON para el backend
def exportar_reglas(reglas, filepath='../backend/reglas.json'):
    print(f"\nPreparando exportación de reglas a {filepath}...")
    import os
    if reglas.empty:
        # Exportar una lista vacía
        out_path = os.path.join(os.path.dirname(__file__), filepath)
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump([], f)
        print(f"Éxito: Reglas vacías exportadas a {out_path}")
        return

    reglas_json = reglas.copy()
    # Convertir frozensets a listas para poder serializar a JSON
    reglas_json['antecedents'] = reglas_json['antecedents'].apply(list)
    reglas_json['consequents'] = reglas_json['consequents'].apply(list)
    
    # Exportar en formato "records" para que el backend lo lea fácil con JS
    out_path = os.path.join(os.path.dirname(__file__), filepath)
    reglas_json[['antecedents', 'consequents', 'support', 'confidence', 'lift']].to_json(out_path, orient='records', force_ascii=False)
    print(f"Éxito: Reglas exportadas a {out_path}")

exportar_reglas(reglas_finales)
