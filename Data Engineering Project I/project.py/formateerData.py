import pandas as pd

# Lees het CSV-bestand in met komma als scheidingsteken en sla de eerste rij over
df = pd.read_csv('opgekuiste_data.csv', sep=',', header=0)

df = df[['season', 'pday', 'date', 'uur', 'id', 'a_naam', 'a_stamnummer', 'b_naam', 'b_stamnummer', 'nieuwe_tijd', 'sc_stamnummer', 'team_scoort', 'thuis', 'uit']]


# Exporteer het DataFrame naar een nieuw CSV-bestand met puntkomma's als scheidingsteken en zonder de kolomnamen
df.to_csv('doelpunt.csv', sep=';', index=False, header=False)