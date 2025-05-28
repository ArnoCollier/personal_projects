import pandas as pd
stamnummers_df = pd.read_csv('stamnummers.csv', sep=';', header=None)
data=pd.read_csv('./PLODoel.csv')


data = data[~data['eindstand'].str.contains('-')]

# Splits score
data[['thuis', 'uit']] = data['eindstand'].str.split(':', expand=True)
data.drop('eindstand', axis=1, inplace=True)

# Filter alleen het uur
data['uur'] = data['uur'].str.split('-').str[-1].str.strip().str[:-4]

# Verander de datum
data['date'] = data['date'].str.replace('okt.', 'oct.').str.replace('mei', 'may.').str.replace('mrt.', 'mar.')
data['date'] = pd.to_datetime(data['date'], format='%d %b. %Y', errors='coerce')
data = data.dropna(subset=['date'])
data['date'] = data['date'].dt.strftime('%Y-%m-%d')



data = pd.merge(data, stamnummers_df[[0, 2]], left_on='a_clubid', right_on=0, how='left')
data.rename(columns={2: 'a_stamnummer'}, inplace=True)
data.drop(columns=[0], inplace=True)

data = pd.merge(data, stamnummers_df[[0, 2]], left_on='b_clubid', right_on=0, how='left')
data.rename(columns={2: 'b_stamnummer'}, inplace=True)
data.drop(columns=[0], inplace=True)

data.drop('a_clubid', axis=1, inplace=True)
data.drop('b_clubid', axis=1, inplace=True)
data.drop_duplicates(inplace=True)

data = data[['season', 'pday', 'date', 'uur', 'id','a_stamnummer', 'a_naam','b_stamnummer', 'b_naam','thuis', 'uit']]


data.to_csv('PLOwedstrijd.csv', sep=';', index=False, header=False)

