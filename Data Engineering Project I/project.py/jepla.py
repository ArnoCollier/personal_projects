import pandas as pd

df = pd.read_csv('games_sn_clean.csv', sep=',')

datum_uur = df.iloc[:, 7].str.split(' ', n=1, expand=True)

# Voeg de gesplitste kolommen toe aan het DataFrame
df['dt'] = datum_uur[0]
df['uur'] = datum_uur[1]
# Exporteer het DataFrame naar een nieuw CSV-bestand met puntkomma's als scheidingsteken en zonder de kolomnamen
df.to_csv('games_clean.csv',index=False)
