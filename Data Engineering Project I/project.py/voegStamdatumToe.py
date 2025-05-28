import requests
from bs4 import BeautifulSoup
import pandas as pd

df = pd.read_csv('doel.csv')
games=pd.read_csv('games.csv')

# Toevoegen van jaar en speeldag 

df = pd.merge(df, games[['id', 'pday', 'season']], on='id', how='left')

# Stamnummers

df_stamnummers = pd.read_csv('stamnummers.csv')

def get_stamnummers():  
  URL = "https://nl.wikipedia.org/wiki/Lijst_van_voetbalclubs_in_Belgi%C3%AB_naar_seizoenen_in_eerste_klasse"
  headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Odin/88.4324.2.10 Safari/537.36 Model/Hisense-MT9602 VIDAA/6.0(Hisense;SmartTV;43A53FUV;MTK9602/V0000.06.12A.N0406;UHD;HU43A6100F;)',
    }
  
  # vanuit csv file
  dic_stamnummers1 = {}
  for club, nr in zip(df_stamnummers['naam'],df_stamnummers['stamnummer']):
    dic_stamnummers1[club] = f"{nr}"
  
  # scrape vanaf wikipedia
  response = requests.get(URL, headers=headers)
  soup = BeautifulSoup(response.content, 'html.parser')
  tabel = soup.find('table', class_='wikitable')
  kolom_data = tabel.find_all('tr')

  dic_stamnummers2 = {}
  for rij in kolom_data:
        rij_data = rij.find_all('td')
        new_rij = [data.text.strip() for data in rij_data]
        if new_rij and new_rij[0] != '/ /':
          dic_stamnummers2[new_rij[1]] = new_rij[0]
  return {**dic_stamnummers1,**dic_stamnummers2}

dic_stamnummers = get_stamnummers()
 
# omzetting van de clubnamen
dic_club_namen = {'Lommel SK':'KFC Lommel SK (- 2003)', 'St-Truidense VV':'Sint-Truidense VV', 'KFCV Geel':'KFC Verbroedering Geel (- 2008)', 'Zulte Waregem':'SV Zulte Waregem', 'Verviétois':'Stade Verviétois', 'Eendracht Aalst':'KSC Eendracht Aalst', 'Olymp. Charleroi':'Olympic Charleroi', 'Heusden-Zolder':'Heusden-Zolder SK', 'Exc. Mouscron':'Excelsior Mouscron (- 2009)', 'Waterschei THOR':'Waterschei SV THOR (- 1988)', 'Moeskroen':'Royal Excel Moeskroen (-2022)', 'Daring Club':'Daring Club Brussel', 'VAC Beerschot':'VAC Beerschot (- 1999)', 'Union SG':'Union Saint-Gilloise', 'Germ. Beerschot':'Germinal Beerschot Antwerpen', 'K. St-Niklase SK':'K. Sint-Niklase SK', 'RRC Brüssel':'Royal Racing White Brüssel', 'Waasland-Beveren':'KVRS Waasland - SK Beveren', 'ARA Gent':'Association Royale Athlétique Gent', 'KSC Lokeren':'KSC Lokeren (- 2020)', 'RCC Schaerbeek':'Royal Crossing Club de Schaerbeek', 'Racing Jet':'Racing Jet Brussel', 'Mont.-sur-Sambre':'Royal Olympic Club de Montignies-sur-Sambre', 'La Louviere':'RAA La Louviere (- 2009)'}

stamnummers = []
for club in df['team_scoort']:
   nr = dic_stamnummers.get(club)
   if nr:
    stamnummers.append(nr)
   else:
    stamnummers.append(dic_stamnummers.get(dic_club_namen.get(club)))

df['stamnummer'] = stamnummers  

df.to_csv('doelpunten.csv', index=False)

