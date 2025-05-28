import pandas as pd

# CONTROLEREN OF ID'S VOORKOMEN IN DOELPUNTEN.CSV ALS TOTAALSCORE 0 IS

data = pd.read_csv('opgekuiste_data.csv')
games = pd.read_csv('games_clean.csv')

zero_scores_ids = games[(games['a_score'] == 0) & (games['b_score'] == 0)]['id'].tolist()

for idx, row in data.iterrows():
    if row['id'] in zero_scores_ids:
        print(f"ID {row['id']} komt voor in opgekuiste_data.csv ondanks dat a_score en b_score gelijk zijn aan 0.")

# Controleren of totaal score gelijk is aan het aantal doelpunten

max_home_away_per_id = data.groupby('id').agg({'thuis': 'max', 'uit': 'max'}).reset_index()

max_home_away_time = max_home_away_per_id.merge(games, on=['id'], how='inner')

unequal_scores = max_home_away_time[(max_home_away_time['thuis'] != max_home_away_time['a_score']) | 
                                     (max_home_away_time['uit'] != max_home_away_time['b_score'])]

if not unequal_scores.empty:
    print("Rijen waar 'thuis' en 'uit' niet overeenkomen met 'a_score' en 'b_score':")
    print(unequal_scores)
else:
    print("Alle 'thuis' en 'uit' scores komen overeen met 'a_score' en 'b_score'.")


# controleren of datum klopt

Time_equal = data.merge(games, on=['id'], how='inner')

unequal_Time= Time_equal[Time_equal['date'] != Time_equal['dt']]
if not unequal_Time.empty:
    print("Rijen waar 'nieuwe_tijd' niet overeenkomt met 'time':")
    print(unequal_Time)
