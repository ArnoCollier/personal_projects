import json
import os
import pandas as pd

input_file = "./response_data.json"
output_file = "./tijdelijk.csv"

# Lees het JSON-bestand in
with open(input_file, 'r') as f:
    data = json.load(f)

# Controleer of er gegevens zijn in het JSON-bestand
if any(event for tree in data['tree'] for comp in tree['competitions'] for event in comp['events']):
    # Schrijf de gegevens naar het uitvoerbestand (overschrijf modus)
    with open(output_file, 'w') as f:
        for tree in data['tree']:
            for comp in tree['competitions']:
                for event in comp['events']:
                    match_name = event['name']
                    datum=event['starts_at']
                    odds = ', '.join(str(outcome['odds']) for market in event['markets'] for outcome in market['outcomes'])
                    # Toevoegen van elke "name" aan de uitvoer
                    names = [outcome['name'] for market in event['markets'] for outcome in market['outcomes']]
                    names_str = ", ".join(names)
                    f.write(f"{match_name}, {odds}, {names_str}, {datum}\n")
    
    print("Filteren voltooid. Resultaten overschreven in", output_file)
else:
    print("Fout: Kan geen gegevens vinden in het JSON-bestand.")


df=pd.read_csv('./tijdelijk.csv',header=None)

df.drop(df.columns[[8,9,10,11,12,13]], axis=1, inplace=True)
df.columns = ['wedstrijd', 'beide_scoren', 'scoren_niet','a_winnaar', 'gelijk', 'b_winnaar', 'meer_dan', 'minder_dan','getal','datwed']
df['datum'] = pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')
df['uurwed']=pd.to_datetime(df['datwed']).dt.strftime('%H:%M')
df['datwed'] = pd.to_datetime(df['datwed']).dt.strftime('%Y-%m-%d')
df=df[['wedstrijd', 'a_winnaar', 'gelijk', 'b_winnaar', 'meer_dan', 'minder_dan','getal', 'beide_scoren', 'scoren_niet','datum','datwed','uurwed']]
df["getal"] = df["getal"].apply(lambda x: float(x.split("(")[-1].strip(")")))
df[['a_ploeg', 'b_ploeg']] = df['wedstrijd'].str.split(' vs ', expand=True)
df.drop(columns=['wedstrijd'], inplace=True)


df=df[['a_ploeg','b_ploeg', 'a_winnaar', 'gelijk', 'b_winnaar', 'meer_dan', 'minder_dan','getal', 'beide_scoren', 'scoren_niet','datum','datwed','uurwed']]
df.to_csv('./bet777.csv', index=False,header=False,sep=';',mode='a')