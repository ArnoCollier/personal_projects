import pandas as pd

aa = pd.read_csv('./games_sn_clean.csv')

# Filter de rijen waar zowel 'b_score' als 'a_score' gelijk zijn aan 0
filtered_aa = aa[(aa['b_score'] == 0) & (aa['a_score'] == 0)]

# Bereken de som van het aantal rijen waar de voorwaarde waar is
total_rows_sum = len(filtered_aa)

print("Som van het aantal rijen waar de voorwaarde waar is:", total_rows_sum)
