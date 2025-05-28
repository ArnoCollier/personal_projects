import pandas as pd
import re

data = pd.read_csv('doel.csv')

# Splits score
data[['thuis', 'uit']] = data['stand'].str.split(':', expand=True)
data.drop('stand', axis=1, inplace=True)

# Filter alleen het uur
data['uur'] = data['uur'].str.split('-').str[-1].str.strip().str[:-4]

# Verander de datum
data['date'] = data['date'].str.replace('okt.', 'oct.').str.replace('mei', 'may.').str.replace('mrt.', 'mar.')
data['date'] = pd.to_datetime(data['date'], format='%d %b. %Y', errors='coerce')
data = data.dropna(subset=['date'])
data['date'] = data['date'].dt.strftime('%Y-%m-%d')

# Verwijder alles 90+..
patroon = r"90\+[2-9][0-9]"
rows_to_remove = data[data['tijd'].str.contains(patroon, na=False)].index
data.drop(rows_to_remove, inplace=True)

def to_min(s):
    fd = re.findall(r'\d+', s)
    return sum(int(d) for d in fd)

def convert_time(s):
    if '+' in s:
        parts = s[:-1].split('+')
        return sum(to_min(part) for part in parts)
    else:
        return to_min(s)

data['td'] = data['tijd'].apply(convert_time)

# Kolom aanpassen zonder aanhalingstekens
data['tijd'] = data['tijd'].str.replace("'", "")

# Optellen van beginuur en td
data['nieuwe_tijd'] = pd.to_datetime(data['uur'], format='%H:%M') + pd.to_timedelta(data['td'], unit='minutes')
data['nieuwe_tijd'] = data['nieuwe_tijd'].dt.strftime('%H:%M')

# Toevoegen van 15 minuten als td groter is dan 45
data['nieuwe_tijd'] = pd.to_datetime(data['nieuwe_tijd'], format='%H:%M')
data.loc[(data['td'] > 45) & (~data['tijd'].str.contains(r'45\+')), 'nieuwe_tijd'] += pd.to_timedelta(15, unit='minutes')
data['nieuwe_tijd'] = data['nieuwe_tijd'].dt.strftime('%H:%M')

# Verwijderen van td kolommen
data.drop(['td'], axis=1, inplace=True)
data.to_csv('doelpunt.csv', index=False)
