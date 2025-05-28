import pandas as pd

data = pd.read_csv('doelpunten.csv')
stamnummers_df = pd.read_csv('stamnummers.csv', sep=';', header=None)
games= pd.read_csv('games_clean.csv')

df = pd.merge(data, stamnummers_df[[0, 2]], left_on='a_clubid', right_on=0, how='left')
df.rename(columns={2: 'a_stamnummer'}, inplace=True)
df.drop(columns=[0], inplace=True)

df = pd.merge(df, stamnummers_df[[0, 2]], left_on='b_clubid', right_on=0, how='left')
df.rename(columns={2: 'b_stamnummer'}, inplace=True)
df.drop(columns=[0], inplace=True)

df = pd.merge(df, stamnummers_df[[0, 2]], left_on='id_scorend_team', right_on=0, how='left')
df.rename(columns={2: 'sc_stamnummer'}, inplace=True)
df.drop(columns=[0], inplace=True)

df.drop('a_clubid', axis=1, inplace=True)
df.drop('b_clubid', axis=1, inplace=True)
df.drop('id_scorend_team', axis=1, inplace=True)


df = pd.merge(df, games[['id', 'pday', 'season']], on='id', how='left')


df.drop_duplicates(inplace=True)

df.to_csv('opgekuiste_data.csv', index=False)
